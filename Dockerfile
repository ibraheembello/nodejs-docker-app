# Small, production-oriented image for the Node.js app.
FROM node:18-alpine

# Create and use an unprivileged working directory.
WORKDIR /usr/src/app

# Install dependencies from the lockfile first so this layer is cached until the
# manifest changes. The app has no runtime dependencies, so this is fast and the
# install is fully reproducible (npm ci installs exactly what the lockfile pins).
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the application source.
COPY app.js ./

# Run as the built-in non-root "node" user for a smaller attack surface.
USER node

EXPOSE 3000
CMD ["node", "app.js"]
