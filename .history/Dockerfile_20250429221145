# Use official Node.js image to build the app
FROM node:18 AS builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source
COPY . .

# Build the app for production
RUN npm run build

# Use nginx to serve the build
FROM nginx:alpine

# Copy built React app to nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]