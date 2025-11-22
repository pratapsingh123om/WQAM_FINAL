# --- Build Stage ---
    FROM node:20 AS build
    WORKDIR /app
    
    # 1. Copy package files first
    COPY package*.json ./
    
    # CRITICAL FIX: Clean up old cache and perform a clean install
    # This prevents the "Cannot find module @rollup/rollup-linux-x64-gnu" error
    RUN rm -rf package-lock.json node_modules && npm install
    
    # 2. Copy the rest of the application
    COPY . .
    
    # 3. Build the app
    RUN npm run build
    
    # --- Production Stage (Nginx) ---
    FROM nginx:latest
    # Copy nginx config
    COPY ./nginx.conf /etc/nginx/conf.d/default.conf
    # Copy built assets from build stage
    COPY --from=build /app/dist /usr/share/nginx/html
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]