FROM node:22-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build arg for API URL (needed at build time for Astro)
ARG QAU_PUBLIC_API_URL
ENV QAU_PUBLIC_API_URL=$QAU_PUBLIC_API_URL

# Build the application
RUN npm run build

# Production stage
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4321

CMD ["npm", "run", "preview"]
