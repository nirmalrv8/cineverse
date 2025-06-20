# Stage 1: Build the app
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the built app
FROM node:18

WORKDIR /app

# Copy only the built app and dependencies
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 4000

# Start the app
CMD ["npm", "run", "start"]
