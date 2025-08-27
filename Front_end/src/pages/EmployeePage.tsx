import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, message, Card, Typography, Space, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { employeeAPI } from '../api/employeeApi';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import type { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../types/employee';

const { Title } = Typography;

const EmployeePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Query để lấy danh sách employees với pagination
  const {
    data: employeeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employees', currentPage],
    queryFn: () => employeeAPI.getAllEmployees(currentPage - 1, pageSize),
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Xử lý phím Enter để mở form thêm nhân viên
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chỉ xử lý khi không có modal nào đang mở và không focus vào input nào
      if (e.key === 'Enter' && !isModalVisible && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA' &&
          document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        handleAdd();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalVisible]);

  // Extract employees từ pagination response
  const employees = employeeData?.content || [];

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
          </Space>
        </div>

        <EmployeeList
          data={employees}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={employeeData?.totalElements || 0}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} nhân viên`
            }
            onChange={handlePageChange}
          />
        </div>

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
