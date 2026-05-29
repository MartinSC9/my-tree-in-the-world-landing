import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView, useScroll, useTransform, AnimatePresence, motion } from 'framer-motion';
import { TreePine, Globe, Users, Leaf, Loader2 } from 'lucide-react';
import { useTree } from '@core/contexts/TreeContext';
import { useAuth } from '@core/contexts/AuthContext';
import { statsService } from '@features/trees/services';
import Footer from '@shared/components/layout/Footer';
import { APP_URL } from '@core/config/app.config';

import HeroSection from './sections/HeroSection';
import CarouselSection from './sections/CarouselSection';
import StatsSection from './sections/StatsSection';
import MissionVisionSection from './sections/MissionVisionSection';
import TreeIdentitySection from './sections/TreeIdentitySection';
import HowItWorksSection from './sections/HowItWorksSection';
import FreeTreeOptionsSection from './sections/FreeTreeOptionsSection';
import TopCompaniesSection from './sections/TopCompaniesSection';
import FinalCTASection from './sections/FinalCTASection';

// --- Mock data para mostrar mientras cargan los endpoints ---
const MOCK_STATS = {
  totalTrees: 148,
  plantedTrees: 95,
  totalCountries: 3,
  collaborativeTrees: 12,
};

const MOCK_TREES = [
  {
    id: 'mock-1',
    latitude: -31.4135,
    longitude: -64.1811,
    status: 'plantado',
    species: 'Lapacho Rosado',
  },
  {
    id: 'mock-2',
    latitude: -31.428,
    longitude: -64.195,
    status: 'verificado',
    species: 'Aguaribay',
  },
  {
    id: 'mock-3',
    latitude: -31.405,
    longitude: -64.21,
    status: 'en_proceso',
    species: 'Algarrobo',
  },
  { id: 'mock-4', latitude: -31.439, longitude: -64.17, status: 'plantado', species: 'Jacarandá' },
  { id: 'mock-5', latitude: -31.42, longitude: -64.205, status: 'plantado', species: 'Tipa' },
  { id: 'mock-6', latitude: -31.41, longitude: -64.16, status: 'verificado', species: 'Ceibo' },
  {
    id: 'mock-7',
    latitude: -31.435,
    longitude: -64.188,
    status: 'plantado',
    species: 'Quebracho Blanco',
  },
  { id: 'mock-8', latitude: -31.445, longitude: -64.2, status: 'en_proceso', species: 'Espinillo' },
];

const MOCK_COMPANIES = [
  { id: 'mock-c1', company_name: 'EcoVerde SA', completed_projects: 12, total_raised: 45000 },
  { id: 'mock-c2', company_name: 'Sustenta Corp', completed_projects: 8, total_raised: 32000 },
  {
    id: 'mock-c3',
    company_name: 'GreenTech Argentina',
    completed_projects: 5,
    total_raised: 18500,
  },
];

// Helper: fetch con 1 retry
const fetchWithRetry = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    // Reintentar 1 vez
    try {
      return await fn();
    } catch (retryError) {
      console.error('Error tras retry:', retryError);
      return null;
    }
  }
};

// Loader flotante (arriba del ChatBot que está en bottom-6 right-6)
const FloatingLoader = ({ visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="floating-loader"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 right-5 z-[100] flex items-center gap-2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-full shadow-lg border border-white/10"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
        <span className="text-gray-300">Cargando datos...</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const LandingHome = () => {
  const { trees, loadTrees, loadingTrees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Estado para las estadisticas de landing — arranca con mock
  const [landingStats, setLandingStats] = useState(MOCK_STATS);
  const [statsLoaded, setStatsLoaded] = useState(false);

  // Estado para top empresas — arranca con mock
  const [topCompanies, setTopCompanies] = useState(MOCK_COMPANIES);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);

  // Track si los árboles reales ya cargaron
  const [treesLoaded, setTreesLoaded] = useState(false);

  // Loading global: true mientras algún endpoint no haya respondido
  const isLoading = !statsLoaded || !companiesLoaded || !treesLoaded;

  // Cargar stats y top empresas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      const data = await fetchWithRetry(() => statsService.getLandingStats());
      if (data) setLandingStats(data);
      setStatsLoaded(true);
    };

    const fetchTopCompanies = async () => {
      const companies = await fetchWithRetry(() => statsService.getTopCompanies(5));
      if (companies) setTopCompanies(companies);
      setCompaniesLoaded(true);
    };

    const fetchTrees = async () => {
      await loadTrees();
      setTreesLoaded(true);
    };

    fetchStats();
    fetchTopCompanies();
    fetchTrees();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      const redirectPath = getRedirectPath(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, authLoading, getRedirectPath, navigate]);

  const stats = [
    {
      icon: TreePine,
      label: 'Árboles Comprados',
      value: landingStats.totalTrees,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-100 dark:bg-emerald-900/50',
    },
    {
      icon: Leaf,
      label: 'Ya Plantados',
      value: landingStats.plantedTrees,
      colorClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-100 dark:bg-teal-900/50',
    },
    {
      icon: Globe,
      label: 'Países',
      value: landingStats.totalCountries,
      colorClass: 'text-sky-600 dark:text-sky-400',
      bgClass: 'bg-sky-100 dark:bg-sky-900/50',
    },
    {
      icon: Users,
      label: 'Árboles Colaborativos',
      value: landingStats.collaborativeTrees || 0,
      colorClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-100 dark:bg-purple-900/50',
    },
  ];

  // Section refs for scroll animations
  const carouselRef = useRef(null);
  const statsRef = useRef(null);
  const uniqueRef = useRef(null);
  const howItWorksRef = useRef(null);
  const plantaSinPlataRef = useRef(null);
  const topCompaniesRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
  const uniqueInView = useInView(uniqueRef, { once: true, margin: '-100px' });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: '-100px' });
  const topCompaniesInView = useInView(topCompaniesRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  // Usar árboles reales si ya cargaron, sino mock
  const displayTrees = treesLoaded && trees.length > 0 ? trees : !treesLoaded ? MOCK_TREES : trees;

  return (
    <div className="relative min-h-screen">
      <FloatingLoader visible={isLoading} />

      <HeroSection
        heroRef={heroRef}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        APP_URL={APP_URL}
        carouselRef={carouselRef}
        trees={displayTrees}
        totalTrees={landingStats.totalTrees}
      />

      <CarouselSection carouselRef={carouselRef} APP_URL={APP_URL} />

      <StatsSection statsRef={statsRef} statsInView={statsInView} stats={stats} />

      <MissionVisionSection />

      <TreeIdentitySection uniqueRef={uniqueRef} uniqueInView={uniqueInView} />

      <HowItWorksSection howItWorksRef={howItWorksRef} howItWorksInView={howItWorksInView} />

      <FreeTreeOptionsSection plantaSinPlataRef={plantaSinPlataRef} />

      <TopCompaniesSection
        topCompaniesRef={topCompaniesRef}
        topCompaniesInView={topCompaniesInView}
        topCompanies={topCompanies}
      />

      <FinalCTASection ctaRef={ctaRef} APP_URL={APP_URL} />

      <Footer />
    </div>
  );
};

export default LandingHome;
