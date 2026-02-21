FROM nginx:alpine

# Copy all demo files to nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Copy assets and data (these directories exist in the repo)
COPY assets/ /usr/share/nginx/html/assets/
COPY data/ /usr/share/nginx/html/data/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
