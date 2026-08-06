import api from '@/services/api';

class CategoriaService {
  // GET /api/v1/products/restaurant-categories/
  async getCategorias() {
    try {
      const response = await api.get('/v1/products/restaurant-categories/');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar categorías',
      };
    }
  }

  // POST /api/v1/products/restaurant-categories/
  async createCategoria(data) {
    try {
      const response = await api.post('/v1/products/restaurant-categories/', data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear categoría',
        errors: error.response?.data?.errors || null,
      };
    }
  }

  // GET /api/v1/products/restaurant-categories/{id}/
  async getCategoriaById(id) {
    try {
      const response = await api.get(`/v1/products/restaurant-categories/${id}/`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener categoría',
      };
    }
  }

  // PUT /api/v1/products/restaurant-categories/{id}/
  async updateCategoria(id, data) {
    try {
      const response = await api.put(`/v1/products/restaurant-categories/${id}/`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar categoría',
        errors: error.response?.data?.errors || null,
      };
    }
  }

  // DELETE /api/v1/products/restaurant-categories/{id}/
  async deleteCategoria(id) {
    try {
      await api.delete(`/v1/products/restaurant-categories/${id}/`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar categoría',
      };
    }
  }
}

export default new CategoriaService();
