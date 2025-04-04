import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { courses, categories } from '../Data';
import Footer from '../components/Footer';
import { useTheme } from '../App';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const filteredCourses = courses.filter(course => 
    course.highlights.some(highlight => 
      highlight.toLowerCase().includes(categoryName.toLowerCase())
    )
  );

  const selectedCategory = categories.find(category => 
    category.name.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto py-12 px-6">
        {/* Category Header */}
        <div className="flex items-center mb-8">
          <img 
            src={selectedCategory ? selectedCategory.imageUrl : "/default-category.jpg"} 
            alt={categoryName} 
            className="w-16 h-16 mr-4 object-cover rounded-full shadow-lg" 
          />
          <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{categoryName}</h2>
        </div>

        {/* Category Description */}
        <div className="mb-12">
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Explore our wide range of courses under {categoryName}. Whether you're a beginner or an expert, 
            our curated selection of courses will help you enhance your skills and achieve your goals.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div 
              key={course.id} 
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{course.title}</h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.instructor}</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{course.price}</p>
            </div>
          ))}
        </div>

        {/* No Courses Found */}
        {filteredCourses.length === 0 && (
          <div className="mt-12 text-center">
            <p className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No courses found for this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
