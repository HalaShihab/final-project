from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    recipes = db.relationship('Recipe', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    ingredients = db.relationship('Ingredient', backref='recipe', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'instructions': self.instructions,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id,
            'ingredients': [ingredient.to_dict() for ingredient in self.ingredients]
        }

class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'recipe_id': self.recipe_id
        }

def get_or_create_default_user():
    default_user = User.query.filter_by(username='default').first()
    if not default_user:
        default_user = User(
            username='default',
            email='default@example.com'
        )
        db.session.add(default_user)
        db.session.commit()
    return default_user

# Create all database tables and default user
with app.app_context():
    db.create_all()
    get_or_create_default_user()

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Recipe API is running"}), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    print("Received headers:", dict(request.headers))
    print("Content-Type:", request.headers.get('Content-Type'))
    print("Request data:", request.get_data(as_text=True))
    
    if not request.is_json:
        return jsonify({
            "error": "Content-Type must be application/json",
            "received_content_type": request.headers.get('Content-Type'),
            "received_data": request.get_data(as_text=True)
        }), 415
    
    try:
        data = request.get_json()
        
        if not data or 'username' not in data or 'email' not in data:
            return jsonify({"error": "Missing required fields: username and email"}), 400
        
        new_user = User(
            username=data['username'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/recipes', methods=['POST'])
def create_recipe():
    try:
        data = request.get_json()
        if not data or 'title' not in data or 'instructions' not in data:
            return jsonify({"error": "Missing required fields"}), 400

        default_user = get_or_create_default_user()
        
        new_recipe = Recipe(
            title=data['title'],
            instructions=data['instructions'],
            user_id=default_user.id
        )
        
        if 'ingredients' in data:
            for ingredient_data in data['ingredients']:
                if 'name' not in ingredient_data or 'quantity' not in ingredient_data:
                    return jsonify({"error": "Invalid ingredient data"}), 400
                ingredient = Ingredient(
                    name=ingredient_data['name'],
                    quantity=ingredient_data['quantity']
                )
                new_recipe.ingredients.append(ingredient)
        
        db.session.add(new_recipe)
        db.session.commit()
        return jsonify(new_recipe.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@app.route('/api/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify(recipe.to_dict())

@app.route('/api/recipes/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    try:
        recipe = Recipe.query.get_or_404(recipe_id)
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        if 'title' in data:
            recipe.title = data['title']
        if 'instructions' in data:
            recipe.instructions = data['instructions']
        
        if 'ingredients' in data:
            # Remove existing ingredients
            for ingredient in recipe.ingredients:
                db.session.delete(ingredient)
                
            # Add new ingredients
            for ingredient_data in data['ingredients']:
                if 'name' not in ingredient_data or 'quantity' not in ingredient_data:
                    return jsonify({"error": "Invalid ingredient data"}), 400
                ingredient = Ingredient(
                    name=ingredient_data['name'],
                    quantity=ingredient_data['quantity']
                )
                recipe.ingredients.append(ingredient)
        
        db.session.commit()
        return jsonify(recipe.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/api/recipes/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
