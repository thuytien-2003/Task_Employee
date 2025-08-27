package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Lớp này xử lý các exception toàn cục cho ứng dụng.
// Nó bắt các exception được ném ra từ controller
// và trả về định dạng lỗi, phản hồi nhất quán cho client.

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý lỗi validate dữ liệu
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errorMessages = new ArrayList<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String errorMessage = error.getDefaultMessage();
            String fieldName = ((FieldError) error).getField();
            errorMessages.add(fieldName + ": " + errorMessage);

        });

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                errorMessages,
                HttpStatus.BAD_REQUEST.getReasonPhrase());

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi truy cập bị từ chối
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 403);
        errorResponse.put("error", "Forbidden");
        errorResponse.put("messages", List.of("Access denied: You don't have permission to access this resource"));

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    // Xử lý lỗi xác thực (đăng nhập)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 401);
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("messages", List.of("Authentication failed: " + ex.getMessage()));

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    // Xử lý lỗi không tìm thấy entity (dữ liệu)
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getStatus().value(), List.of(ex.getMessage()),
                ex.getStatus().getReasonPhrase());
        return new ResponseEntity<>(errorResponse, ex.getStatus());
    }

    @ExceptionHandler(EntityDuplicateException.class)
    public ResponseEntity<ErrorResponse> handleEntityDuplicateException(EntityDuplicateException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getStatus().value(), List.of(ex.getMessage()),
                ex.getStatus().getReasonPhrase());
        return new ResponseEntity<>(errorResponse, ex.getStatus());
    }

    // Xử lý lỗi HTTP tuỳ chỉnh
    @ExceptionHandler(HttpException.class)
    public ResponseEntity<ErrorResponse> handleHttpException(HttpException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getStatus().value(),
                List.of(ex.getMessage()),
                ex.getStatus().getReasonPhrase()
        );
        return new ResponseEntity<>(errorResponse, ex.getStatus());
    }

    // Xử lý các lỗi chưa xác định khác (lỗi tổng quát)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                List.of(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}