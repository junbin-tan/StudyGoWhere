package com.sgw.backend.service;

import com.sgw.backend.entity.Advertisement;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity.VoucherListing;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.exception.VenueNotFoundException;
import com.sgw.backend.exception.VoucherListingException;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.VenueRepository;
import com.sgw.backend.repository.VoucherListingRepository;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class VoucherListingService {

    @Autowired
    private final VoucherListingRepository voucherListingRepository;
    @Autowired
    private final VenueRepository venueRepository;
    @Autowired
    private final UserContext userContext;
    @Autowired
    private final OwnerRepository ownerRepository;

    public List<VoucherListing> getAllVenueVoucherListing() throws Exception {
        Owner o = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        if (o == null) {
            throw new InvalidUserException("User not found");
        }

        List<VoucherListing> voucherListing = o.getVoucherListings();

        if (voucherListing == null || voucherListing.isEmpty()) {
            o.setVoucherListings(new ArrayList<VoucherListing>());
            ownerRepository.save(o);
            return new ArrayList<VoucherListing>();
        }
        return voucherListing;
    }

    public VoucherListing addVoucherListing(VoucherListing voucherListing) throws Exception {
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        if (owner == null) {
            throw new InvalidUserException("User not found");
        }

        voucherListing.setAdminBanned(false);
        voucherListing.setCompleted(false);
        voucherListing.setOwner(owner);
        voucherListing.setVouchers(new ArrayList<Voucher>());
        voucherListingRepository.save(voucherListing);
        owner.getVoucherListings().add(voucherListing);
        ownerRepository.save(owner);

        return voucherListing;
    }

    public VoucherListing activateDeactivateVoucherListing(Long id) {
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        VoucherListing current = voucherListingRepository.findById(id).orElse(null);
        if (owner == null) {
            throw new InvalidUserException("User not found");
        }
        if (current == null) {
            throw new VoucherListingException("VoucherListing not found");
        }

        if (current.isEnabled()) {
            current.setEnabled(false);
        } else {
            current.setEnabled(true);
        }

        voucherListingRepository.save(current);
        List<VoucherListing> allOwnerVoucher = owner.getVoucherListings();
        for (VoucherListing vs : allOwnerVoucher) {
            if (vs.getVoucherListingId() == current.getVoucherListingId()) {
                vs.setEnabled(current.isEnabled());
            }
        }
        owner.setVoucherListings(allOwnerVoucher);
        ownerRepository.save(owner);
        return current;
    }

    public VoucherListing getVoucherListingById(Long id) {
        VoucherListing vc = voucherListingRepository.findById(id).orElse(null);
        return vc;
    }


    public VoucherListing updateVoucherListing(Long id, VoucherListing vc) {
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        VoucherListing toUpdate = voucherListingRepository.findById(id).orElse(null);
        if (owner == null) {
            throw new InvalidUserException("User not found");
        }
        if (toUpdate == null) {
            throw new VoucherListingException("VoucherListing not found");
        }

        toUpdate.setVoucherListingDelistDate(vc.getVoucherListingDelistDate());
        toUpdate.setValidityPeriodInDays(vc.getValidityPeriodInDays());
        toUpdate.setDescription(vc.getDescription());
        toUpdate.setVoucherValue(vc.getVoucherValue());
        toUpdate.setVoucherCost(vc.getVoucherCost());
        toUpdate.setVoucherStock(vc.getVoucherStock());
        toUpdate.setEnabled(vc.isEnabled());
        toUpdate.setVoucherName(vc.getVoucherName());

        voucherListingRepository.save(toUpdate);

        List<VoucherListing> allOwnerVoucher = owner.getVoucherListings();
        for (VoucherListing vs : allOwnerVoucher) {
            if (vs.getVoucherListingId() == toUpdate.getVoucherListingId()) {
                vs.setVoucherListingDelistDate(vc.getVoucherListingDelistDate());
                vs.setValidityPeriodInDays(vc.getValidityPeriodInDays());
                vs.setDescription(vc.getDescription());
                vs.setVoucherValue(vc.getVoucherValue());
                vs.setVoucherCost(vc.getVoucherCost());
                vs.setVoucherStock(vc.getVoucherStock());
                vs.setEnabled(vc.isEnabled());
                vs.setVoucherName(vc.getVoucherName());
            }
        }
        owner.setVoucherListings(allOwnerVoucher);
        ownerRepository.save(owner);
        return toUpdate;
    }

    public void deleteVoucherListing(Long id) {

        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        VoucherListing toDelete = voucherListingRepository.findById(id).orElse(null);
        if (owner == null) {
            throw new InvalidUserException("User not found");
        }
        if (toDelete == null) {
            throw new VoucherListingException("VoucherListing not found");
        }

        voucherListingRepository.delete(toDelete);
        List<VoucherListing> allOwnerVoucher = owner.getVoucherListings();
        allOwnerVoucher.remove(toDelete);
        ownerRepository.save(owner);

    }

    public List<VoucherListing> getAllVoucherListings() {
        return voucherListingRepository.findAll();
    }


    // THIS METHOD IS USED BY ADMIN
    public void activateVoucherListing(Long id) {
        System.out.println("CALLED");
        VoucherListing temp = voucherListingRepository.findById(id).orElse(null);
        if (temp != null) {
            if (temp.isAdminBanned()) {
                temp.setAdminBanned(false);
            } else {
                temp.setAdminBanned(true);
            }
            System.out.println(temp.isAdminBanned());
            voucherListingRepository.save(temp);
        }
    }

    public void voucherListingCleanUpTask() {
        List<VoucherListing> allV = voucherListingRepository.findAll();
        for (VoucherListing v : allV) {
            if (v.getVoucherListingDelistDate().isEqual(LocalDate.now()) || v.getVoucherListingDelistDate().isBefore(LocalDate.now()) || v.getVoucherStock() == 0) {
                v.setCompleted(true);
                voucherListingRepository.save(v);
                Owner o = ownerRepository.findById(v.getOwner().getUserId()).orElse(null);

                List<VoucherListing> ownersVc = o.getVoucherListings();
                if (!ownersVc.isEmpty() && ownersVc != null) {
                    for (int i = 0; i < ownersVc.size(); i++) {
                        if (v.getVoucherListingId() == ownersVc.get(i).getVoucherListingId()) {
                            ownersVc.set(i, v);
                            break;
                        }
                    }
                    o.setVoucherListings(ownersVc);
                    ownerRepository.save(o);
                }
            }
        }
    }

    public List<VoucherListing> getAllVoucherListingsByOwnerId(Long ownerId) throws Exception {
        return voucherListingRepository.findByOwnerUserId(ownerId);
    }

    public List<VoucherListing> getAllVoucherListingsByOwnerUsername(String username) throws Exception {
        return voucherListingRepository.findByOwnerUsername(username);
    }
    // === We should not need to use this, but just in case lets keep it around ===
//    public VoucherListing getVoucherListingByVoucher(Voucher voucher) {
//        VoucherListing vc = voucherListingRepository.findByVoucher(voucher);
//        return vc;
//    }

}
