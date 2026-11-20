#!/bin/sh
set -eu

runtime_root=/runtime
mkdir -p "$runtime_root/etc/apk"
cp -a /etc/apk/keys "$runtime_root/etc/apk/"
cp /etc/apk/repositories "$runtime_root/etc/apk/repositories"
cp /tmp/nginx-package/*.rsa.pub "$runtime_root/etc/apk/keys/"

# Install the exact signed package and its shared libraries into the final root.
apk --root "$runtime_root" --initdb --no-cache --no-scripts add \
    alpine-release /tmp/nginx-package/nginx-*.apk

# Nginx currently needs no Brotli decoder. If that changes, keep the previous
# CVE-2026-111497 version floor rather than introducing a vulnerable library.
if apk --root "$runtime_root" info --exists brotli-libs; then
    apk --root "$runtime_root" --no-cache --no-scripts add 'brotli-libs>=1.2.1-r0'
fi

mkdir -p "$runtime_root/etc/nginx/conf.d" \
    "$runtime_root/etc/nginx/snippets" "$runtime_root/usr/share/nginx/html" \
    "$runtime_root/app/logs" "$runtime_root/run" "$runtime_root/var/log/nginx" \
    "$runtime_root/var/cache/nginx" "$runtime_root/tmp"
cp /etc/passwd /etc/group "$runtime_root/etc/"
chmod 1777 "$runtime_root/tmp"
chown -R nginx:nginx "$runtime_root/app/logs" "$runtime_root/var/log/nginx" "$runtime_root/var/cache/nginx"

for package in nginx musl; do
    apk --root "$runtime_root" info --exists "$package"
done

for package in busybox busybox-binsh ssl_client libssl3 libcrypto3; do
    if apk --root "$runtime_root" info --exists "$package"; then
        echo "Unexpected runtime package: $package" >&2
        exit 1
    fi
done
openssl_files=$(find "$runtime_root" \( -name 'libssl.so*' -o -name 'libcrypto.so*' \) -print)
if [ -n "$openssl_files" ]; then
    printf 'Unexpected OpenSSL runtime library:\n%s\n' "$openssl_files" >&2
    exit 1
fi
test ! -e "$runtime_root/bin/busybox"
test ! -e "$runtime_root/bin/sh"
test ! -e "$runtime_root/sbin/apk"
test ! -e "$runtime_root/usr/sbin/apk"
test ! -e "$runtime_root/usr/bin/ssl_client"
