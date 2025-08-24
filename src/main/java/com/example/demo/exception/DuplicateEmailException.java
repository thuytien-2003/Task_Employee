package com.example.demo.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }

    public DuplicateEmailException(String email, Long id) {
        super("Email " + email + " is already in use by employee with ID " + id);
    }
}
