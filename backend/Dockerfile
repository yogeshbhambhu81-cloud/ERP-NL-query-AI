# ─────────────────────────────────────────────────────────────
# WFX Backend — Production Dockerfile
# Node.js + Express API connecting to Supabase (hosted)
# ─────────────────────────────────────────────────────────────

FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install only production dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY src/ ./src/

# Create uploads directory for multer
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Set default environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "src/server.js"]
