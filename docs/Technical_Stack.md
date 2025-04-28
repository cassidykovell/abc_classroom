# Technical Stack Document

## ABC Classroom

### Overview
This document outlines the technical stack used for the ABC Classroom, including frontend and backend technologies, database, authentication, and deployment infrastructure.

### Technology Stack Summary

| Component | Technology |
|-----------|------------|
| Frontend Framework | React |
| Frontend Build Tool | Vite |
| CSS Framework | Tailwind CSS |
| State Management | Apollo Client |
| Backend Framework | Express.js |
| API Layer | GraphQL with Apollo Server |
| Database | MongoDB |
| Authentication | JWT (JSON Web Tokens) |
| Deployment | Vercel |

### Frontend Stack

#### Core Technologies
- **React**: JavaScript library for building user interfaces
  - Version: 18.2.0
  - Purpose: Component-based UI development

- **Vite**: Frontend build tool
  - Version: 4.3.9
  - Purpose: Fast development server and optimized builds

- **React Router**: Client-side routing
  - Version: 6.4.2
  - Purpose: Navigation and routing between pages

#### State Management
- **Apollo Client**: GraphQL client
  - Version: 3.7.0
  - Purpose: Data fetching, caching, and state management

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
  - Version: 3.2.1
  - Purpose: Rapid UI development with predefined utility classes
  - Custom configuration: Pastel color palette

#### Authentication
- **JWT Decode**: Library for decoding JWT tokens
  - Version: 3.1.2
  - Purpose: Client-side token validation and user information extraction

### Backend Stack

#### Core Technologies
- **Node.js**: JavaScript runtime
  - Version: 16.x
  - Purpose: Server-side JavaScript execution

- **Express.js**: Web application framework
  - Version: 4.18.2
  - Purpose: HTTP server and middleware support

#### API Layer
- **Apollo Server Express**: GraphQL server
  - Version: 3.10.3
  - Purpose: GraphQL API implementation

- **GraphQL**: Query language for APIs
  - Version: 16.6.0
  - Purpose: Flexible data querying and manipulation

#### Database
- **MongoDB**: NoSQL database
  - Purpose: Document storage for users, activities, questions, and answers

- **Mongoose**: MongoDB object modeling
  - Version: 6.6.5
  - Purpose: Schema definition, validation, and query building

#### Authentication & Security
- **bcrypt**: Password hashing library
  - Version: 5.1.0
  - Purpose: Secure password storage

- **jsonwebtoken**: JWT implementation
  - Version: 8.5.1
  - Purpose: Token generation and verification for authentication

- **dotenv**: Environment variable management
  - Version: 16.0.3
  - Purpose: Configuration and secrets management

### Database Schema

#### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  activities: [ActivityID],
  savedActivities: [ActivityID]
}