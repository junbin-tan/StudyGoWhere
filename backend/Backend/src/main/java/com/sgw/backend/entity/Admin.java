package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends GeneralUser implements UserDetails {

    /*
    @OneToMany
    private List<Ticket> associatedTickets;
    */

    @OneToMany(mappedBy = "admin")
    private List<SubscriptionType> subscriptionTypes;

    //private List<Promotion> promotions; are we doing admin approval?

    //    public Admin() {
//        this.associatedTickets = new ArrayList<>();
//    }
//
    public Admin(String username, String password) {
        super(username, password);
        // this.associatedTickets = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("Admin"));
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
//    public List<Ticket> getAssociatedTickets() {
//        return associatedTickets;
//    }
//
//    public void setAssociatedTickets(List<Ticket> associatedTickets) {
//        this.associatedTickets = associatedTickets;
//    }
    @Override
    public String toString() {
        return this.getUsername();
    }


}

