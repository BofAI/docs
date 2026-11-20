# Stage 1: Build the Docusaurus application
FROM node:22.23.4 AS build

ARG APP_ENV

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./
COPY scripts/patch-picomatch.mjs ./scripts/

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

# Build a signed HTTP-only package. abuild records the compiled ELF dependencies.
FROM alpine:3.24 AS nginx-build
RUN apk add --no-cache abuild build-base pcre2-dev zlib-dev \
    && adduser -D -G abuild builder
WORKDIR /home/builder/docs/nginx
COPY docker/nginx/APKBUILD .
RUN chown builder:abuild . \
    && su builder -c 'abuild-keygen -an' \
    && cp /home/builder/.abuild/*.rsa.pub /etc/apk/keys/ \
    && su builder -c 'abuild' \
    && mkdir /out \
    && cp /home/builder/packages/docs/*/nginx-*.apk /home/builder/.abuild/*.rsa.pub /out/ \
    && rm /home/builder/.abuild/*.rsa

# Resolve current Alpine libraries for the actual binary on every CI build.
FROM alpine:3.24 AS runtime-files
RUN addgroup -S -g 101 nginx \
    && adduser -S -D -H -u 101 -G nginx -s /sbin/nologin nginx

COPY --from=nginx-build /out/ /tmp/nginx-package/
COPY scripts/prepare-nginx-runtime.sh /usr/local/bin/prepare-nginx-runtime
RUN sh /usr/local/bin/prepare-nginx-runtime

COPY nginx.conf /runtime/etc/nginx/nginx.conf
COPY default.conf /runtime/etc/nginx/conf.d/default.conf
COPY --from=build /app/.site-security/nginx-headers.conf /runtime/etc/nginx/snippets/security-headers.conf
COPY --from=build /app/build /runtime/usr/share/nginx/html

# Only the server, its shared libraries, package inventory and site ship.
FROM scratch AS runtime
COPY --from=runtime-files /runtime/ /

RUN ["/usr/sbin/nginx", "-t"]

# Expose port 80
EXPOSE 80

STOPSIGNAL SIGQUIT

# Command to run Nginx
ENTRYPOINT ["/usr/sbin/nginx"]
CMD ["-g", "daemon off;"]
