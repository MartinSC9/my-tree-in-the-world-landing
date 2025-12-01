import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { treeService } from '@features/trees/services';
import { toast } from '@shared/components/ui/use-toast';
import { useAuth } from './AuthContext';

const TreeContext = createContext();

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

export const TreeProvider = ({ children }) => {
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState({
    totalTrees: 0,
    totalCountries: 0,
    plantedTrees: 0,
    inProgressTrees: 0
  });
  const [loadingTrees, setLoadingTrees] = useState(false);
  const [treeMarkers, setTreeMarkers] = useState([]);

  // Usar useRef para persistir entre re-renders de StrictMode
  const cacheRef = useRef({
    loaded: false,
    lastFilters: null,
    isLoading: false // Evitar llamadas concurrentes
  });

  const { user } = useAuth();

  const updateStats = (treeList) => {
    const countries = new Set(treeList.map(tree => tree.country).filter(Boolean));
    const planted = treeList.filter(tree => tree.status === 'plantado' || tree.status === 'verificado').length;
    const inProgress = treeList.filter(tree => tree.status === 'en_proceso').length;

    setStats({
      totalTrees: treeList.length,
      totalCountries: countries.size,
      plantedTrees: planted,
      inProgressTrees: inProgress
    });
  };

  const loadTrees = async (filters = {}, forceReload = false) => {
    const filtersKey = JSON.stringify(filters);

    // Si ya están cargados con los mismos filtros, reutilizar
    if (cacheRef.current.loaded && !forceReload && cacheRef.current.lastFilters === filtersKey) {
      return trees;
    }

    // Si ya hay una carga en progreso con los mismos filtros, esperar
    if (cacheRef.current.isLoading && cacheRef.current.lastFilters === filtersKey) {
      return trees;
    }

    cacheRef.current.isLoading = true;
    setLoadingTrees(true);

    try {
      const data = await treeService.getTrees(filters);
      setTrees(data || []);
      cacheRef.current.loaded = true;
      cacheRef.current.lastFilters = filtersKey;

      if (Object.keys(filters).length === 0) {
        updateStats(data || []);
      }
      return data || [];
    } catch (error) {
      console.error('Error loading trees:', error);
      toast({
        title: "Error",
        description: `No se pudieron cargar los árboles: ${error.response?.data?.error || error.message}`,
        variant: "destructive"
      });
      setTrees([]);
      return [];
    } finally {
      cacheRef.current.isLoading = false;
      setLoadingTrees(false);
    }
  };


  // Cargar solo marcadores (optimizado para mapas)
  const loadTreeMarkers = async (forceReload = false) => {
    if (treeMarkers.length > 0 && !forceReload) {
      return treeMarkers;
    }

    try {
      const data = await treeService.getTreeMarkers();
      setTreeMarkers(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading tree markers:', error);
      setTreeMarkers([]);
      return [];
    }
  };

  const plantTree = async (treeData) => {
    try {
      const response = await treeService.createTree(treeData);
      const newTree = response.tree;

      // Actualizar la lista de árboles
      setTrees(prevTrees => [newTree, ...prevTrees]);
      updateStats([...trees, newTree]);

      // Invalidar caché usando ref
      cacheRef.current.loaded = false;
      cacheRef.current.lastFilters = null;

      return newTree;
    } catch (error) {
      console.error('Error planting tree:', error);
      toast({
        title: "Error",
        description: `No se pudo plantar el árbol: ${error.response?.data?.error || error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTreeStatus = async (treeId, status) => {
    try {
      const updatedTree = await treeService.updateTree(treeId, { status });

      // Actualizar la lista de árboles
      setTrees(prevTrees => prevTrees.map(tree =>
        tree.id === treeId ? updatedTree : tree
      ));

      // Actualizar estadísticas
      const updatedTrees = trees.map(tree =>
        tree.id === treeId ? updatedTree : tree
      );
      updateStats(updatedTrees);

      // Invalidar caché usando ref
      cacheRef.current.loaded = false;
      cacheRef.current.lastFilters = null;

      return updatedTree;
    } catch (error) {
      console.error('Error updating tree status:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el árbol: ${error.response?.data?.error || error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const getTreesByEmail = async (email) => {
    try {
      // Buscar usuario por email primero, luego obtener sus árboles
      const data = await treeService.getTrees();
      // Filtrar por email del usuario (necesitarías obtener el user_id del email primero)
      return data || [];
    } catch (error) {
      console.error('Error getting trees by email:', error);
      toast({
        title: "Error",
        description: `No se pudieron buscar los árboles: ${error.response?.data?.error || error.message}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const getTreeById = async (id) => {
    try {
      return await treeService.getTreeById(id);
    } catch (error) {
      console.error('Error getting tree by id:', error);
      // Fallback a buscar en el estado local
      return trees.find(tree => tree.id === id);
    }
  };

  const value = {
    trees,
    loadingTrees,
    loadTrees,
    plantTree,
    updateTreeStatus,
    getTreesByEmail,
    getTreeById,
    loadTreeMarkers,
    treeMarkers,
    stats
  };

  return (
    <TreeContext.Provider value={value}>
      {children}
    </TreeContext.Provider>
  );
};
