# Lumen Kids

**🚀 Deployed Application:** https://lumenkids.web.app

---

## 📖 Short Description
Lumen Kids is an interactive study companion for children, designed to support learning through short missions, progress tracking, and an AI assistant. The application helps students explore different subjects, practice regularly, and stay motivated through clear feedback, daily goals, and guided learning paths.

An integrated AI buddy, **CodeBuddy AI**, allows users to ask questions in their own words and receive age-appropriate explanations, while the mission system helps structure learning and track progress over time.

---

## ⚙️ Project Setup

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

### Installation
```bash
git clone <repository-url>
cd oaomar-ritwan-samiee-HT25-Project
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_AI_API_KEY=your_ai_key
```

### Run Locally
```bash
npm run dev
```

### Build & Deploy
```bash
npm run build
firebase deploy
```

---

## 🚦 Project Status

### ✅ Implemented Features
- **Framework Setup:** Built using React and Vite, styled with Tailwind CSS, and structured with Redux Toolkit for application state management.
- **Firebase Integration:** Firebase Authentication and Firestore used for user login and per-user data persistence.
- **AI Integration:** Integrated Google Generative AI to provide age-appropriate explanations through the AI buddy.
- **Dashboard:**
  - Overview of user progress
  - Daily goals to help users decide what to focus on before starting a session
- **Courses & Missions:**
  - Structured learning paths
  - Sequential mission locking to guide progression
  - Clear visual feedback for completed missions using green outlines
- **AI Buddy:**
  - Interactive chat interface
  - Support for multiple chat conversations, allowing users to separate topics and revisit earlier discussions

---

## 🧩 Architecture Overview
The application follows a Presenter–View–State architecture:
- Views contain only UI logic.
- Presenters handle user interaction, navigation, and dispatch actions.
- Application state is centralized using Redux Toolkit.
- Persistence is handled through Firebase Firestore and Authentication via model functions and Redux side effects.

This separation ensures clear responsibility boundaries, maintainability, and scalability.

---

## 🧑‍🤝‍🧑 User-Visible Third-Party Components
The project uses the following user-visible third-party libraries:
- React Router for navigation between dashboard, courses, missions, and AI chat
- Firebase Authentication and Firestore for login flow and persistent user data
- Tailwind CSS for layout, responsiveness, and visual feedback
- Google Generative AI SDK for AI buddy responses and explanations

All third-party components are integrated consistently with the application architecture and are visible through user interaction and UI behavior.

---

## 📂 Project File Structure

```
/
├── public/                Static assets
├── src/
│   ├── components/        Reusable UI components
│   ├── views/             Pure view components (UI only)
│   ├── presenters/        Interaction and navigation logic
│   ├── store/             Redux slices for application state
│   ├── models/            Firebase and API interaction logic
│   ├── App.jsx            Application composition and routing
│   └── main.jsx           Entry point
├── .firebaserc            Firebase project aliases
├── firebase.json          Firebase deployment configuration
├── package.json           Project dependencies
├── tailwind.config.js     Tailwind CSS configuration
└── vite.config.js         Vite build configuration
```

---

## 📌 Project Status
The core functionality is fully implemented and deployed. The project has been refined based on user evaluation, focusing on clarity, feedback, motivation, and structured learning rather than adding unnecessary complexity.
