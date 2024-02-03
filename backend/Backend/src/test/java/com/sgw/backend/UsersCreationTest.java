package com.sgw.backend;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Student;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.service.AdminService;
import com.sgw.backend.service.StudentService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class UsersCreationTest {

    @Autowired
    AdminService adminService;

    @Autowired
    StudentService studentService;

    @Test
    public void twoUsersWithSameUsername() {
        Admin userA = new Admin("foobar", "password1");
        Admin userB = new Admin("foobar", "password2");


        Assertions.assertDoesNotThrow(() -> {adminService.addAdmin(userA);});

        Exception expectedException = Assertions.assertThrows(UsernameAlreadyExistsException.class, () -> {
            adminService.addAdmin(userB);
        });

        //!! testing that same username across different categories don't conflict
        Student studentA = new Student("foobar", "password1");
        Assertions.assertDoesNotThrow(() -> {studentService.addStudent(studentA);});


//        ### Use this if you want to test the exception message as well
//        Assertions.assertEquals("error message", expectedException.getMessage());

    }
}
