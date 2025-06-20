# Stage 1: Build
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the full source code
COPY . .

# Build the NestJS app (compiles TypeScript to JavaScript in dist/)
RUN npm run build

# Stage 2: Production container
FROM node:18

# Set working directory
WORKDIR /app

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Optional: Copy environment variables if needed
COPY .env .env

# Start the app
CMD ["node", "dist/main"]
