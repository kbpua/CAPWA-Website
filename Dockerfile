# Stage 1: Build the application
# Using node:20 (Debian-based) instead of Alpine for glibc support
# Required for @rolldown/binding-linux-x64-gnu and other platform-specific packages
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Using npm install instead of npm ci to handle engine version mismatches
# The --legacy-peer-deps flag helps with peer dependency issues
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production server
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

