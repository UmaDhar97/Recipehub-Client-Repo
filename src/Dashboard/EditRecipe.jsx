import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Beverage', 'Salad', 'Soup', 'Vegan'];
const CUISINES = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese', 'Thai', 'French', 'Mediterranean', 'Bengali', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [ingredients, setIngredients] = useState(['']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/recipes/${id}`).then(r => {
      const recipe = r.data.recipe;
      setForm({
        recipeName: recipe.recipeName,
        recipeImage: recipe.recipeImage,
        category: recipe.category,
        cuisineType: recipe.cuisineType,
        difficultyLevel: recipe.difficultyLevel,
        preparationTime: recipe.preparationTime,
        instructions: recipe.instructions,
      });
      setIngredients(recipe.ingredients || ['']);
    }).catch(() => {
      toast.error('Recipe not found.');
      navigate('/dashboard/my-recipes');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const addIngredient = () => setIngredients(p => [...p, '']);
  const removeIngredient = i => setIngredients(p => p.filter((_, idx) => idx !== i));
  const updateIngredient = (i, val) => setIngredients(p => p.map((v, idx) => idx === i ? val : v));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filtered = ingredients.filter(i => i.trim());
    if (!filtered.length) { toast.error('Add at least one ingredient.'); return; }
    setSaving(true);
    try {
      await api.put(`/recipes/${id}`, { ...form, preparationTime: Number(form.preparationTime), ingredients: filtered });
      toast.success('Recipe updated successfully!');
      navigate('/dashboard/my-recipes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size={48} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Edit Recipe</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update your recipe details</p>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} className="card p-6 space-y-6">

        {/* Image preview */}
        {form?.recipeImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Image</label>
            <img src={form.recipeImage} alt="Recipe" className="w-full h-48 object-cover rounded-xl" />
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
              <input type="url" name="recipeImage" value={form.recipeImage} onChange={handleChange} className="input-field" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Recipe Name *</label>
            <input type="text" name="recipeName" value={form?.recipeName || ''} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
            <select name="category" value={form?.category || ''} onChange={handleChange} required className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cuisine *</label>
            <select name="cuisineType" value={form?.cuisineType || ''} onChange={handleChange} required className="input-field">
              {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty *</label>
            <select name="difficultyLevel" value={form?.difficultyLevel || ''} onChange={handleChange} required className="input-field">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prep Time (min) *</label>
            <input type="number" name="preparationTime" value={form?.preparationTime || ''} onChange={handleChange} required min={1} className="input-field" />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients *</label>
            <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs text-brand-600 font-semibold">
              <FiPlus /> Add
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-7 h-10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{i + 1}.</span>
                <input type="text" value={ing} onChange={e => updateIngredient(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`} className="input-field flex-1" />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)}
                    className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Instructions *</label>
          <textarea name="instructions" value={form?.instructions || ''} onChange={handleChange}
            required rows={6} className="input-field resize-none" />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/dashboard/my-recipes')} className="btn-ghost flex-1 border border-gray-200 dark:border-dark-border">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}