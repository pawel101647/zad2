# Etap 1
# --------------------------
FROM scratch AS builder

ADD alpine-minirootfs-3.23.3-x86_64.tar /

RUN apk update && \
    apk upgrade && \
    apk add --no-cache nodejs npm && \
    rm -rf /etc/apk/cache

# tworzenie użytkownika node
RUN addgroup -S node && adduser -S node -G node

USER node

WORKDIR /home/node/app

# kopiowanie plików
COPY --chown=node:node weatherApp/ .

RUN npm install


# Etap 2
# --------------------------
FROM node:alpine3.23

LABEL org.opencontainers.image.authors="Paweł Piwowarski"

RUN apk add --update --no-cache curl && \
    rm -rf /etc/apk/cache

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# kopiowanie plików z etapu builder
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/app/index.js ./index.js

# port aplikacji
EXPOSE 3000

# healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# uruchomienie aplikacji
ENTRYPOINT ["node", "index.js"]