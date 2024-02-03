package com.sgw.backend.utilities;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Student;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.GeneralUserRepository;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.function.Function;

@Service
@Transactional
@RequiredArgsConstructor
public class UserContext {

    private final GeneralUserRepository generalUserRepository;

    private final OwnerRepository ownerRepository;

    private final AdminRepository adminRepository;

    private final StudentRepository studentRepository;

    public <T> Optional<T> obtainRequesterIdentity(Function<String, T> function) {
        return Optional.ofNullable(SecurityContextHolder.getContext())
                .map(c -> c.getAuthentication())
                .map(a -> a.getPrincipal())
                .flatMap(getGeneralUser(function));
    }

    private <T> Function<Object, Optional<T>> getGeneralUser(Function<String, T> function) {
        return p ->  {
            if (p instanceof UserDetails) {
                UserDetails user = (UserDetails) p;
                return Optional.ofNullable(function.apply(user.getUsername()));
            }
            return Optional.empty();
        };
    }

    public Optional<Owner> obtainOwnerIdentity() {
        return obtainRequesterIdentity((u) -> ownerRepository.getOwnerByUsername(u));
    }
    public Optional<Admin> obtainAdminIdentity() {
        return obtainRequesterIdentity((u) -> adminRepository.getAdminByUsername(u));
    }

    public Optional<Student> obtainStudentIdentity() {
        return obtainRequesterIdentity((u) -> studentRepository.getStudentByUsername(u));
    }

}
