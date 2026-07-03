import api from '@/services/api';

export default {
  getUsers() {
    return api.get('/users');
  },
  getUserById(id) {
    return api.get(`/users/${id}`);
  },
  createUser(data) {
    return api.post('/users', data);
  },
  updateUser(id, data) {
    return api.put(`/users/${id}`, data);
  },
  deleteUser(id) {
    return api.delete(`/users/${id}`);
  }
};