# MorningNews – Frontend

Frontend of **MorningNews**, a fullstack news web application built with Next.js and React.

The app allows users to browse live news articles, create an account, sign in, and save articles to their personal bookmarks.  
This project was developed during the **La Capsule Web Development Bootcamp** and extended as a portfolio project.

---

## Project Goals

- Build a complete **frontend architecture** with a modern React stack
- Implement **authentication flows** (sign-up / sign-in)
- Manage global state efficiently using Redux
- Consume and display data from an external news API
- Focus on **UX, responsiveness, and clean code structure**

---

## Features

- User authentication (sign-up / sign-in)
- Live news fetching from an external API
- Bookmark articles (user-specific)
- Global state management with Redux Toolkit
- Persistent state with Redux Persist
- Error handling and user feedback
- Responsive UI

---

## Tech Stack

- **Next.js**
- **React**
- **Redux Toolkit**
- **Redux Persist**
- **Ant Design**
- **Font Awesome**
- **Moment.js**
- **Jest & React Testing Library**

---

## Project Structure

frontend/
├── components/     # Reusable UI components
├── pages/          # Next.js pages
├── reducers/       # Redux slices
├── styles/         # CSS modules
├── public/         # Static assets
└── package.json

---

## Installation & Setup

1. Clone the repository:

git clone https://github.com/Thomas-Bhs/MorningNews-Frontend.git

2.	Install dependencies:
yarn install

3.	Start the development server:
yarn dev


The application runs on http://localhost:3001

---

## Backend Dependency

This frontend communicates with the MorningNews backend API.

Make sure the backend server is running before starting the frontend.

Backend repository: https://github.com/Thomas-Bhs/MorningNews-Backend

## Author

Thomas Bourchis
Junior Fullstack Web Developer