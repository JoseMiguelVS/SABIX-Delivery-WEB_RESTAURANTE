import api from '@/services/api'

class ProductoService {
  // GET /api/v1/products/restaurant-products/
  async getProductos() {
    try {
      const response = await api.get('/v1/products/products/')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar productos',
      }
    }
  }

  // POST /api/v1/products/restaurant-products/
  async createProducto(data) {
    try {
      const response = await api.post('/v1/products/products/', data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear producto',
        errors: error.response?.data?.errors || null,
      }
    }
  }

  // GET /api/v1/products/restaurant-products/{id}/
  async getProductoById(id) {
    try {
      const response = await api.get(`/v1/products/products/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener producto',
      }
    }
  }

  // PUT /api/v1/products/restaurant-products/{id}/
  async updateProducto(id, data) {
    try {
      const response = await api.put(`/v1/products/products/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar producto',
        errors: error.response?.data?.errors || null,
      }
    }
  }

  // DELETE /api/v1/products/restaurant-products/{id}/
  async deleteProducto(id) {
    try {
      await api.delete(`/v1/products/products/${id}/`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar producto',
      }
    }
  }

  // GET /api/v1/products/restaurant-categories/ - Para obtener categorías
  async getCategorias() {
    try {
      const response = await api.get('/v1/products/restaurant-categories/')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar categorías',
      }
    }
  }
}

export default new ProductoService()
