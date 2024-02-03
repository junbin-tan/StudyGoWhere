package com.sgw.backend.repository;

import com.sgw.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Student getStudentByUserId(Long userId);
    Student getStudentByUsername(String username);

}

