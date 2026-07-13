# Pixora

A full-stack blogging platform built with React and Django REST Framework. Users can register, set up a profile, write and explore posts, follow other users, and see a personalized home feed.

## Features

- Email-based registration with a dedicated username setup flow
- Token-based authentication (login with username or email)
- Animated welcome screen for new users
- Create, view, and delete blog posts (title, content, optional image)
- Like and comment on posts
- Follow/unfollow other users
- Personalized home feed (posts from followed users) + Explore feed (all posts, with search)
- People suggestions screen with optional location access (skippable)

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Plain CSS

**Backend**
- Django
- Django REST Framework
- Token Authentication
- MySQL

## Project Structure

```
React-Django/
├── backend/
│   ├── api/          # Django app: models, views, serializers, urls
│   ├── backend/       # Django project settings
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, PostCard, IntroAnimation
│   │   ├── pages/        # Login, Register, Home, Explore, etc.
│   │   ├── api.js        # Centralized API calls
│   │   └── AuthContext.jsx
│   └── vite.config.js
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv env
env\Scripts\activate       # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

Create a `.env` file inside `backend/` with your database credentials:

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

## Versioning

This project uses Git tags to mark stable milestones:

- `v1.0` — Core app: auth, posts, follow system, MySQL integration

## License

This project is for personal/educational use.
