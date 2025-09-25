# Multi-Document-Summarization-PROJECT
This was about Summarizing the all type of Documents

#🚀 React App Starter

This repository contains a React starter project with a clean folder structure and some pre-configured files to help you get started quickly.

📦 Getting Started
1. Create a React App

2. Make sure you have Node.js and npm (or yarn) installed. Then run:

  npx create-react-app your-project-name
  
  cd your-project-name

3. Replace / Add Files

  Once the app is created, replace the default files with the ones from this repository:

  Copy the contents of this repository into your folders.

  Overwrite existing files if prompted.

  Install dependencies (if any extra packages are listed in package.json):

  npm install

3. Run the App

  Start the development server:

  npm start


#The app will run on http://localhost:3000
 🎉

#📂 Folder Structure

Here’s the folder structure after setup:

project-root/
│
├── backend/                     # Backend (FastAPI / Flask / etc.)
│   ├── app/
│   │   ├── file_processor.py
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── summarizer.py
│   │
│   ├── model/
│   │   └── response_models.py
│   │
│   ├── venv/                    # Virtual environment
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Example environment variables
│   └── __pycache__/             # Auto-generated cache
│
├── frontend/                    # Frontend (React)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── DocumentSummarizer.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SummaryResults.jsx
│   │   │   └── TextInput.jsx
│   │   │
│   │   ├── services/            # API calls and utilities
│   │   │   └── api.js
│   │   │
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── node_modules/
│
├── .gitignore
├── README.md
└── LICENSE


# Backend run Process
-> open new terminal and keep the front terminal don't remove it.

1.Run the command in that terminal:

pip install requirements.txt

2.Activate the venv:

.\venv\Scripts\activate

3.Then the backend :

uvicorn app.main:app --reload --port 8000

#Backend is Ready 😍

🛠️ Available Scripts

In the project directory, you can run:

npm start – Runs the app in development mode.

✨ Features

Clean and organized folder structure

Ready-to-use React setup

Easy to customize and extend
