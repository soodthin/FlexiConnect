# Stage 1: Build the application with a valid base image
FROM maven:3.8.6-eclipse-temurin-17 AS build

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# CHỈ sao chép file pom.xml và source code của backend
COPY pom.xml .
COPY src ./src

# CHỈ build backend, không cần profile gì cả
RUN mvn clean package -DskipTests

# Stage 2: Create the final Docker image using OpenJDK 17
FROM openjdk:17-jdk
VOLUME /tmp

# Copy the JAR từ stage build
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080