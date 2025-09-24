# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

# Stage 2: Serve the application using NGINX
FROM nginx:1.27-alpine AS server
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy a custom NGINX config if you have one to handle client-side routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]