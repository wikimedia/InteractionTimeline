FROM docker-registry.tools.wmflabs.org/toolforge-php72-sssd-web

# Set the host domain on Linux.
# see https://github.com/docker/for-linux/issues/264
RUN apt-get update && apt-get install -y \
			iputils-ping \
			iproute2 \
		--no-install-recommends && rm -r /var/lib/apt/lists/*

ENV COMPOSER_ALLOW_SUPERUSER 1

CMD ["./var/www/bin/start"]
