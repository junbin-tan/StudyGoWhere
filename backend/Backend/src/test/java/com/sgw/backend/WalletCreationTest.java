package com.sgw.backend;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Student;
import com.sgw.backend.service.AdminService;
import com.sgw.backend.service.OwnerService;
import com.sgw.backend.service.StudentService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tests the generation of Wallets from a GeneralUser.
 * Wallets can't be created directly, they are created when a new GeneralUser is created.
 *
 * That being said, these tests aren't strictly mandatory since the database schema ensures
 * a mandatory bidirectional relationship between GeneralUser and Wallet.
 * Still, it is good to have.
 * @author pohsan
 */
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
public class WalletCreationTest {
    @Autowired
    AdminService adminService;
    @Autowired
    StudentService studentService;
    @Autowired
    OwnerService ownerService;


    @Test
    public void createAdminAndCheckWalletReferences() {
        Admin userA = new Admin("foobar", "password1");
        Assertions.assertDoesNotThrow(() -> {adminService.addAdmin(userA);});
        Admin fetchedUserA = adminService.getAdminByUsername("foobar");
        Assertions.assertNotNull(fetchedUserA.getWallet());
        System.out.println(fetchedUserA.getWallet().getGeneralUser());
        Assertions.assertNotNull(fetchedUserA.getWallet().getGeneralUser());
    }

    @Test
    public void createStudentAndCheckWalletReferences() {
        Student userA = new Student("foobar", "password1");
        Assertions.assertDoesNotThrow(() -> {studentService.addStudent(userA);});
        Student fetchedUserA = studentService.getStudentByUsername("foobar");
        Assertions.assertNotNull(fetchedUserA.getWallet());
        Assertions.assertNotNull(fetchedUserA.getWallet().getGeneralUser());
    }

    @Test
    public void createOwnerAndCheckWalletReferences() {
        Owner userA = new Owner("foobar", "password1");
        Assertions.assertDoesNotThrow(() -> {ownerService.addOwner(userA);});
        Owner fetchedUserA = ownerService.getOwnerByUsername("foobar");
        Assertions.assertNotNull(fetchedUserA.getWallet());
        Assertions.assertNotNull(fetchedUserA.getWallet().getGeneralUser());
    }
}
