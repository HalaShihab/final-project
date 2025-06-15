# Recipe Organizer Backend

This is the backend for the Recipe Organizer application. It's built with Flask and SQLAlchemy, providing a RESTful API for managing recipes.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

To run the application:

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Users
- POST `/api/users` - Create a new user

### Recipes
- GET `/api/recipes` - Get all recipes
- GET `/api/recipes/<id>` - Get a specific recipe
- POST `/api/recipes` - Create a new recipe
- PUT `/api/recipes/<id>` - Update a recipe
- DELETE `/api/recipes/<id>` - Delete a recipe

## Database Schema

### User
- id (Primary Key)
- username (String, unique)
- email (String, unique)

### Recipe
- id (Primary Key)
- title (String)
- instructions (Text)
- created_at (DateTime)
- user_id (Foreign Key)
- ingredients (Relationship to Ingredient)

### Ingredient
- id (Primary Key)
- name (String)
- quantity (String)
- recipe_id (Foreign Key)
