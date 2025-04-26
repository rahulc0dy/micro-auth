# Use the official Bun image
FROM oven/bun:latest as base

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Expose your app's port
EXPOSE 8000

# Run the Bun app
CMD [ "bun", "run", "src/index.ts" ]