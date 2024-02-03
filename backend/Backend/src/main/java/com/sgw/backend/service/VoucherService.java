package com.sgw.backend.service;

import com.sgw.backend.entity.Student;
import com.sgw.backend.entity.Transaction;
import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity.VoucherListing;
import com.sgw.backend.entity.VoucherStatusEnum;
import com.sgw.backend.entity.Wallet;
import com.sgw.backend.repository.StudentRepository;
import com.sgw.backend.repository.TransactionRepository;
import com.sgw.backend.repository.VoucherListingRepository;
import com.sgw.backend.repository.VoucherRepository;

import org.hibernate.TransactionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Transactional
@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherListingRepository voucherListingRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private WalletService walletService;

    @Autowired
    private TransactionService transactionService;

    public String generateRandomVoucherCode(int length) {
        String voucherCode = "";
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < length; i++) {
            voucherCode += characters.charAt((int) (Math.random() * characters.length()));
        }
        return voucherCode;
    }

    @Transactional
    public List<Voucher> getAllVouchersByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return new ArrayList<>(student.getVouchers());
    }

    @Transactional
    public Voucher buyVoucher(Long voucherListingId, Long studentId) throws Exception {
        VoucherListing voucherListing = voucherListingRepository.findById(voucherListingId)
                .orElseThrow(() -> new Exception("Voucher listing not found"));

        if (voucherListing.getVoucherStock() <= 0) {
            throw new Exception("Voucher out of stock");
        }

        // Create a new voucher
        Voucher voucher = new Voucher();

        // Get student and owner wallets
        Wallet studentWallet = walletService
                .getWalletById(studentRepository.findById(studentId).get().getWallet().getWalletId());
        Wallet ownerWallet = walletService.getWalletById(voucherListing.getOwner().getWallet().getWalletId());

        // Set voucher details
        voucher.setVoucherName(voucherListing.getVoucherName());
        voucher.setVoucherExpiryDate(LocalDate.now().plusDays(voucherListing.getValidityPeriodInDays()));
        voucher.setVoucherStatusEnum(VoucherStatusEnum.UNREDEEMED);
        voucher.setVoucherCode(""); // Voucher code generated only when activated
        voucher.setVoucherValue(voucherListing.getVoucherValue().multiply(new BigDecimal(100)));
        voucher.setBillablePrice(voucherListing.getVoucherCost().multiply(new BigDecimal(100)));
        voucher.setVoucherValue(voucherListing.getVoucherValue().multiply(new BigDecimal(100)));

        // Get 1 of owners venue
        String venueName = voucherListing.getOwner().getVenues().get(0).getVenueName();
        String[] words = venueName.split(" ");

        voucher.setVoucherApplicableVenue(words[0]);

        // should we set voucherWallet here? though im not sure of the purpose of having
        // this bidirectional relationship
        // right now its always null

        // Associate voucher with student that bought it
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new Exception("Student not found for voucher purchase"));
        student.getVouchers().add(voucher);

        // Assign and save voucher
        studentRepository.save(student);
        voucher.setVoucherStudent(student);
        voucher = voucherRepository.save(voucher);

        // Create a transaction for the purchase
        try {
            Transaction transaction = transactionService.createAndAddTransaction(voucher, studentWallet, ownerWallet);
            transactionService.completeATransaction(transaction);
        } catch (Exception e) {
            throw new TransactionException("Error occurred while processing the transaction", e);
        }

        // Remove 1 from total stock of voucher
        voucherListing.setVoucherStock(voucherListing.getVoucherStock() - 1);

        // Associate voucher with voucher listing [voucherListing -> voucher]
        voucherListing.getVouchers().add(voucher);
        voucherListingRepository.save(voucherListing);

        return voucher;
    }

    @Transactional
    public Voucher activateVoucher(Long voucherId) throws Exception {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new Exception("Voucher not found"));

        if (voucher.getVoucherStatusEnum() != VoucherStatusEnum.UNREDEEMED) {
            throw new Exception("Cannot activate a voucher that is not in UNREDEEMED state");
        }

        if (voucher.getVoucherExpiryDate().isBefore(LocalDate.now())) {
            throw new Exception("Cannot activate an expired voucher");
        }

        voucher.setVoucherStatusEnum(VoucherStatusEnum.ACTIVATED);
        voucher.setActive(true);
        voucher.setActivationTime(LocalDateTime.now());
        voucher.setVoucherCode(generateRandomVoucherCode(5));

        voucherRepository.save(voucher);

        return voucher;
    }

    public Voucher getVoucherByVoucherCode(String voucherCode) {
        return voucherRepository.findByVoucherCode(voucherCode);
    }

    @Transactional
    public Voucher validateVoucherForUse(String voucherCode) throws Exception {
        Voucher voucher = voucherRepository.findByVoucherCode(voucherCode);

        if (voucher == null) {
            throw new Exception("Invalid voucher code.");
        }

        // Check the voucher's status
        if (voucher.getVoucherStatusEnum() != VoucherStatusEnum.ACTIVATED) {
            throw new Exception("Voucher is not in the correct state for redemption.");
        }

        // Check the voucher's expiration time
        if (voucher.getVoucherStatusEnum().equals(VoucherStatusEnum.EXPIRED)
                || voucher.getVoucherExpiryDate().isBefore(LocalDate.now())) {
            throw new Exception("Voucher has expired.");
        }

        // Check if the voucher is within the valid time frame for use after activation
        LocalDateTime activationTime = voucher.getActivationTime();
        if (activationTime == null || LocalDateTime.now().isAfter(activationTime.plusMinutes(15))) {
            throw new Exception("Voucher is outside the valid time window for use.");
        }

        voucher.setVoucherStatusEnum(VoucherStatusEnum.REDEEMED);

        // add some logic to discount the current cart or something

        voucherRepository.save(voucher);

        return voucher;
    }

    // Regular expiry of vouchers based on expiry date
    @Transactional
    public void expireVouchersBasedOnExpiryDate() {
        List<Voucher> vouchers = voucherRepository.findAllByVoucherStatusEnum(VoucherStatusEnum.UNREDEEMED);
        LocalDate today = LocalDate.now();

        for (Voucher voucher : vouchers) {
            if (voucher.getVoucherExpiryDate().isBefore(today)) {
                voucher.setVoucherStatusEnum(VoucherStatusEnum.EXPIRED);
                System.out.println("Voucher " + voucher.getVoucherCode() + " has expired. (EXPIRY DATE)");
                voucherRepository.save(voucher);
            }
        }
    }

    // Expiry of vouchers based on activation time (15 minutes)
    @Transactional
    public void expireActivatedVouchers() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> activatedVouchers = voucherRepository.findAllByVoucherStatusEnum(VoucherStatusEnum.ACTIVATED);

        for (Voucher voucher : activatedVouchers) {
            LocalDateTime activationTime = voucher.getActivationTime();
            if (now.isAfter(activationTime.plusMinutes(15))) {
                voucher.setVoucherStatusEnum(VoucherStatusEnum.EXPIRED);
                System.out.println("Voucher " + voucher.getVoucherCode() + " has expired. (ACTIVATED)");
                voucherRepository.save(voucher);
            }
        }
    }

    /**
     * Just basic/dummy adding into database for now...
     * the actual method should implement business use case of taking
     * voucher info and price from VoucherListing
     * 
     * @param v
     */
    public Voucher addVoucher(Voucher v) {
        return voucherRepository.save(v);
    }

    public Voucher getVoucherById(Long id) {
        return voucherRepository.getReferenceById(id);
    }

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }
}
