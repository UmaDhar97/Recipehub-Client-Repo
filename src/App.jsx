import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Lazy pages
const Home = lazy(() => import('./pages/Home.jsx'));
const BrowseRecipes = lazy(() => import('./pages/BrowseRecipes.jsx'));
const RecipeDetails = lazy(() => import('./pages/RecipeDetails.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const PaymentSuccess = lazy(() => import('../src/Payment/PaymentSuccess.jsx'));

// Dashboard
const UserDashboard = lazy(() => import('../src/Dashboard/UserDashboard.jsx'));
const DashboardOverview = lazy(() => import('../src/Dashboard/Overview.jsx'));
const MyRecipes = lazy(() => import('../src/Dashboard/MyRecipes.jsx'));
const AddRecipe = lazy(() => import('../src/Dashboard/AddRecipe.jsx'));
const EditRecipe = lazy(() => import('../src/Dashboard/EditRecipe.jsx'));
const MyFavorites = lazy(() => import('../src/Dashboard/MyFavorites.jsx'));
const PurchasedRecipes = lazy(() => import('../src/Dashboard/PurchasedRecipes.jsx'));
const Profile = lazy(() => import('../src/Dashboard/Profile.jsx'));
const PremiumPage = lazy(() => import('../src/Payment/PremiumPage.jsx'));

// Admin
const AdminDashboard = lazy(() => import('../src/Admin/AdminDashboard.jsx'));
const AdminOverview = lazy(() => import('../src/Admin/AdminOverview.jsx'));
const ManageUsers = lazy(() => import('../src/Admin/ManageUsers.jsx'));
const ManageRecipes = lazy(() => import('../src/Admin/ManageRecipes.jsx'));
const AdminReports = lazy(() => import('../src/Admin/AdminReports.jsx'));
const AdminTransactions = lazy(() => import('../src/Admin/AdminTransactions.jsx'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size={48} />
  </div>
);

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseRecipes />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="my-recipes" element={<MyRecipes />} />
              <Route path="add-recipe" element={<AddRecipe />} />
              <Route path="edit-recipe/:id" element={<EditRecipe />} />
              <Route path="favorites" element={<MyFavorites />} />
              <Route path="purchased" element={<PurchasedRecipes />} />
              <Route path="profile" element={<Profile />} />
              <Route path="premium" element={<PremiumPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="recipes" element={<ManageRecipes />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="transactions" element={<AdminTransactions />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}