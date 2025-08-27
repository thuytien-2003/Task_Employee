import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Switch } from 'antd';
import dayjs from 'dayjs';
import type { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../types/employee';
import { Gender as GenderEnum } from '../types/employee';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EmployeeCreateRequest | EmployeeUpdateRequest) => void;
  initialValues?: Employee | null;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      };
      onSubmit(formattedValues);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      handleOk();
    }
  };

  // Set form values when initialValues change
  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      centered
      destroyOnClose
      className="!top-0"
    >
      <div onKeyDown={handleKeyDown}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            active: true,
          }}
        >
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 4, max: 160, message: 'Họ và tên phải từ 4-160 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
            { max: 100, message: 'Email không được quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker 
            placeholder="Chọn ngày sinh" 
            format="DD/MM/YYYY"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value={GenderEnum.MALE}>Nam</Select.Option>
            <Select.Option value={GenderEnum.FEMALE}>Nữ</Select.Option>
            <Select.Option value={GenderEnum.OTHER}>Khác</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^\d{10}$/, message: 'Số điện thoại phải có đúng 10 chữ số!' }
          ]}
        >
          <Input placeholder="Nhập số điện thoại (10 số)" />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}

        <Form.Item
          name="active"
          label="Trạng thái hoạt động"
          valuePropName="checked"
        >
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
        </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EmployeeForm;
