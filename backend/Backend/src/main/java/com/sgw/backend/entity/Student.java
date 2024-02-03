package com.sgw.backend.entity;

import com.sgw.backend.entity_booking.Booking;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student extends GeneralUser implements UserDetails {

    @OneToMany(mappedBy = "student")
    private List<Review> reviews;

    @OneToMany(mappedBy = "bookingStudent")
    private List<Booking> bookings;

    @OneToMany(mappedBy = "voucherStudent")
    private List<Voucher> vouchers;

    @OneToMany(mappedBy = "menuItemBillableStudent")
    private List<MenuItemBillable> menuItemBillables;

    public Student(String username, String password) {
        super(username, password);
        this.reviews = new ArrayList<>();
        this.bookings = new ArrayList<>();
        this.vouchers = new ArrayList<>();
        this.menuItemBillables = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("Student"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

}
