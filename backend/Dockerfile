FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"] 