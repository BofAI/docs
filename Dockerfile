# Stage 1: Build the Docusaurus application
FROM node:22.23.4 AS build

ARG APP_ENV

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

RUN echo "Build environment is ${APP_ENV}"

# Set Node build options
ENV NODE_OPTIONS=--openssl-legacy-provider

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

# Stage 2: Serve the application with Nginx
# Pin the Alpine branch so security fixes come from the same branch's repository.
FROM nginx:1.31-alpine3.24

# CVE-2026-111497: brotli-libs must be 1.2.1-r0 or a later fix from the Alpine 3.24 repository.
# apk fails, and so does the build, if the repository cannot satisfy the constraint.
RUN apk add --no-cache --upgrade 'brotli-libs>=1.2.1-r0'

# Create the log directory used in nginx.conf
RUN mkdir -p /app/logs

# Set the correct ownership and permissions for the log directory
RUN chown -R nginx:nginx /app/logs && \
    chmod -R 755 /app/logs

# Copy custom configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/

# Set ownership and permissions for the application files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Copy the built Docusaurus app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
