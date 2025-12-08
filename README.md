# Lumen Kids

**🚀 Deployed Application:** [https://lumenkids.web.app/chat]

---

## 📖 Short Description
Lumen Kids is an interactive "study buddy" application designed for children. It helps them focus on different school subjects, such as math, reading, science, and languages. Children can ask questions in their own words and get age-appropriate explanations from an AI friend, "CodeBuddy AI". The application also allows users to practice through small missions and quizzes, tracks their progress, highlights topics they find difficult, and encourages them to keep learning in a fun, motivating way.

---

## 🚦 Project Status

### ✅ What we have done
* **Framework Setup:** Initialized the project using **React** and **Vite**, configured **Tailwind CSS** for styling, and set up **Redux** for state management.
* **Firebase Integration:** Configured Firebase for hosting and Firestore for the database.
* **AI Integration:** Installed `genai` and implemented the initial connection to the AI API to generate answers and explanations.
* **App Layout & Views:** Created the main UI structure based on the Lumen Kids design, including:
    * **Dashboard:** Displays the "New Explorer" greeting, current level, and daily streaks.
    * **Missions:** Lists active tasks (e.g., "Loop de Loop") and completed missions.
    * **AI Chat:** Functional chat interface where kids can ask questions like "What is a loop?" and receive simplified answers.
    * **Stats/Profile:** Visualizes "Skill Analysis" (Loops, Syntax, Logic) and tracks XP.

### 🚧 What we still plan to do
* **Refine AI Prompts:** Further tune the AI to provide more age-specific analogies and mini-stories based on the child's profile.
* **User Settings:** Finalize the settings for UI language and dark/light mode preferences.
* **Advanced Progress Tracking:** Implement the logic to pinpoint specific weaknesses based on mission performance.
* **Mission Database:** Expand the Firestore database with more predefined missions (title, description, difficulty).

---

## 📂 Project File Structure

```text
/
├── .firebase/             # Firebase hosting cache and build settings
├── public/                # Static assets 
├── src/                   # Main application source code
│   ├── components/        # Reusable UI components 
│   ├── pages/             # Main views: Dashboard, Missions, Chat, Profile
│   ├── redux/             # Redux slices for state management
│   ├── App.jsx            # Main app component and routing
│   └── main.jsx           # Entry point
├── .firebaserc            # Firebase project aliases
├── eslint.config.js       # Linting configuration
├── firebase.json          # Firebase deployment configuration
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS theme configuration
└── vite.config.js         # Vite build configuration
