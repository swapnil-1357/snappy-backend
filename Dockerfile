# Use official Node.js LTS Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of the source code
COPY . .

# Expose app port
EXPOSE 3000

# Use a non-root user for security (optional but recommended)
RUN addgroup app && adduser -S -G app app
USER app

# Start the application
CMD ["node", "index.js"]
