# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better cache)
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy sources and build
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

# Runtime stage (static files)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Optional: custom nginx config could go here if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 