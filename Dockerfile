# Stage 1: Build the Docusaurus application
FROM node:22.23.4 AS build

ARG APP_ENV

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

RUN echo "Build environment is ${APP_ENV}"

RUN node -v

# Install dependencies
RUN yarn config set network-timeout 600000 -g \
    && i=0 \
    && until yarn install --frozen-lockfile; do \
          i=$((i+1)); \
          if [ "$i" -ge 3 ]; then exit 1; fi; \
          sleep 10; \
        done

# Copy the rest of the application code
COPY . .

# Build the Docusaurus app
RUN yarn build

# Stage 2: Assemble the Nginx runtime without BusyBox (CVE-2025-60876).
# Package installation and inspection tools stay in this intermediate stage.
FROM nginx:1.31-alpine3.24 AS runtime-files

RUN apk upgrade --no-cache \
    && apk add --no-cache 'brotli-libs>=1.2.1-r0' scanelf

COPY scripts/prepare-nginx-runtime.sh /usr/local/bin/prepare-nginx-runtime
RUN sh /usr/local/bin/prepare-nginx-runtime

COPY nginx.conf /runtime/etc/nginx/nginx.conf
COPY default.conf /runtime/etc/nginx/conf.d/default.conf
COPY --from=build /app/.site-security/nginx-headers.conf /runtime/etc/nginx/snippets/security-headers.conf
COPY --from=build /app/build /runtime/usr/share/nginx/html

# Stage 3: Only the server, its shared libraries, package inventory and site ship.
# The upstream shell entrypoint is unnecessary: all configuration is copied above.
FROM scratch AS runtime
COPY --from=runtime-files /runtime/ /

RUN ["/usr/sbin/nginx", "-t"]

# Expose port 80
EXPOSE 80

STOPSIGNAL SIGQUIT

# Command to run Nginx
ENTRYPOINT ["/usr/sbin/nginx"]
CMD ["-g", "daemon off;"]
