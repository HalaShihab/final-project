import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    ingredients: [{ name: '', quantity: '' }],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/recipes/${id}`);
          const recipe = response.data;
          setFormData({
            title: recipe.title,
            instructions: recipe.instructions,
            ingredients: recipe.ingredients.map((ing) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/recipes/${id}`, formData);
      } else {
        await api.post('/recipes', formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
      setError('Failed to save recipe. Please try again.');
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Edit Recipe' : 'Add New Recipe'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Recipe Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Ingredients
          </label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="Quantity (e.g., 2 cups)"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, 'quantity', e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md"
                required
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Instructions
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
            rows={6}
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            {id ? 'Update Recipe' : 'Add Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;
