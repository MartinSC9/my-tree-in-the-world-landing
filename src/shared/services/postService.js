import api from '@core/config/api';

/**
 * Servicio para manejar operaciones relacionadas con posts del feed ecológico
 */

// Obtener todos los posts (feed)
export const getPosts = async (limit = 20, offset = 0) => {
  try {
    const response = await api.get('/posts', {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Obtener posts de un usuario específico
export const getUserPosts = async (userId, limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/posts/user/${userId}`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Obtener un post por ID
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Crear un nuevo post
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Actualizar un post
export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Eliminar un post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Dar/quitar like a un post
export const toggleLike = async (postId) => {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Obtener comentarios de un post
export const getComments = async (postId, limit = 50, offset = 0) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: { limit, offset }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Crear un comentario en un post
export const createComment = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Eliminar un comentario
export const deleteComment = async (postId, commentId) => {
  try {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

const postService = {
  getPosts,
  getUserPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getComments,
  createComment,
  deleteComment
};

export default postService;
