import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

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

interface FormData {
  title: string;
  instructions: string;
  ingredients: { name: string; quantity: string }[];
}

const AddRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    instructions: '',
    ingredients: [{ name: '', quantity: '' }],
  });

  useEffect(() => {
    if (id) {      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/recipes/${id}`);
          const recipe = response.data;
          setFormData({
            title: recipe.title,
            instructions: recipe.instructions,
            ingredients: recipe.ingredients.map((ing: Ingredient) => ({
              name: ing.name,
              quantity: ing.quantity,
            })),
          });
        } catch (error) {
          console.error('Error fetching recipe:', error);
          setError('Failed to load recipe. Please try again.');
        }
      };
      fetchRecipe();
    }
  }, [id]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {      // Validate form data
      if (!formData.title.trim()) {
        setError('Recipe title is required');
        return;
      }
      if (!formData.instructions.trim()) {
        setError('Recipe instructions are required');
        return;
      }
      if (!formData.ingredients.length) {
        setError('At least one ingredient is required');
        return;
      }
      for (const ing of formData.ingredients) {
        if (!ing.name.trim() || !ing.quantity.trim()) {
          setError('All ingredient fields must be filled out');
          return;
        }
      }

      try {
        if (id) {
          await api.put(`/recipes/${id}`, formData);
        } else {
          await api.post('/recipes', formData);
        }
        navigate('/');
      } catch (error: any) {
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else if (error.response) {
          setError(`Server error: ${error.response.status}`);
        } else if (error.request) {
          setError('Network error. Please check your connection.');
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Error saving recipe:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, field: 'name' | 'quantity', value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Recipe' : 'Add New Recipe'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="Ingredient"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 text-blue-500 hover:text-blue-600"
          >
            Add Ingredient
          </button>
        </div>        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {id ? 'Updating...' : 'Saving...'}
              </span>
            ) : (
              id ? 'Update Recipe' : 'Save Recipe'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;
