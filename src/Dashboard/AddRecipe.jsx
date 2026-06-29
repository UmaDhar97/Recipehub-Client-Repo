import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Beverage', 'Salad', 'Soup', 'Vegan'];
const CUISINES = ['Italian', 'Chinese', 'Indian', 'Mexican', 'American', 'Japanese', 'Thai', 'French', 'Mediterranean', 'Bengali', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function AddRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    recipeName: '', category: '', cuisineType: '', difficultyLevel: '',
    preparationTime: '', instructions: '',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append('image', imageFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST', body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    return data.data.display_url;
  };

  const addIngredient = () => setIngredients(prev => [...prev, '']);
  const removeIngredient = (i) => setIngredients(prev => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i, val) => setIngredients(prev => prev.map((ing, idx) => idx === i ? val : ing));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filtered = ingredients.filter(i => i.trim());
    if (!filtered.length) { toast.error('Add at least one ingredient.'); return; }
    if (!imageFile && !imagePreview) { toast.error('Please upload a recipe image.'); return; }

    setLoading(true);
    setUploading(true);
    try {
      let recipeImage = imagePreview;
      if (imageFile) recipeImage = await uploadImage();
      setUploading(false);

      await api.post('/recipes', {
        ...form,
        preparationTime: Number(form.preparationTime),
        ingredients: filtered,
        recipeImage,
      });
      toast.success('Recipe published! 🎉');
      navigate('/dashboard/my-recipes');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to publish recipe.';
      toast.error(msg);
      if (err.response?.data?.requiresPremium) {
        setTimeout(() => navigate('/dashboard/premium'), 1500);
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Add New Recipe</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Share your culinary masterpiece with the world</p>
      </motion.div>

      {!user?.isPremium && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex items-center gap-3">
          <FiStar className="text-yellow-500 shrink-0" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Free plan allows <strong>2 recipes</strong>.{' '}
            <Link to="/dashboard/premium" className="font-bold underline">Upgrade to Premium</Link> for unlimited.
          </p>
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="card p-6 space-y-6"
      >
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipe Image *</label>
          <div
            onClick={() => document.getElementById('imageInput').click()}
            className={`relative border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${
              imagePreview ? 'border-brand-300 h-52' : 'border-gray-300 dark:border-dark-border h-36 hover:border-brand-400 flex items-center justify-center'
            }`}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <FiUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload image (max 5MB)</p>
              </div>
            )}
            {imagePreview && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-semibold text-sm">Change Image</span>
              </div>
            )}
          </div>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Recipe Name *</label>
            <input type="text" name="recipeName" value={form.recipeName} onChange={handleChange}
              required placeholder="e.g. Spaghetti Carbonara" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required className="input-field">
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cuisine Type *</label>
            <select name="cuisineType" value={form.cuisineType} onChange={handleChange} required className="input-field">
              <option value="">Select cuisine</option>
              {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Difficulty *</label>
            <select name="difficultyLevel" value={form.difficultyLevel} onChange={handleChange} required className="input-field">
              <option value="">Select difficulty</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prep Time (minutes) *</label>
            <input type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange}
              required min={1} placeholder="30" className="input-field" />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ingredients *</label>
            <button type="button" onClick={addIngredient}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold">
              <FiPlus /> Add
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <span className="w-7 h-10 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{i + 1}.</span>
                <input
                  type="text" value={ing} onChange={e => updateIngredient(i, e.target.value)}
                  placeholder={`Ingredient ${i + 1}`} className="input-field flex-1"
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)}
                    className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0">
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
          <textarea name="instructions" value={form.instructions} onChange={handleChange}
            required rows={6} placeholder="Describe the cooking steps in detail..."
            className="input-field resize-none" />
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
          {loading ? (uploading ? '📤 Uploading image...' : '🍳 Publishing...') : '🚀 Publish Recipe'}
        </button>
      </motion.form>
    </div>
  );
}