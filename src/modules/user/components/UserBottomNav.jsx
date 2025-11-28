import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, TreePine, Plus, Users } from 'lucide-react';
import { useAuth } from '@core/contexts/AuthContext';

const UserBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const userId = user?.id;

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/feed')) return 'feed';
    if (path.includes('/colaborativos')) return 'colaborativos';
    if (path.includes('/arboles')) return 'trees';
    return null;
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[998]">
      <nav className="flex items-center justify-around py-2 px-2">
        <button
          onClick={() => navigate(`/usuario/${userId}/arboles`)}
          className={`
            flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            active:scale-95
            ${
              getCurrentSection() === 'trees'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }
          `}
        >
          <TreePine className={`h-5 w-5 transition-all duration-200 ${getCurrentSection() === 'trees' ? 'fill-green-600' : ''}`} />
          <span className="text-xs mt-1 font-medium">Mis Árboles</span>
        </button>

        <button
          onClick={() => navigate(`/usuario/${userId}/feed`)}
          className={`
            flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            active:scale-95
            ${
              getCurrentSection() === 'feed'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }
          `}
        >
          <Heart className={`h-5 w-5 transition-all duration-200 ${getCurrentSection() === 'feed' ? 'fill-green-600' : ''}`} />
          <span className="text-xs mt-1 font-medium">Feed</span>
        </button>

        <button
          onClick={() => navigate(`/usuario/${userId}/plantararbol`)}
          className="flex flex-col items-center justify-center flex-1 py-2 px-1 focus:outline-none"
        >
          <div className="
            bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg -mt-6 border-4 border-white
            transition-all duration-200 ease-in-out
            hover:scale-110 hover:shadow-xl
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600">Plantar</span>
        </button>

        <button
          onClick={() => navigate(`/usuario/${userId}/colaborativos`)}
          className={`
            flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            active:scale-95
            ${
              getCurrentSection() === 'colaborativos'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
            }
          `}
        >
          <Users className={`h-5 w-5 transition-all duration-200 ${getCurrentSection() === 'colaborativos' ? 'fill-green-600' : ''}`} />
          <span className="text-xs mt-1 font-medium">Colaborar</span>
        </button>
      </nav>
    </div>
  );
};

export default UserBottomNav;
