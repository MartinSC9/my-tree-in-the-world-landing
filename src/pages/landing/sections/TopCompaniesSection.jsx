import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Building2, Trophy } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { formatCurrency } from '@/utils/currencyUtils';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const TopCompaniesSection = ({ topCompaniesRef, topCompaniesInView, topCompanies }) => {
  const navigate = useNavigate();

  return (
    <section
      ref={topCompaniesRef}
      className="section-padding bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial="hidden"
          animate={topCompaniesInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp}>
            <Building2 className="h-14 w-14 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="section-title mb-4">
            Empresas que Hacen la Diferencia
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            Estas empresas lideran el cambio con proyectos de reforestación.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={topCompaniesInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className={`grid gap-6 ${
            topCompanies.length === 1
              ? 'grid-cols-1 max-w-sm mx-auto'
              : topCompanies.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                : topCompanies.length === 3
                  ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto'
                  : topCompanies.length === 4
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
          }`}
        >
          {topCompanies.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Pronto verás aquí a las empresas que lideran el cambio
              </p>
            </div>
          )}
          {topCompanies.map((company, index) => (
            <motion.div key={company.id} variants={fadeInUp}>
              <Card className="h-full bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-emerald-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  {/* Ranking Badge */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                            ? 'bg-gray-300 text-gray-700'
                            : index === 2
                              ? 'bg-amber-600 text-amber-100'
                              : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {index < 3 ? (
                        <Trophy className="h-6 w-6" />
                      ) : (
                        <span className="font-bold text-lg">#{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="font-display font-bold text-lg text-gray-800 dark:text-white mb-3">
                    {company.company_name || company.username}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <TreePine className="h-4 w-4" />
                      <span className="font-semibold">{company.completed_projects} proyectos</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(company.total_raised)} recaudado
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA for companies */}
        <motion.div
          initial="hidden"
          animate={topCompaniesInView ? 'visible' : 'hidden'}
          variants={fadeInUp}
          className="text-center mt-10"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tu empresa también puede ser parte del cambio.
          </p>
          <Button
            onClick={() => navigate('/empresas')}
            variant="outline"
            className="border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Conoce el programa empresarial
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TopCompaniesSection;
