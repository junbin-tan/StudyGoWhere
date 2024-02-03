package com.sgw.backend.service;

import com.sgw.backend.entity.Student;
import com.sgw.backend.exception.UserDoesNotExistException;
import com.sgw.backend.exception.UserIsNotVerifiedException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.exception.VerificationCodeIsExpiredException;
import com.sgw.backend.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class StudentService {
    private final StudentRepository studentRepo;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepo,
                          WalletService walletService,
                          PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    // note that this addGeneralUser can add Students, Students, etc.
    public Student addStudent(Student newStudent) throws Exception {

        Student checkedStudent = getStudentByUsername(newStudent.getUsername());

        if (checkedStudent == null) {
            walletService.addNewWalletToUser(newStudent);
            newStudent.setPassword(passwordEncoder.encode(newStudent.getPassword()));
            studentRepo.save(newStudent);
            studentRepo.flush();
            return newStudent;
        } else {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("This guy already exists");
            throw e;
        }
    }

    public Student addStudentWithVerification(Student student) throws Exception {

        Student checkedStudent = getStudentByUsername(student.getUsername());

        if (checkedStudent == null) {
            walletService.addNewWalletToUser(student);
            student.setPassword(passwordEncoder.encode(student.getPassword()));

            //Setting code of length 6 e.g. 123456 and creation time
            // default student is disabled without verification
            String verificationCode = getRandomCode(6);
            student.setVerificationCode(verificationCode);

            ZonedDateTime singaporeTime = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
            student.setVerificationCodeCreateTime(singaporeTime.toLocalDateTime());

            studentRepo.save(student);
            studentRepo.flush();
            return student;
        } else if (checkedStudent.isEnabled()){
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("User already exists");
            throw e;
        } else {
            throw new UserIsNotVerifiedException("Username is not verified");
        }
    }


    public boolean isCodeValid(Student student, String code) throws Exception{
        Student managedStudent = getStudentByUsername(student.getUsername());

        if (managedStudent != null) {
            String storedCode = managedStudent.getVerificationCode();
            if (!storedCode.equals(code)) {
                return false;
            }
// this code will check if the verificaioncodecreationtime is within 5min limit, if its 5min exact of more than 5min will return false
// if <5min will return true
            if (isWithin5Minutes(managedStudent.getVerificationCodeCreateTime())) {
                //Update student
                managedStudent.setVerified(true);
                studentRepo.save(managedStudent);
                return true;
            }
            return false;
        } else {
            UserDoesNotExistException e = new UserDoesNotExistException("User does not exists");
            throw e;
        }
    }


    public Student getStudentById(Long id) {
        return studentRepo.getStudentByUserId(id);
    }

    public Student getStudentByUsername(String username) {
        return studentRepo.getStudentByUsername(username);
    }

    public void updateStudentDetails(Student student) throws Exception {
        //Perform check to see if jwt match requester
        Student checkedStudent = getStudentByUsername(student.getUsername());
        if (checkedStudent != null) {
            checkedStudent.setName(student.getName());
            checkedStudent.setEmail(student.getEmail());
            studentRepo.save(checkedStudent);
        } else {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("This guy already exists");
            throw e;
        }
    }

    public String getRandomCode(int length) {
        String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "1234567890";
        char[] password = new char[length];
        String combination = capitalCaseLetters + lowerCaseLetters + numbers;
        Random r = new Random();
        for (int i = 0; i < length; i++) {
            password[i] = combination.charAt(r.nextInt(combination.length()));
        }

        return new String(password);
    }

    public boolean isWithin5Minutes(LocalDateTime verificationCodeCreateTime) throws VerificationCodeIsExpiredException {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Singapore"));
        long minutesDifference = ChronoUnit.MINUTES.between(verificationCodeCreateTime, now);
        if (minutesDifference < 5) {
            return true;
        } else {
            throw new VerificationCodeIsExpiredException("Verification Code is Expired");
        }
    }

    public Student refreshStudentVerification(Student student) throws Exception{
        Student checkedStudent = getStudentByUsername(student.getUsername());

        if (checkedStudent != null) {
            //Setting code of length 6 e.g. 123456 and creation time
            // default student is disabled without verification
            String verificationCode = getRandomCode(6);
            student.setVerificationCode(verificationCode);

            ZonedDateTime singaporeTime = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
            student.setVerificationCodeCreateTime(singaporeTime.toLocalDateTime());

            studentRepo.save(student);
            studentRepo.flush();
            return student;
        } else {
            throw new UserDoesNotExistException("User does not exist");
        }
    }

    public boolean changeActivationStatus(Student student) {
        return studentRepo.findById(student.getUserId()).map(s -> {
            s.setEnabled(!s.isEnabled());
            return true;
        }).orElse(false);
    }
}
