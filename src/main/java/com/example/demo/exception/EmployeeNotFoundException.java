//Tạo các exception để xử lý lỗi rõ ràng
package com.example.demo.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(String message) {
        super(message);
    }

    public EmployeeNotFoundException(Long id) {
        super("Employee with ID " + id + " not found.");
    }
}
