package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EmployeeCreateRequest;
import com.example.demo.dto.EmployeeDTO;
import com.example.demo.dto.EmployeeUpdateRequest;
import com.example.demo.entities.Employee;
import com.example.demo.exception.EntityDuplicateException;
import com.example.demo.exception.EntityNotFoundException;
import com.example.demo.repositories.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //Tạo nhân viên
    public EmployeeDTO  createEmployee(EmployeeCreateRequest request) {
        // Kiểm tra xem email đã tồn tại chưa
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new EntityDuplicateException("Email " + request.getEmail() + " đã tồn tại trong hệ thống");
        }

        Employee employee = new Employee();
        employee.setFullName(request.getFullName());
        employee.setEmail(request.getEmail());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setGender(request.getGender());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setActive(request.getActive() != null ? request.getActive() : true);
        employee.setHashedPassword(passwordEncoder.encode(request.getPassword()));

        Employee savedEmployee = employeeRepository.save(employee);
        return convertDTO(savedEmployee);
    }

    //Xem toàn bộ nhân viên (có phân trang)
    public Page<EmployeeDTO> getAllEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Employee> employeePage = employeeRepository.findAll(pageable);
        return employeePage.map(this::convertDTO);
    }

    //Xem thông tin nhân viên theo id
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));
        return convertDTO(employee);
    }

    //Xóa nhân viên
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id);
        }
        employeeRepository.deleteById(id);
    }

    //Cập nhật thông tin nhân viên
    public EmployeeDTO updateEmployee(Long id, EmployeeUpdateRequest request){
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + id));

        if(request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }
        if(request.getDateOfBirth() != null) {
            employee.setDateOfBirth(request.getDateOfBirth());
        }
        if(request.getGender() != null) {
            employee.setGender(request.getGender());
        }
        if(request.getPhoneNumber() != null) {
            employee.setPhoneNumber(request.getPhoneNumber());
        }
        if(request.getActive() != null) {
            employee.setActive(request.getActive());
        }
        if(request.getPassword() != null) {
            employee.setHashedPassword(passwordEncoder.encode(request.getPassword()));
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertDTO(updatedEmployee);
    }

    private EmployeeDTO convertDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setFullName(employee.getFullName());
        dto.setEmail(employee.getEmail());
        dto.setDateOfBirth(employee.getDateOfBirth());
        dto.setGender(employee.getGender());
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setActive(employee.getActive());
        dto.setCreatedAt(employee.getCreatedAt());
        dto.setUpdatedAt(employee.getUpdatedAt());
        return dto;
    }
}
