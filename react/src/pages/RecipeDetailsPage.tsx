import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

interface Recipe {
  id: number;
  title: string;
  instructions: string;
  ingredients: Ingredient[];
  created_at: string;
}

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-gray-600 mt-8">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/edit-recipe/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.quantity} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="whitespace-pre-wrap">{recipe.instructions}</p>
        </div>

        <div className="mt-6 text-gray-600 text-sm">
          Added on {new Date(recipe.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
