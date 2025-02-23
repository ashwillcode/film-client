# Film React Application

A client-side application built with React that interfaces with a movie API, allowing users to browse and manage their favorite movies.

## 🎯 Features

- User authentication (signup/login)
- Browse movie collection
- View detailed movie information
- Add/remove movies to favorites
- Update user profile information
- Responsive design for all devices

## 🛠️ Technical Stack

- **Frontend Framework:** React 18
- **State Management:** Redux Toolkit
- **UI Framework:** React Bootstrap
- **Build Tool:** Parcel
- **API Integration:** REST API with JWT authentication
- **Testing:** Jest (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]

Install dependencies

bashCopynpm install

Start the development server

bashCopynpm start

Open your browser and navigate to http://localhost:1234

📦 Project Structure
Copysrc/
├── components/
│   ├── login-view/
│   ├── movie-card/
│   ├── movie-view/
│   └── profile-view/
├── redux/
│   ├── reducers/
│   │   ├── movies.js
│   │   └── user.js
│   └── store.js
└── index.jsx
🔄 Redux State Management
User Reducer

Manages authentication state
Handles user profile data
Manages favorite movies list
Stores JWT token

Movies Reducer

Stores movie collection
Handles selected movie state
Manages movie filtering/search

🔐 Authentication Flow

User logs in with credentials
JWT token received from API
Token stored in Redux state
Token included in subsequent API requests
Auto-logout on token expiration

🎨 UI Features

Responsive movie cards with hover effects
Interactive favorites system with real-time updates
User-friendly forms with validation
Modern, clean interface using Bootstrap components
Loading states and error handling
Toast notifications for user feedback

📱 Responsive Design
The application is fully responsive and optimized for:

Desktop browsers (1200px+)
Tablets (768px - 1199px)
Mobile devices (320px - 767px)

🔗 API Integration
Connects to a RESTful API providing:

Movie information CRUD operations
User authentication endpoints
Profile management
Favorites system
Search and filtering capabilities

📦 Build
To create a production build:
bashCopynpm run build
🧪 Testing (Optional)
Run the test suite:
bashCopynpm test
🤝 Contributing

Fork the repository
Create a feature branch
Commit your changes
Push to the branch
Open a pull request

📄 License
[Your chosen license]