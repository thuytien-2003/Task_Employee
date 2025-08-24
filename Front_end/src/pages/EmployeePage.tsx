import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, message, Card, Typography, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { employeeAPI } from '../api/employeeApi';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import type { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../types/employee';

const { Title } = Typography;

const EmployeePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Query để lấy danh sách employees
  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeAPI.getAllEmployees,
  });

  // Mutation để tạo employee mới
  const createMutation = useMutation({
    mutationFn: employeeAPI.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Thêm nhân viên thành công!');
      setIsModalVisible(false);
      setEditingEmployee(null);
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi thêm nhân viên: ${error.message}`);
    },
  });

  // Mutation để cập nhật employee
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeUpdateRequest }) =>
      employeeAPI.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Cập nhật nhân viên thành công!');
      setIsModalVisible(false);
      setEditingEmployee(null);
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi cập nhật nhân viên: ${error.message}`);
    },
  });

  // Mutation để xóa employee
  const deleteMutation = useMutation({
    mutationFn: employeeAPI.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Xóa nhân viên thành công!');
    },
    onError: (error: Error) => {
      message.error(`Lỗi khi xóa nhân viên: ${error.message}`);
    },
  });

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (values: EmployeeCreateRequest | EmployeeUpdateRequest) => {
    if (editingEmployee) {
      updateMutation.mutate({
        id: editingEmployee.id,
        data: values as EmployeeUpdateRequest,
      });
    } else {
      createMutation.mutate(values as EmployeeCreateRequest);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
  };

  if (error) {
    message.error('Lỗi khi tải dữ liệu nhân viên');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="shadow-lg">
        <div className="mb-6">
          <Title level={2} className="text-gray-800 mb-4">Quản lý nhân viên</Title>
          <Space className="flex flex-wrap gap-3">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
              className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
            >
              Thêm nhân viên
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              size="large"
              className="border-gray-300 hover:border-blue-500 hover:text-blue-500"
            >
              Làm mới
            </Button>
          </Space>
        </div>

        <EmployeeList
          data={employees}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EmployeeForm
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          initialValues={editingEmployee}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Card>
    </div>
  );
};

export default EmployeePage;
