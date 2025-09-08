# Stage 1: Build the application with a valid base image
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src src
# Build the application using Maven
RUN mvn clean package -DskipTests

# Stage 2: Create the final Docker image using OpenJDK 17
FROM openjdk:17-jdk
VOLUME /tmp
# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080