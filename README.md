# Authentication App

A modern, responsive, and vanilla JavaScript authentication application built with Vite and FreeAPI. This project demonstrates a complete frontend authentication flow including user registration, login, session management, and secure logout.

## 🌟 Features

- **Full Authentication Flow**: Seamless user registration, login, and logout.
- **Session Management**: Automatically hydrates the user session on reload using stored access tokens.
- **Premium User Interface**: Features a beautiful glassmorphic design, dynamic background gradients, custom typography (Outfit font), and smooth micro-animations.
- **Custom Toast Notifications**: Built-in, dependency-free toast system for displaying success and error messages from the API.
- **Interactive States**: Buttons feature loading spinners and disable themselves during active network requests to prevent duplicate submissions.

## 🛠️ Tech Stack

- **HTML5**: Semantic structure.
- **CSS3 / Vanilla CSS**: Advanced styling including CSS variables, backdrop-filters, and custom keyframe animations. No external CSS frameworks were used, ensuring maximum control and performance.
- **Vanilla JavaScript (ES6+)**: Handles all application logic, DOM manipulation, state management, and API calls.
- **Vite**: Next-generation frontend tooling for a fast and lean development experience.
- **FreeAPI**: Provides the backend endpoints for the authentication system.

## 🔌 API Endpoints Used

The application integrates with the [FreeAPI Authentication Module](https://api.freeapi.app/api/v1/users/):

- `POST /register`: Creates a new user account.
- `POST /login`: Authenticates a user and returns an access token.
- `GET /current-user`: Fetches the currently logged-in user's profile details using the stored token.
- `POST /logout`: Clears the active session securely.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahi0349/Authentication_app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Authentication_app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the provided `localhost` link in your browser to view the app!

## 📝 License

This project is open-source and available under the MIT License.
