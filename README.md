[![Test && Code-Style && Build && Deploy](https://github.com/ASD-Project-sharif/backend/actions/workflows/build.yml/badge.svg)](https://github.com/ASD-Project-sharif/backend/actions/workflows/build.yml)

# Online Ticket Platform

## Course Information

This project results from the Agile Software Development course led by Dr. Ramsin at Sharif University of Technology. For more details on the course, visit [here](https://sharif.edu/~ramsin/index_files/undergradcourse_ASD.htm).

## Overview

**Online Ticket Platform** is an online ticketing system that allows organizations to create accounts, add products, and appoint agents for ticket management. Users can submit tickets, set deadlines, and await responses. Notable features include ticket logs for admin tracking, user suspension for defense against malicious users, user-friendly search, ordering for agents, and the ability to add/edit tickets and their comments. Admins and agents can open/close tickets, and Swagger is integrated for improved front-back interaction.

## Technology Stack

- **Backend:** Node.js
- **Database:** MongoDB
- **Frontend:** React

## Security Measures

### Addressed Security Issues

1. **XSS Attack:** Implemented measures to prevent Cross-Site Scripting attacks.
2. **SQL Injection:** Applied safeguards to protect against SQL injection vulnerabilities.
3. **JWT Token:** Utilized JSON Web Tokens for secure authentication.
4. **Depth in Defense:** Employed a multi-layered defense strategy.

## Agile Practices

### Implemented Agile Practices

- **Refactoring:** Continuous improvement of code for enhanced maintainability.
- **Test:** Emphasized testing practices for robust and reliable code.
- **Swarming:** Collaborative efforts to solve complex problems and improve efficiency.
- **Meetings:** Regular meetings for status updates and issue resolution.
- **Pair Programming:** Collaborative coding to improve code quality.
- **WOW (Way of Working) Evolve:** Adapted and evolved the way of working as per project phases.
- **Methodology:** Used Lean in phase-1 and CD-Lean as DAD Methodology in phase-2.
- **CI/CD:** Continuous Integration/Continuous Deployment
- **Involvement of User:** Continuous engagement with users for feedback.
- **Review Code Standards:** Defined technical standards for code reviews.
- **Quick Design Session:** Rapid design sessions for efficient planning.
- **Kanban Board:** Utilized Kanban for project tracking.
- **Automated Build:** Implemented automated build processes.
- **Choice of Team Members:** Team members are assigned tasks based on their expertise.
- **Documentation:** Maintained comprehensive project documentation.
- **Limit WIP:** Implemented limits on work in progress for better focus.
- **Face to Face Communication:** Encouraged face-to-face communication for better collaboration.
- **MoSCoW:** Prioritized tasks using the MoSCoW method.

1. Clone the repository:
   ```bash
   git clone https://github.com/ASD-Project-sharif/onlineTicket.git
   cd onlineTicket
   docker-compose up -d
consider first you should create your .env file.
