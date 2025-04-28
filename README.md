# ABC Classroom

A web application designed for elementary school teachers to share, discover, and discuss educational activities. This platform serves as a centralized hub where educators can upload their teaching materials, find resources created by others, engage in professional discussions, and build a supportive community.

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Application Flow Document](docs/Application_Flow.md)
- [Technical Stack Document](docs/Technical_Stack.md)
- [Frontend Guidelines](docs/Frontend_Guidelines.md)

### Activity Management
- **Upload Activities**: Share your teaching resources with detailed information
- **Browse Activities**: Discover activities by subject, grade level (K-5), and tags
- **Save Activities**: Build a personal collection of favorite resources
- **Delete Activities**: Remove your own activities when they're no longer needed

### Discussion Board
- **Ask Questions**: Seek advice from fellow educators on teaching strategies
- **Answer Questions**: Share your expertise with the community
- **Accept Answers**: Mark helpful responses as accepted answers
- **Search Discussions**: Find relevant conversations by topic

### User Management
- **Secure Authentication**: Create an account, log in, and log out securely
- **User Profiles**: View your uploaded and saved activities
- **Activity Management**: Save, unsave, and delete activities from your profile

### Frontend
- React 18
- Vite
- Apollo Client
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- GraphQL with Apollo Server
- MongoDB with Mongoose
- JWT Authentication

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/teacher-activity-platform.git
   cd teacher-activity-platform