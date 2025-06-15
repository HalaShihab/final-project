# Recipe Management Application

A full-stack web application for managing and sharing recipes, built with React and Flask.

## Project Structure

The project consists of two main parts:
- `flask/` - Backend API built with Flask
- `react/` - Frontend application built with React, TypeScript, and Tailwind CSS

## Features

- Browse recipes on the homepage
- View detailed recipe information
- Add new recipes
- RESTful API backend with Flask
- Modern, responsive UI with React and Tailwind CSS

## Getting Started

### Backend Setup

1. Navigate to the Flask directory:
```bash
cd flask
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the React directory:
```bash
cd react
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Tech Stack

Backend:
- Flask (Python web framework)
- SQLite database

Frontend:
- React
- JavaScript
- Tailwind CSS
- Vite (Build tool)

## API Documentation

For detailed API documentation, please refer to `flask/api_examples.md`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request
