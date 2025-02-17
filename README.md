# Ride Service Backend

This project is a microservices-based backend system for a ride service application. It is built using **Node.js**, **Express**, **RabbitMQ**, and **MongoDB**, with **Redis** for real-time location tracking and caching.

---

## Architecture Overview

The system follows a microservices architecture with the following main services:

- **User Service**: Handles user authentication and profile management.
- **Captain Service**: Manages captains (drivers) and their availability.
- **Ride Service**: Handles ride requests, assignments, and ride status updates.
- **Location Service**: Uses Redis to store and retrieve the real-time locations of captains.
- **RabbitMQ**: Facilitates asynchronous messaging between services.

---

## Technologies Used

- **Node.js & Express**: Backend framework for building REST APIs.
- **MongoDB**: NoSQL database for storing user, captain, and ride details.
- **RabbitMQ**: Message broker for handling ride request distribution.
- **Redis**: Used for caching and real-time location tracking.
- **Axios**: For making API requests between services.
- **Dotenv**: Manages environment variables.
- **JWT (JSON Web Tokens)**: For secure user authentication.

---

## Workflow

1. A rider requests a ride by providing pickup and drop locations.
2. The system retrieves nearby available captains using Redis.
3. The ride request is published to RabbitMQ, notifying available captains.
4. Captains receive the request and can accept or reject it.
5. Once a captain accepts, the ride is assigned, and further status updates are managed.

---

## Future Enhancements

- Implement **WebSockets** for real-time ride updates.
  
---

## Scalability & Real-Time Processing

This backend is designed for **scalability**, ensuring high availability and real-time processing of ride requests.

---
