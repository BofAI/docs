#!/bin/sh
set -eu

runtime_root=/runtime
mkdir -p "$runtime_root/etc/apk"
cp -a /etc/apk/keys "$runtime_root/etc/apk/"
cp /etc/apk/repositories "$runtime_root/etc/apk/repositories"

# Install only ELF dependencies, without maintainer scripts or a shell.
# APK retains the real inventory for every installed library.
runtime_deps=$(scanelf --needed --nobanner --format '%n#p' /usr/sbin/nginx | tr ',' '\n' | sed 's/^/so:/')
test -n "$runtime_deps"
# Intentional splitting: each line is a separate shared-library dependency.
# shellcheck disable=SC2086
apk --root "$runtime_root" --initdb --no-cache --no-scripts add \
    alpine-release $runtime_deps

# Nginx currently needs no Brotli decoder. If that changes, keep the previous
# CVE-2026-111497 version floor rather than introducing a vulnerable library.
if apk --root "$runtime_root" info --exists brotli-libs; then
    apk --root "$runtime_root" --no-cache --no-scripts add 'brotli-libs>=1.2.1-r0'
fi

mkdir -p "$runtime_root/usr/sbin" "$runtime_root/etc/nginx/conf.d" \
    "$runtime_root/etc/nginx/snippets" "$runtime_root/usr/share/nginx/html" \
    "$runtime_root/app/logs" "$runtime_root/run" "$runtime_root/var/log/nginx" \
    "$runtime_root/var/cache/nginx" "$runtime_root/tmp"
cp /usr/sbin/nginx "$runtime_root/usr/sbin/nginx"
cp /etc/nginx/mime.types "$runtime_root/etc/nginx/mime.types"
cp /etc/passwd /etc/group "$runtime_root/etc/"
chmod 1777 "$runtime_root/tmp"
chown -R nginx:nginx "$runtime_root/app/logs" "$runtime_root/var/log/nginx" "$runtime_root/var/cache/nginx"

for license_dir in /usr/share/licenses/nginx /usr/share/doc/nginx; do
    if [ -d "$license_dir" ]; then
        mkdir -p "$runtime_root$(dirname "$license_dir")"
        cp -a "$license_dir" "$runtime_root$license_dir"
    fi
done

# Nginx is copied from the official upstream image, rather than installed with its
# /bin/sh maintainer-script dependency. Preserve its original APK inventory so
# the runtime vulnerability scan still includes Nginx itself.
source_db=/lib/apk/db/installed
runtime_db="$runtime_root/lib/apk/db/installed"
if [ ! -f "$source_db" ]; then source_db=/usr/lib/apk/db/installed; fi
if [ ! -f "$runtime_db" ]; then runtime_db="$runtime_root/usr/lib/apk/db/installed"; fi
nginx_record=$(awk 'BEGIN { RS="" } /(^|\n)P:nginx(\n|$)/ { print }' "$source_db")
test -n "$nginx_record"
printf '\n%s\n\n' "$nginx_record" >> "$runtime_db"

for package in nginx musl; do
    apk --root "$runtime_root" info --exists "$package"
done

for package in busybox busybox-binsh ssl_client; do
    if apk --root "$runtime_root" info --exists "$package"; then
        echo "Unexpected runtime package: $package" >&2
        exit 1
    fi
done
test ! -e "$runtime_root/bin/busybox"
test ! -e "$runtime_root/bin/sh"
test ! -e "$runtime_root/sbin/apk"
test ! -e "$runtime_root/usr/sbin/apk"
test ! -e "$runtime_root/usr/bin/ssl_client"
