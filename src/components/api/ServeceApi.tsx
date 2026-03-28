import axiosInstance from "./api";

// Interface para o tipo de usuário
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Serviço para usuários
const userService = {
  // Obter todos os usuários
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>("/users");
    return response.data; // No need to cast as User
  },

  // Obter um usuário por ID
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data; // No need to cast as User
  },

  // Criar um novo usuário
  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post("/users", userData);
    return response.data as User;
  },

  // Atualizar um usuário
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data as User;
  },

  // Deletar um usuário
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};

export default userService;