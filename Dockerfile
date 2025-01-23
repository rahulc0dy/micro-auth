# Use an official Deno image as the base image
FROM denoland/deno:alpine-1.37.0

# Set the working directory inside the container
WORKDIR /app

# Add labels for metadata
LABEL maintainer="your-email@example.com" \
      version="1.0.0"

# Copy the necessary files into the container
COPY . .

# Set environment variables (if needed)
ENV PORT=8000 APP_ENV="production" LOG_LEVEL="info" LOG_DIR="/app/logs"

# Cache and download Deno dependencies
RUN deno cache src/index.ts

# Create and use non-root user
RUN addgroup -S deno && adduser -S deno -G deno
USER deno

# Define the default command to run the app
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"]

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
     CMD deno eval "try { await fetch('http://localhost:8000/api/v1/health-check/server').then(r => r.status === 200 ? Deno.exit(0) : Deno.exit(1)) } catch { Deno.exit(1) }"
