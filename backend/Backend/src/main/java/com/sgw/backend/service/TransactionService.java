package com.sgw.backend.service;

import com.sgw.backend.dto.BillableDTO;
import com.sgw.backend.dto.TransactionDTO;
import com.sgw.backend.dto.TransactionDetailDTO;
import com.sgw.backend.entity.Billable;
import com.sgw.backend.entity.MenuItem;
import com.sgw.backend.entity.MenuItemBillable;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity.Transaction;
import com.sgw.backend.entity.TransactionDetail;
import com.sgw.backend.entity.TransactionStatusEnum;
import com.sgw.backend.entity.Wallet;
import com.sgw.backend.entity.*;
import com.sgw.backend.exception.*;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.USER_CONSTANT;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.mapper.Mapper;
import org.springframework.data.util.Pair;
import com.sgw.backend.utilities.UserContext;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class TransactionService {

    private static final String WALLET_ID = "walletId";
    private static final String PAYER_WALLET = "payerWallet";
    private static final String RECEIVER_WALLET = "receiverWallet";

    private final TransactionRepository transactionRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuItemBillableRepository menuItemBillableRepository;
    private final StudentRepository studentRepository;
    private final TransactionDetailRepository transactionDetailRepository;
    private final AdminRepository adminRepository;
    private final BillableRepository billableRepository;
    private final WalletRepository walletRepository;
    private final GeneralUserRepository generalUserRepository;
    private final BillableService billableService;
    private final WalletService walletService;
    private final MapperService mapperService;
    private final EmailSendingService emailService;
    private final UserContext userContext;

    public Transaction getTransactionById(Long id) {
        return transactionRepository.getTransactionByTransactionId(id);
    }

    /**
     * For use in REST APIs. Depending on implementation of frontend, may not need
     * this, but good to have.
     * 
     * @param billableId
     * @param payerWalletId
     * @param receiverWalletId
     * @return
     * @throws BillableAlreadyHasTransactionException
     * @throws PayerBalanceInsufficientException
     */
    public Transaction createAndAddTransactionByIds(Long billableId, Long payerWalletId, Long receiverWalletId)
            throws BillableAlreadyHasTransactionException, PayerBalanceInsufficientException {
        Billable fetchedBillable = billableService.getBillableById(billableId);
        Wallet fetchedPayerWallet = walletService.getWalletById(payerWalletId);
        Wallet fetchedReceiverWallet = walletService.getWalletById(receiverWalletId);
        return createAndAddTransaction(fetchedBillable, fetchedPayerWallet, fetchedReceiverWallet);
    }

    /**
     * Creates a new Transaction object from a Billable, payer Wallet, receiver
     * Wallet.
     * This Transaction object is initialised with a status of PENDING.
     * The funds as specified by billablePrice is deducted from the payerWallet.
     * These funds are not released from the Transaction until its status changes to
     * either COMPLETE or CANCELLED.
     *
     * References to the Transaction are added to both Wallets and the Billable.
     * 
     * @param unmanagedBillable
     * @param unmanagedPayerWallet
     * @param unmanagedReceiverWallet
     * @return
     * @throws PayerBalanceInsufficientException
     * @throws NullPointerException
     * @throws BillableAlreadyHasTransactionException
     */
    public Transaction createAndAddTransaction(Billable unmanagedBillable, Wallet unmanagedPayerWallet,
            Wallet unmanagedReceiverWallet)
            throws PayerBalanceInsufficientException, NullPointerException, BillableAlreadyHasTransactionException {

        Billable billable = billableService.getBillableById(unmanagedBillable.getBillableId());
        Wallet payerWallet = walletService.getWalletById(unmanagedPayerWallet.getWalletId());
        Wallet receiverWallet = walletService.getWalletById(unmanagedReceiverWallet.getWalletId());

        if (billable == null || payerWallet == null || receiverWallet == null) {
            throw new NullPointerException("Billable or wallet(s) are null");
        }
        if (billable.getTransaction() != null) {
            System.out.println("Billable id " + billable.getBillableId() + " already has a Transaction");
            throw new BillableAlreadyHasTransactionException(
                    "Billable id " + billable.getBillableId() + " already has a Transaction");
        }

        Transaction newTransaction = new Transaction(billable, payerWallet, receiverWallet);
        newTransaction.setTransactionStatus(TransactionStatusEnum.PENDING);
        // Transaction's createdTime is set automatically to now when new transaction
        // object is created
        // newTransaction.setPayerWallet(payerWallet);
        // newTransaction.setReceiverWallet(receiverWallet);
        // newTransaction.setBillable(billable);
        transactionRepository.save(newTransaction);

        billable.setTransaction(newTransaction);

        // payerWallet.getOutgoingTransactions().add(newTransaction);
        // receiverWallet.getIncomingTransactions().add(newTransaction);
        walletService.payAPendingTransaction(payerWallet, newTransaction);
        walletService.receiveAPendingTransaction(receiverWallet, newTransaction);

        return newTransaction;
    }

    public void giveRefund(BigDecimal amt, String reason, Long userId) throws BillableAlreadyHasTransactionException,
            PayerBalanceInsufficientException, TransactionNotPendingException {
        Refund ref = new Refund();
        ref.setBillablePrice(amt);
        ref.setBillableName("Refund");
        ref.setRefundReason(reason);
        billableRepository.saveAndFlush(ref);
        userContext.obtainAdminIdentity().filter(a -> a.getUsername().equals(USER_CONSTANT.FINANCE_ADMIN))
                .orElseThrow();
        Admin finance = adminRepository.getAdminByUsername(USER_CONSTANT.FINANCE_ADMIN);
        GeneralUser user = Optional.ofNullable(generalUserRepository.getGeneralUserByUserId(userId))
                .orElseThrow(() -> new InvalidUserException(""));
        Transaction t = createAndAddTransactionV2(ref, finance.getWallet(), user.getWallet());
        completeATransaction(t);
        transactionRepository.save(t);
        String body = "Dear Mr. " + t.getPayerWallet().getGeneralUser().getName() + "," + "\n";
        body += "We have refunded an amount of $" + amt + " for the following reason: "
                + reason;
        emailService.sendEmail(t.getReceiverWallet().getGeneralUser().getEmail(), "Refund", body);
    }

    public void refundTransaction(Long transactionId, String reason) throws BillableAlreadyHasTransactionException,
            PayerBalanceInsufficientException, TransactionNotPendingException {
        Transaction t = transactionRepository.findById(transactionId).orElseThrow(InvalidTransactionException::new);
        if (t.getRefunded()) {
            throw new RuntimeException();
        }
        t.setRefunded(true);
        if (t.getTransactionStatus().equals(TransactionStatusEnum.COMPLETE)) {
            giveRefund(mapperService.generateTotalPrice(t), reason, t.getPayerWallet().getGeneralUser().getUserId());
        } else if (t.getTransactionStatus().equals(TransactionStatusEnum.PENDING)) {
            cancelATransaction(t);
        } else {
            throw new RuntimeException();
        }
        t.setTransactionStatus(TransactionStatusEnum.CANCELLED);
        transactionRepository.save(t);
    }

    public Transaction createAndAddTransactionV2(Billable unmanagedBillable, Wallet unmanagedPayerWallet,
            Wallet unmanagedReceiverWallet)
            throws PayerBalanceInsufficientException, NullPointerException, BillableAlreadyHasTransactionException {

        Billable billable = billableService.getBillableById(unmanagedBillable.getBillableId());
        Wallet payerWallet = walletService.getWalletById(unmanagedPayerWallet.getWalletId());
        Wallet receiverWallet = walletService.getWalletById(unmanagedReceiverWallet.getWalletId());

        if (billable == null || payerWallet == null || receiverWallet == null) {
            throw new NullPointerException("Billable or wallet(s) are null");
        }

        if (billable.getTransaction() != null) {
            System.out.println("Billable id " + billable.getBillableId() + " already has a Transaction");
            throw new BillableAlreadyHasTransactionException(
                    "Billable id " + billable.getBillableId() + " already has a Transaction");
        }

        // this part is quite verbose because I'm not using the old constructor; i don't
        // want to change the old constructor cos it might break sth
        Transaction newTransaction = new Transaction();

        newTransaction.setPayerWallet(payerWallet);
        newTransaction.setReceiverWallet(receiverWallet);
        newTransaction.setTransactionStatus(TransactionStatusEnum.PENDING);
        newTransaction.setCreatedTime(LocalDateTime.now());

        TransactionDetail newTransactionDetail = new TransactionDetail();
        newTransactionDetail.getBillables().add(billable);
        billable.setTransactionDetail(newTransactionDetail);

        // linking the transaction and transactionDetail
        // we can also use ryan's embedded Transaction.addTransactionDetail method; it
        // combines the next 2 lines
        newTransaction.getTransactionDetails().add(newTransactionDetail);
        newTransactionDetail.setTransaction(newTransaction);
        transactionRepository.save(newTransaction);
        transactionDetailRepository.save(newTransactionDetail);

        walletService.payAPendingTransaction(payerWallet, newTransaction);
        walletService.receiveAPendingTransaction(receiverWallet, newTransaction);

        return newTransaction;
    }

    public void topUpTransactionRecord(Billable billable, Wallet receiverWallet)
            throws BillableAlreadyHasTransactionException, PayerBalanceInsufficientException {
        Wallet unlimitedWallet = getPaymentGatewayWallet();
        try {
            Transaction t = createAndAddTransactionV2(billable, unlimitedWallet, receiverWallet);
            completeATransaction(t);
        } catch (PayerBalanceInsufficientException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Wallet getPaymentGatewayWallet() {
        return walletRepository.findWalletByGeneralUser_Username(USER_CONSTANT.PAYMENT_GATEWAY)
                .orElseThrow(RuntimeException::new);
    }

    public void withdrawTransactionRecord(Billable billable, Wallet payerWallet)
            throws PayerBalanceInsufficientException {
        Wallet unlimitedWallet = getPaymentGatewayWallet();
        try {
            log.info(billable.getBillablePrice().toPlainString());
            Transaction t = createAndAddTransactionV2(billable, payerWallet, unlimitedWallet);
            completeATransaction(t);
            log.info("Transaction Completed " + payerWallet.getWalletBalance());
        } catch (PayerBalanceInsufficientException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    // OVERLOADED METHOD: This accepts a List<Billables> and creates a
    // TransactionDetail based on that.
    public Transaction createAndAddTransactionV2(List<Billable> unmanagedBillables, Wallet unmanagedPayerWallet,
            Wallet unmanagedReceiverWallet)
            throws PayerBalanceInsufficientException, NullPointerException, BillableAlreadyHasTransactionException {

        List<Billable> billables = unmanagedBillables.stream()
                .map(billable -> billableService.getBillableById(billable.getBillableId())).toList();
        Wallet payerWallet = walletService.getWalletById(unmanagedPayerWallet.getWalletId());
        Wallet receiverWallet = walletService.getWalletById(unmanagedReceiverWallet.getWalletId());

        // if (billable == null || payerWallet == null || receiverWallet == null) {
        // throw new NullPointerException("Billable or wallet(s) are null");
        // }

        for (Billable billable : billables) {
            if (billable.getTransaction() != null) {
                System.out.println("Billable id " + billable.getBillableId() + " already has a Transaction");
                throw new BillableAlreadyHasTransactionException(
                        "Billable id " + billable.getBillableId() + " already has a Transaction");
            }
        }

        // this part is quite verbose because I'm not using the old constructor; i don't
        // want to change the old constructor cos it might break sth
        Transaction newTransaction = new Transaction();

        newTransaction.setPayerWallet(payerWallet);
        newTransaction.setReceiverWallet(receiverWallet);
        newTransaction.setTransactionStatus(TransactionStatusEnum.PENDING);
        newTransaction.setCreatedTime(LocalDateTime.now());

        TransactionDetail newTransactionDetail = new TransactionDetail();
        billables.forEach(billable -> {
            newTransactionDetail.getBillables().add(billable);
            billable.setTransactionDetail(newTransactionDetail);
        });

        newTransaction.getTransactionDetails().add(newTransactionDetail); // we can also use ryan's embedded
                                                                          // Transaction.addTransactionDetail method; it
                                                                          // combines this line and the next line
        newTransactionDetail.setTransaction(newTransaction);

        transactionRepository.save(newTransaction);
        transactionDetailRepository.save(newTransactionDetail);

        walletService.payAPendingTransaction(payerWallet, newTransaction);
        walletService.receiveAPendingTransaction(receiverWallet, newTransaction);

        return newTransaction;
    }

    /**
     * Creates a new Transaction with multiple line items.
     * The funds are deducted from the payerWallet.
     * These funds are not released from the Transaction until its status changes to
     * either COMPLETE or CANCELLED.
     *
     * @param menuItemIdsAndQuantities List of pairs where the first element is the
     *                                 menu item ID and the second is its quantity.
     * @param payerWalletId            ID of the payer's wallet.
     * @param receiverWalletId         ID of the receiver's wallet.
     * @return The created transaction.
     * @throws PayerBalanceInsufficientException
     */
    public TransactionDTO createMenuTransaction(List<Pair<Long, Integer>> menuItemIdsAndQuantities,
            Long payerWalletId, Long receiverWalletId)
            throws PayerBalanceInsufficientException {

        System.out.println("Fetching payer wallet with ID: " + payerWalletId + " and receiver wallet with ID: "
                + receiverWalletId);
        Wallet payerWallet = walletService.getWalletById(payerWalletId);
        Wallet receiverWallet = walletService.getWalletById(receiverWalletId);

        if (payerWallet == null || receiverWallet == null) {
            System.err.println("Error: One or more wallets are null.");
            throw new NullPointerException("Wallet(s) are null");
        }

        System.out.println("Fetcing student from payer wallet with ID: " + payerWalletId);

        // Retrieve student
        Student student = null;
        try {
            Long studentId = payerWallet.getGeneralUser().getUserId();
            student = studentRepository.getStudentByUserId(studentId);
        } catch (Exception e) {
            System.err.println("Error: Student not found.");
            throw new NullPointerException("Student not found");
        }

        // Create and configure the Transaction object
        System.out
                .println("Creating new transaction for payer: " + payerWalletId + " and receiver: " + receiverWalletId);
        Transaction newTransaction = new Transaction(payerWallet, receiverWallet);
        newTransaction.setTransactionStatus(TransactionStatusEnum.PENDING);

        transactionRepository.save(newTransaction);

        BigDecimal totalTransactionAmount = BigDecimal.ZERO;
        TransactionDetail transactionDetail = new TransactionDetail();

        System.out.println("Processing " + menuItemIdsAndQuantities.size() + " line items for transaction");
        int itemNumber = 1;

        for (Pair<Long, Integer> pair : menuItemIdsAndQuantities) {
            Long menuItemId = pair.getFirst();
            MenuItem menuItem = menuItemRepository.findById(menuItemId).orElse(null);
            if (menuItem == null) {
                System.err.println("Error: Menu Item with ID " + menuItemId + " not found.");
                continue;
            }

            int quantity = pair.getSecond();
            BigDecimal menuItemPrice = menuItem.getSellingPrice();
            BigDecimal menuItemPriceAfterDiscount = menuItemPrice
                    .multiply(new BigDecimal(menuItem.getVoucherMultiplier()))
                    .setScale(2, RoundingMode.HALF_UP);

            totalTransactionAmount = totalTransactionAmount
                    .add(menuItemPriceAfterDiscount.multiply(BigDecimal.valueOf(quantity)));
            // Create new menu item billable for each quantity of menu item
            for (int i = 0; i < quantity; i++) {
                MenuItemBillable menuItemBillable = new MenuItemBillable();
                menuItemBillable.setMenuItemBillableName(menuItem.getMenuItemName());
                menuItemBillable.setBillablePrice(menuItemPriceAfterDiscount.multiply(BigDecimal.valueOf(100)));
                menuItemBillable.setCostPrice(menuItem.getCostPrice().multiply(BigDecimal.valueOf(100)));
                menuItemBillable.setMenuItem(menuItem);
                menuItemBillable.setMenuItemBillableStudent(student);
                menuItemBillable.setImageURL(menuItem.getImageURL());
                menuItemBillable.setPurchaseTime(LocalDateTime.now());
                menuItemBillable.setMenuItemDescription(menuItem.getMenuItemDescription());
                menuItemBillable.setStatus("Pending");
                menuItemBillable.setBillableName(menuItem.getMenuItemName());

                // Dont need to set billable's transaction as it can be referenced via
                // TransactionDetail
                // Will cause unique PK constraint violation if set as OneToOne bidirectional
                // menuItemBillable.setTransaction(newTransaction);

                // Associate the MenuItemBillable with the TransactionDetail
                transactionDetail.getBillables().add(menuItemBillable);
                menuItemBillable.setTransactionDetail(transactionDetail);

                // Save the MenuItemBillable object
                menuItemBillableRepository.save(menuItemBillable);
            }

            System.out.println("Processing item #" + itemNumber + ": " + menuItem.getMenuItemName() + " | Quantity: "
                    + quantity + " | Price: " + menuItemPriceAfterDiscount);
            itemNumber++;
        }

        if (totalTransactionAmount.compareTo(payerWallet.getWalletBalance()) > 0) {
            System.err.println("Error: Payer wallet balance insufficient.");
            throw new PayerBalanceInsufficientException("Payer wallet balance insufficient");
        }

        // Create and configure the TransactionDetail object and associate it with
        // the Transaction
        newTransaction.addTransactionDetail(transactionDetail);

        System.out.println("Total transaction amount: " + totalTransactionAmount);

        // Save the TransactionDetail object
        transactionDetailRepository.save(transactionDetail);

        System.out.println("Processing payment from payer wallet with ID: " + payerWalletId);
        walletService.payAPendingMultipleTransaction(payerWallet, newTransaction);

        System.out.println("Processing receipt for receiver wallet with ID: " + receiverWalletId);
        walletService.receiveAPendingTransaction(receiverWallet, newTransaction);

        System.out.println(
                "Transaction successfully processed and saved. Transaction ID: " + newTransaction.getTransactionId());

        return toDTO(newTransaction);
    }

    private TransactionDTO toDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();

        dto.setTransactionId(transaction.getTransactionId());
        dto.setPayerWalletId(transaction.getPayerWallet().getWalletId());
        dto.setReceiverWalletId(transaction.getReceiverWallet().getWalletId());
        dto.setCreatedTime(transaction.getCreatedTime());
        dto.setTransactionStatus(transaction.getTransactionStatus());

        BigDecimal computedTotalPrice = BigDecimal.ZERO;
        List<TransactionDetailDTO> detailsDTO = new ArrayList<>();

        for (TransactionDetail detail : transaction.getTransactionDetails()) {
            TransactionDetailDTO detailDTO = new TransactionDetailDTO();
            detailDTO.setTransactionDetailId(detail.getTransactionDetailId());

            BigDecimal detailSubtotal = BigDecimal.ZERO;
            List<BillableDTO> billableDTOs = new ArrayList<>();
            for (Billable billable : detail.getBillables()) {
                BillableDTO billableDTO = new BillableDTO();
                billableDTO.setBillableId(billable.getBillableId());
                billableDTO.setBillableName(billable.getBillableName());
                billableDTO.setBillablePrice(billable.getBillablePrice());

                detailSubtotal = detailSubtotal.add(billableDTO.getBillablePrice());
                billableDTOs.add(billableDTO);
            }

            detailDTO.setBillables(billableDTOs);
            detailDTO.setSubtotal(detailSubtotal);
            computedTotalPrice = computedTotalPrice.add(detailSubtotal);
            detailsDTO.add(detailDTO);
        }

        dto.setTransactionDetails(detailsDTO);
        dto.setTotalPrice(computedTotalPrice);

        return dto;
    }

    /**
     * Completes a Transaction by changing its status from PENDING to COMPLETE.
     * Releases the funds specified by billablePrice to receiverWallet.
     * 
     * Transaction passed must be of PENDING status.
     * 
     * @param transaction
     * @throws TransactionNotPendingException
     */
    public void completeATransaction(Transaction transaction) throws TransactionNotPendingException {

        if (transaction.getTransactionStatus() != TransactionStatusEnum.PENDING) {
            throw new TransactionNotPendingException("Transaction id "
                    + transaction.getTransactionId() + " not pending, cannot complete transaction");
        }

        transaction.setTransactionStatus(TransactionStatusEnum.COMPLETE);

        BigDecimal moneyToRelease = getTransactionTotalPrice(transaction);
        log.info(String.valueOf(moneyToRelease));
        Wallet receiverWallet = transaction.getReceiverWallet();

        // this is managed entity so it works without having to use repo
        log.info("BEFORE");
        log.info(String.valueOf(receiverWallet.getWalletBalance()));
        receiverWallet.setWalletBalance(receiverWallet.getWalletBalance().add(moneyToRelease));
        log.info("AFTER");
        log.info(String.valueOf(receiverWallet.getWalletBalance()));

    }

    public void completeATransaction(TransactionDetail transactionDetail) throws TransactionNotPendingException {
        Transaction parentTransaction = transactionDetail.getTransaction();

        System.out.println("before: parent transaction is " + parentTransaction.getTransactionId() + parentTransaction.getTransactionStatus());
        completeATransaction(parentTransaction);
        System.out.println("after: parent transaction is " + parentTransaction.getTransactionId() + parentTransaction.getTransactionStatus());
    }
    /**
     * Cancels a Transaction by changing its status from PENDING to CANCELLED.
     * Refunds the funds specified by billablePrice back to payerWallet.
     * Transaction passed must be of PENDING status.
     * 
     * @param transaction
     * @throws TransactionNotPendingException
     */
    public void cancelATransaction(Transaction transaction) throws TransactionNotPendingException {
        if (transaction.getTransactionStatus() != TransactionStatusEnum.PENDING) {
            throw new TransactionNotPendingException("Transaction id "
                    + transaction.getTransactionId() + " not pending, cannot cancel transaction");
        }

        transaction.setTransactionStatus(TransactionStatusEnum.CANCELLED);

        BigDecimal moneyToReturn = getTransactionTotalPrice(transaction);

        Wallet payerWallet = transaction.getPayerWallet();

        payerWallet.setWalletBalance(payerWallet.getWalletBalance().add(moneyToReturn));

    }
    public void cancelATransaction(TransactionDetail transactionDetail) throws TransactionNotPendingException {
        Transaction parentTransaction = transactionDetail.getTransaction();

        System.out.println("before: parent transaction is " + parentTransaction.getTransactionId() + parentTransaction.getTransactionStatus());
        cancelATransaction(parentTransaction);
        System.out.println("after: parent transaction is " + parentTransaction.getTransactionId() + parentTransaction.getTransactionStatus());
    }

    private Specification<Transaction> matchUser(GeneralUser user) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.or(
                    criteriaBuilder.equal(root.get(PAYER_WALLET).get(WALLET_ID), user.getWallet().getWalletId()),
                    criteriaBuilder.equal(root.get(RECEIVER_WALLET).get(WALLET_ID), user.getWallet().getWalletId()));
        };
    }

    public List<Transaction> getAllTransactionsForOwner() {
        return userContext.obtainOwnerIdentity()
                .map(owner -> transactionRepository.findAll(matchUser(owner)))
                .orElse(List.of());
    }

    public List<Transaction> getAllTransactionsForAdmin() {
        return userContext.obtainAdminIdentity()
                .map(admin -> transactionRepository.findAll(matchUser(admin)))
                .orElse(List.of());
    }

    public List<Transaction> getAllTransactionForStudent() {
        return userContext.obtainStudentIdentity()
                .map(student -> transactionRepository.findAll(matchUser(student)))
                .orElse(List.of());
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public static BigDecimal getTransactionTotalPrice(Transaction transaction) {
        BigDecimal totalPrice = BigDecimal.ZERO;

        if (transaction.getBillable() != null) {
            return transaction.getBillable().getBillablePrice();
        } else {
            for (TransactionDetail transactionDetail : transaction.getTransactionDetails()) {
                for (Billable billable : transactionDetail.getBillables()) {
                    totalPrice = totalPrice.add(billable.getBillablePrice());
                }
            }
        }
        return totalPrice;
    }

    public void withdrawBalance(Wallet walletToWithdraw, BigDecimal amount) {
        try {
            withdrawTransactionRecord(generateWithdrawal(amount), walletToWithdraw);
        } catch (Exception e) {
            System.out.println("UNEXPECTED EXCEPTION");
            e.printStackTrace();
        }
    }

    private Withdrawal generateWithdrawal(BigDecimal amount) {
        Withdrawal withdrawal = new Withdrawal();
        withdrawal.setBillablePrice(amount);
        withdrawal.setBillableName("Withdrawal");
        billableRepository.saveAndFlush(withdrawal);
        return withdrawal;
    }

    public Optional<BigDecimal> getWalletBalance() {
        return userContext.obtainRequesterIdentity(username -> adminRepository.getAdminByUsername(username))
                .flatMap(admin -> walletRepository.findWalletByGeneralUser_Username(admin.getUsername())
                        .map(wallet -> wallet.getWalletBalance()));
    }
}
