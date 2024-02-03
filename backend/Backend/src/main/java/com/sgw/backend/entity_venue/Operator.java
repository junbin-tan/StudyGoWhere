package com.sgw.backend.entity_venue;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.entity_venue.Venue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
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
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Operator extends GeneralUser implements UserDetails {

    @JsonIgnore
    // we can make a DTO, but it feels far easier to just ignore this field
    // and manually handle serialisation in the controller
    @OneToOne(mappedBy = "operator")
    private Venue venue;

//    public Operator(String username, String password) {
//        super(username, password);
//    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("Operator"));
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

//
//    public Venue getVenue() {
//        return venue;
//    }
//
//    public void setVenue(Venue venue) {
//        this.venue = venue;
//    }
}
