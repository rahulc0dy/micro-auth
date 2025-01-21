# Use an official Deno image as the base image
FROM denoland/deno:alpine-1.37.0

# Set the working directory inside the container
WORKDIR /app

# Copy the necessary files into the container
COPY . .

# Set environment variables (if needed)
ENV PORT=8000

# Cache and download Deno dependencies
RUN deno cache src/app.ts

# Define the default command to run the app
CMD ["run", "--allow-net", "--allow-env", "--allow-read", "src/index.ts"]
