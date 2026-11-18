FROM apify/actor-node:22 AS builder

COPY package*.json ./
RUN npm install --include=dev

COPY . ./
RUN npm run build

FROM apify/actor-node:22

RUN if command -v apt-get >/dev/null 2>&1; then \
    apt-get update && apt-get install -y \
      xvfb \
      x11vnc \
      fluxbox \
      libgtk-3-0 \
      libnotify4 \
      libnss3 \
      libxss1 \
      libasound2 \
    && rm -rf /var/lib/apt/lists/*; \
  else \
    echo "apt-get not found — skipping GUI system packages. If you need these, choose a Debian-based base image or install them in a custom image."; \
  fi

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.actor ./.actor
COPY --from=builder /usr/src/app/README.md ./README.md

RUN npm install --only=prod --no-optional

ENV DISPLAY=:99

CMD if command -v Xvfb >/dev/null 2>&1; then Xvfb :99 -screen 0 1920x1080x24 & sleep 2; fi && node dist/main.js
