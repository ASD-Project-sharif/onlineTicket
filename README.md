[![Test && Code-Style && Build && Deploy](https://github.com/ASD-Project-sharif/backend/actions/workflows/build.yml/badge.svg)](https://github.com/ASD-Project-sharif/backend/actions/workflows/build.yml)
# Agile Practices in Online Ticket Platform

## Refactoring
After completing each section, we adhered to the threefold repetition rule. Refactoring processes involved debugging, adding sequential functions, and reorganizing code during code reviews. In the backend refactoring, the following aspects were emphasized:
- Achieving a layered structure.
- Using appropriate naming conventions for files, functions, and variables.
- Eliminating code duplications.
- Decomposing large functions to reduce complexity.
- Enhancing cohesion among different modules and reducing coupling.
- Improving code style.
- Following a unified coding standard and convention.
- Breaking down processes and preventing the creation of multi-purpose code files.

Additionally, in the frontend refactoring, unnecessary functions were removed, and mock objects were accompanied by componentization.

*Note: Google JavaScript code style was enforced in the CI/CD pipeline.*

## Test
To ensure software testing, various levels of tests were designed using mock objects. These tests are executed in the CI/CD pipeline, ensuring the functionality of the software. Only successful test runs allow the deployment of all these tests on production.

## Swarming

## Online Ticket Platform

Welcome to the Online Ticket Platform, a web application developed for Agile Software Development course under the guidance of Dr. Ramsin Khoshabeh at Sharif University of Technology.

## Overview

This project provides an online ticketing platform where organizations can create accounts, add products, and assign agents to respond to tickets. Users can submit tickets for organizations and await their responses. Noteworthy features include ticket logs for admin tracking, user suspension for defense against malicious users, user-friendly search and ordering for agents, and the ability to add/edit tickets and their comments. Admins and agents can also open/close tickets.

## Technology Stack

- **Backend:**
  - Node.js
  - MongoDB (as the database)
  
- **Frontend:**
  - React

## Security Measures

### Cross-Site Scripting (XSS) Protection

The software is designed to properly sanitize and cleanse user inputs in HTTP requests, preventing XSS attacks. This is crucial for protecting sensitive information in comments and other user inputs.

### API Versioning

Multiple versions of the API are defined, with security updates and improvements automatically directing users to newer and safer versions. This ensures that software security is enhanced, and quick responses to new threats are provided.

### JSON Web Tokens (JWT) for Web Tokens

JWTs are employed for managing user credentials and identity verification. User credential information is encrypted and signed in transportable tokens. This method enhances software security and swiftly responds to new threats, such as Cross-Site Request Forgery (CSRF) attacks and token tampering.

### SQL Injection Prevention

Query parameterization is utilized to prevent SQL injection attacks. This ensures that user inputs are properly sanitized, protecting against malicious attempts to manipulate database queries.

### Depth in Defense

Security layers and access restrictions are implemented across all layers (front and back-end) to safeguard the application comprehensively.

## Dockerization

The project is Dockerized, allowing users to easily pull and run the application using Docker Compose. This facilitates a seamless deployment process and ensures consistency across different environments.

## Swagger Documentation

To enhance integration with the frontend, Swagger documentation is provided at the `/api-docs` route. This comprehensive documentation simplifies interaction with the backend API.

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/ASD-Project-sharif/onlineTicket.git
   cd onlineTicket

