# Build backend
FROM maven:3.8-openjdk-17 AS backend-build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# Build frontend
FROM node:16 AS frontend-build
WORKDIR /app
COPY frontend /app
RUN npm install && npm run build

# Runtime image
FROM openjdk:17-slim
WORKDIR /app
COPY --from=backend-build /app/target/*.jar /app/backend.jar
COPY --from=frontend-build /app/build /app/frontend

# Install Node.js for serving frontend
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install serve
RUN npm install -g serve

# Create start script
COPY <<EOF /app/start.sh
#!/bin/bash
java -Xmx256m -Xss512k -XX:+UseSerialGC -jar /app/backend.jar &
cd /app/frontend && serve -s . -l 3000
EOF

RUN chmod +x /app/start.sh

EXPOSE 8080 3000
CMD ["/app/start.sh"]