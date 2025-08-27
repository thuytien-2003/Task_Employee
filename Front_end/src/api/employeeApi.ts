import type { Employee, EmployeeCreateRequest, EmployeeUpdateRequest, PageResponse } from '../types/employee';

const API_BASE_URL = 'http://localhost:8080/api';

export const employeeAPI = {
  // Lấy tất cả employees với pagination
  getAllEmployees: async (page: number = 0, size: number = 8): Promise<PageResponse<Employee>> => {
    const response = await fetch(`${API_BASE_URL}/employees?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  },

  // Lấy employee theo ID
  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }
    return response.json();
  },

  // Tạo employee mới
  createEmployee: async (data: EmployeeCreateRequest): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create employee');
    }
    return response.json();
  },

  // Cập nhật employee
  updateEmployee: async (id: number, data: EmployeeUpdateRequest): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update employee');
    }
    return response.json();
  },

  // Xóa employee
  deleteEmployee: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }
  },
};
