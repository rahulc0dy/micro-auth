FROM oven/bun:alpine AS base

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile

# Copy application files
COPY . .

# Expose application port
EXPOSE 8000

# Add health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD curl -f http://localhost:8000/api/v1/health-check/server || exit 1

# Run the application
CMD ["bun", "run", "."]
