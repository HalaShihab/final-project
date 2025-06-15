import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-semibold text-gray-800">
            Recipe Organizer
          </Link>
          <Link
            to="/add-recipe"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Recipe
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
