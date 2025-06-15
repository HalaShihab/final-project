import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AddRecipePage = lazy(() => import('./pages/AddRecipePage.jsx'));
const RecipeDetailsPage = lazy(() => import('./pages/RecipeDetailsPage.jsx'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-recipe" element={<AddRecipePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
              <Route path="/edit-recipe/:id" element={<AddRecipePage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
}

export default App;
