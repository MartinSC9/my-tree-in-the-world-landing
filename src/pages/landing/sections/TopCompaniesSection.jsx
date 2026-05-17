import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TreePine, Building2 } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { formatCurrency } from '@/utils/currencyUtils';

const TopCompaniesSection = ({ topCompaniesRef, topCompaniesInView, topCompanies }) => {
  const navigate = useNavigate();

  // Si no hay empresas, mostrar version minima
  if (topCompanies.length === 0) {
    return (
      <section ref={topCompaniesRef} className="py-10 px-4 bg-white dark:bg-gray-900">
        <div className="container-wide text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            Empresas comprometidas con la reforestacion — proximamente
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={topCompaniesRef}
      className="py-16 md:py-20 px-4 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={topCompaniesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Empresas que apoyan
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organizaciones que ya son parte del movimiento.
          </p>
        </motion.div>

        {/* Lista simple de empresas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={topCompaniesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {topCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: -10 }}
                animate={topCompaniesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Ranking number */}
                <span className="text-sm font-mono text-gray-400 dark:text-gray-500 w-6 text-right flex-shrink-0">
                  {index + 1}.
                </span>

                {/* Company name */}
                <span className="font-semibold text-gray-800 dark:text-white flex-1 truncate">
                  {company.company_name || company.username}
                </span>

                {/* Stats inline */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                    <TreePine className="h-3.5 w-3.5" />
                    {company.completed_projects}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                    {formatCurrency(company.total_raised)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={topCompaniesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={() => navigate('/empresas')}
            variant="outline"
            size="sm"
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
