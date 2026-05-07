# Stage 1: Build React/Vite Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY ../frontend/package.json ../frontend/package-lock.json* ./
# Use clean install for reproducible builds (if package-lock exists), otherwise standard install
RUN npm install

# Copy source code
COPY ../frontend/ ./

# Define build arguments to be passed as environment variables during build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite application for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
