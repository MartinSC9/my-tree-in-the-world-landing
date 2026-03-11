import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView, useScroll, useTransform } from 'framer-motion';
import { TreePine, Globe, Users, Leaf } from 'lucide-react';
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

const LandingHome = () => {
  const { trees, loadTrees } = useTree();
  const { user, loading: authLoading, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Estado para las estadisticas de landing (endpoint ligero)
  const [landingStats, setLandingStats] = useState({
    totalTrees: 0,
    plantedTrees: 0,
    totalCountries: 0,
    totalCompanies: 0,
  });

  // Estado para top empresas
  const [topCompanies, setTopCompanies] = useState([]);

  // Cargar stats y top empresas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getLandingStats();
        setLandingStats(data);
      } catch (error) {
        console.error('Error cargando stats:', error);
      }
    };

    const fetchTopCompanies = async () => {
      try {
        const companies = await statsService.getTopCompanies(5);
        setTopCompanies(companies || []);
      } catch (error) {
        console.error('Error cargando top empresas:', error);
      }
    };

    fetchStats();
    fetchTopCompanies();
    loadTrees();
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

  return (
    <div className="min-h-screen">
      <HeroSection
        heroRef={heroRef}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        APP_URL={APP_URL}
        carouselRef={carouselRef}
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
