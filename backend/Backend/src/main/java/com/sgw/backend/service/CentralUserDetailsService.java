package com.sgw.backend.service;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity_venue.Operator;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.OperatorRepository;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CentralUserDetailsService implements UserDetailsService {
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final OwnerRepository ownerRepository;
    private final OperatorRepository operatorRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Determine the user's access rights based on some logic.
        // For example, you can check the username prefix or a role-based flag.
        if (studentRepository.getStudentByUsername(username) != null) {
            Student person = new Student();
            person.setUsername(username);
            person.setPassword(studentRepository.getStudentByUsername(username).getPassword());
            return person;
        } else if (ownerRepository.getOwnerByUsername(username) != null) {
            Owner person = new Owner();
            person.setUsername(username);
            person.setPassword(ownerRepository.getOwnerByUsername(username).getPassword());
            return person;
        } else if (adminRepository.getAdminByUsername(username) != null) {
            Admin person = new Admin();
            person.setUsername(username);
            person.setPassword(adminRepository.getAdminByUsername(username).getPassword());
            return person;
        } else if (operatorRepository.getOperatorByUsername(username) != null) {
            Operator person = new Operator();
            person.setUsername(username);
            person.setPassword(operatorRepository.getOperatorByUsername(username).getPassword());
            return person;
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }

}
