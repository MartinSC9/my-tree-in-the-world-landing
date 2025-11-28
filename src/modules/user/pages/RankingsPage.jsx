import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, TreePine } from 'lucide-react';
import Navbar from '@/shared/components/layout/Navbar';

const RankingsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data - En producción esto vendría de la API
  const rankings = {
    week: [
      { id: 1, name: 'Juan Pérez', ecoPoints: 250, individualTrees: 15, collaborativeContributions: 50, avatar: null },
      { id: 2, name: 'María González', ecoPoints: 180, individualTrees: 10, collaborativeContributions: 30, avatar: null },
      { id: 3, name: 'Carlos López', ecoPoints: 150, individualTrees: 12, collaborativeContributions: 10, avatar: null },
      { id: 4, name: 'Ana Martínez', ecoPoints: 120, individualTrees: 8, collaborativeContributions: 20, avatar: null },
      { id: 5, name: 'Pedro Rodríguez', ecoPoints: 110, individualTrees: 9, collaborativeContributions: 8, avatar: null },
    ],
    month: [
      { id: 1, name: 'María González', ecoPoints: 450, individualTrees: 30, collaborativeContributions: 80, avatar: null },
      { id: 2, name: 'Juan Pérez', ecoPoints: 420, individualTrees: 28, collaborativeContributions: 70, avatar: null },
      { id: 3, name: 'Carlos López', ecoPoints: 350, individualTrees: 25, collaborativeContributions: 40, avatar: null },
      { id: 4, name: 'Ana Martínez', ecoPoints: 280, individualTrees: 18, collaborativeContributions: 50, avatar: null },
      { id: 5, name: 'Pedro Rodríguez', ecoPoints: 260, individualTrees: 20, collaborativeContributions: 25, avatar: null },
    ],
    allTime: [
      { id: 1, name: 'Juan Pérez', ecoPoints: 1250, individualTrees: 95, collaborativeContributions: 200, avatar: null },
      { id: 2, name: 'Carlos López', ecoPoints: 980, individualTrees: 75, collaborativeContributions: 130, avatar: null },
      { id: 3, name: 'María González', ecoPoints: 850, individualTrees: 60, collaborativeContributions: 150, avatar: null },
      { id: 4, name: 'Ana Martínez', ecoPoints: 720, individualTrees: 50, collaborativeContributions: 110, avatar: null },
      { id: 5, name: 'Pedro Rodríguez', ecoPoints: 650, individualTrees: 45, collaborativeContributions: 100, avatar: null },
    ]
  };

  const periods = [
    { id: 'week', label: 'Semana', icon: TrendingUp },
    { id: 'month', label: 'Mes', icon: Award },
    { id: 'allTime', label: 'Histórico', icon: Trophy }
  ];

  const getMedalIcon = (position) => {
    switch (position) {
      case 1:
        return <div className="text-4xl">🥇</div>;
      case 2:
        return <div className="text-4xl">🥈</div>;
      case 3:
        return <div className="text-4xl">🥉</div>;
      default:
        return <div className="text-2xl font-bold text-gray-500">#{position}</div>;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const currentRankings = rankings[selectedPeriod];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Rankings de Plantadores</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Descubre quiénes están liderando el impacto ambiental en la comunidad
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {periods.map(period => {
            const Icon = period.icon;
            const isActive = selectedPeriod === period.id;

            return (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}
                `}
              >
                <Icon className="h-5 w-5" />
                {period.label}
              </button>
            );
          })}
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {currentRankings.map((user, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;

            return (
              <div
                key={user.id}
                className={`
                  bg-white rounded-xl shadow-md overflow-hidden
                  transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                  ${isTopThree ? 'border-2 border-yellow-400' : 'border border-gray-200'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Position/Medal */}
                    <div className="flex-shrink-0 w-20 flex justify-center">
                      {getMedalIcon(position)}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <TreePine className="h-4 w-4" />
                          <span>{user.individualTrees} individuales</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{user.collaborativeContributions} aportes</span>
                        </div>
                      </div>
                    </div>

                    {/* EcoPoints */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {user.ecoPoints}
                      </div>
                      <div className="text-sm text-gray-500">EcoPoints</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">¿Cómo se calculan los EcoPoints?</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>🌳 <strong>10 EcoPoints</strong> por cada árbol individual plantado</li>
                <li>🤝 <strong>5 EcoPoints</strong> por cada aporte a proyecto colaborativo</li>
                <li>✅ <strong>10 EcoPoints</strong> por completar tu perfil al 100%</li>
                <li>🎁 <strong>Bonificaciones especiales</strong> por crear proyectos y logros</li>
              </ul>
              <p className="mt-3 text-xs text-blue-700">
                📄 Ver documentación completa en <code>SISTEMA_ECOPOINTS.md</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
