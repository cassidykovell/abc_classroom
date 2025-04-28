# Frontend Guidelines

## Folder Structure
src/
├── components/         # Reusable UI components
│   ├── ActivityCard.js
│   ├── AnswerCard.js
│   ├── Navbar.js
│   ├── ProfileActivityCard.js
│   └── QuestionCard.js
├── pages/              # Page components
│   ├── ActivityDetail.js
│   ├── AskQuestion.js
│   ├── Discussions.js
│   ├── Home.js
│   ├── Login.js
│   ├── Profile.js
│   ├── QuestionDetail.js#### Core Technologies
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
│   ├── Signup.js
│   └── UploadActivity.js
├── utils/              # Utility functions and constants
│   ├── auth.js         # Authentication utilities
│   ├── mutations.js    # GraphQL mutations
│   └── queries.js      # GraphQL queries
├── App.js              # Main application component with routes
└── index.js            # Application entry point


