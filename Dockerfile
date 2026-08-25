# Use official Node.js 20 LTS Alpine image for minimal footprint
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose application port
EXPOSE 8001

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=8001

# Start the application
CMD ["npm", "start"]
