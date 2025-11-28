import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@shared/components/layout/Navbar';
import CreateCollaborativeTreeWizard from '@features/collaborative-trees/components/CreateCollaborativeTreeWizard';

const CreateCollaborativeTreePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
              Crear mi Árbol Colaborativo
            </h1>
            <p className="text-2xl text-green-600 max-w-3xl mx-auto leading-relaxed">
              Comparte la experiencia de plantar un árbol con amigos, familia y tu comunidad.
            </p>
          </div>

          <CreateCollaborativeTreeWizard />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCollaborativeTreePage;
