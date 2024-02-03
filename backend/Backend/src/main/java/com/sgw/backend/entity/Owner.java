package com.sgw.backend.entity;

import com.sgw.backend.entity_venue.Venue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

//@EqualsAndHashCode(callSuper = true)
@Entity
@Data
// @JsonIdentityInfo(
// generator = ObjectIdGenerators.PropertyGenerator.class,
// property = "userId")
@AllArgsConstructor
@NoArgsConstructor
public class Owner extends GeneralUser implements UserDetails {
    @OneToMany(mappedBy = "owner")
    private List<Advertisement> advertisements;

    @OneToMany(mappedBy = "purchasingOwner")
    private List<Subscription> subscription;

    private Long nextMonthSubcriptionTypeId;

    private boolean autoRenewSubscription;

    private LocalDate currentSubscriptionEndDate;

    private Long currentSubscriptionId;

    @OneToMany(mappedBy = "owner")
    private List<Venue> venues;

    @OneToMany(mappedBy = "owner")
    private List<VoucherListing> voucherListings;

    @OneToMany(mappedBy = "owner")
    private List<Menu> menuTemplates;

    // public Owner() {
    // super();
    // this.advertisements = new ArrayList<>();
    // }
    //

    public Owner(String username, String password) {
        super(username, password);
        this.advertisements = new ArrayList<>();
        this.subscription = new ArrayList<>();
        this.venues = new ArrayList<>();
        this.voucherListings = new ArrayList<>();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("Owner"));
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

    @Override
    public String toString() {
        return "Owner userId=" + getUserId();
    }
}
