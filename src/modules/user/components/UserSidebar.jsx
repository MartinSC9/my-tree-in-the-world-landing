import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, TreePine, Gift, Bell, Target, Award, Plus, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@core/contexts/AuthContext';
import { useTree } from '@core/contexts/TreeContext';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { trees } = useTree();

  const [userProfile, setUserProfile] = useState({
    level: 'Explorador Ecológico',
    ecoPoints: 0,
    avatar: null,
    individualTrees: 0,
    collaborativeTrees: 0
  });

  const userId = user?.id;

  useEffect(() => {
    if (trees && trees.length > 0) {
      const individualTrees = trees.filter(t => !t.is_collaborative);
      const collaborativeTrees = trees.filter(t => t.is_collaborative);
      const points = (individualTrees.length * 10) + (collaborativeTrees.length * 5);
      setUserProfile(prev => ({
        ...prev,
        ecoPoints: points,
        individualTrees: individualTrees.length,
        collaborativeTrees: collaborativeTrees.length
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        ecoPoints: 0,
        individualTrees: 0,
        collaborativeTrees: 0
      }));
    }
  }, [trees]);

  const getInitials = (user) => {
    if (!user) return 'U';
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const sidebarItems = [
    { id: 'arboles', label: 'Arboles', icon: TreePine, path: `/usuario/${userId}/arboles-catalogo` },
    { id: 'feed', label: 'Feed', icon: Heart, path: `/usuario/${userId}/feed` },
    { id: 'rewards', label: 'Premios', icon: Gift, path: `/usuario/${userId}/premios` },
    { id: 'certificates', label: 'Certificados', icon: Award, path: `/usuario/${userId}/certificados` }
  ];

  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/feed')) return 'feed';
    if (path.includes('/arboles')) return 'arboles';
    if (path.includes('/premios')) return 'rewards';
    if (path.includes('/certificados')) return 'certificates';
    return null;
  };

  const EcoTipComponent = () => {
    const tips = [
      'Planta especies nativas en tu jardín',
      'Reduce tu consumo de plástico',
      'Consume productos locales y de temporada',
      'Ahorra agua en tu rutina diaria',
      'Recicla y separa tus residuos',
      'Usa transporte público o bicicleta'
    ];
    const [currentTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Tip Ecológico</h3>
            <p className="text-xs text-blue-800">{currentTip}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-8 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 flex-shrink-0">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {getInitials(user)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.name || user?.username || user?.email}
            </div>
            <div className="text-xs text-green-600">{userProfile.level}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <div className="font-bold text-lg">{trees?.length || 0}</div>
            <div className="text-gray-600">Árboles</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{userProfile.ecoPoints}</div>
            <div className="text-gray-600">EcoPoints</div>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const isActive = getCurrentSection() === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                active:scale-[0.98]
                ${
                  isActive
                    ? 'bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-white' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8">
        <EcoTipComponent />
      </div>
    </div>
  );
};

export default UserSidebar;
