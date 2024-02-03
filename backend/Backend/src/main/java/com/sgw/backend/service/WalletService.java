package com.sgw.backend.service;

import com.sgw.backend.entity.*;
import com.sgw.backend.exception.PayerBalanceInsufficientException;
import com.sgw.backend.repository.WalletRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;

    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    public Wallet getWalletById(Long id) {
        return walletRepository.getReferenceById(id);
    }

    // note that this addGeneralUser can add Admins, Students, etc.
    public void addNewWalletToUser(GeneralUser generalUser) {
        Wallet newWallet = new Wallet(); // wallet balance is set to 0 in constructor

        newWallet.setGeneralUser(generalUser);
        generalUser.setWallet(newWallet);
        walletRepository.save(newWallet);
    }

    public void addNewUnlimitedWalletToAdmin(Admin admin) {
        AdminWallet adminWallet = new AdminWallet();
        adminWallet.setGeneralUser(admin);
        admin.setWallet(adminWallet);
        walletRepository.save(adminWallet);
    }

    /*
     * Old implementation for single item transaction
     */
    public void payAPendingTransaction(Wallet payerWallet, Transaction transaction)
            throws PayerBalanceInsufficientException {
        BigDecimal billPrice = TransactionService.getTransactionTotalPrice(transaction);
        BigDecimal payerBalance = payerWallet.getWalletBalance();

        if (payerBalance.compareTo(billPrice) < 0) {
            throw new PayerBalanceInsufficientException(
                    "Payer wallet " + payerWallet.getWalletId() + " doesn't have enough credits!");
        }

        payerWallet.setWalletBalance(payerBalance.subtract(billPrice));
        payerWallet.getOutgoingTransactions().add(transaction);

    }

    /*
     * Old implementation for single item transaction
     */
    public void receiveAPendingTransaction(Wallet receiverWallet, Transaction transaction) {
        receiverWallet.getIncomingTransactions().add(transaction);
    }

    // might need to make it generate a billable & transaction on withdrawal

    /*
     * New implementation for multiple item transaction
     */
    public void payAPendingMultipleTransaction(Wallet payerWallet, Transaction transaction)
            throws PayerBalanceInsufficientException {
        BigDecimal billPrice = BigDecimal.ZERO;

        for (TransactionDetail detail : transaction.getTransactionDetails()) {
            for (Billable billable : detail.getBillables()) {
                BigDecimal billablePrice = billable.getBillablePrice();
                billPrice = billPrice.add(billablePrice).setScale(2, RoundingMode.HALF_UP);
            }
        }

        BigDecimal payerBalance = payerWallet.getWalletBalance();

        if (payerBalance.compareTo(billPrice) < 0) {
            throw new PayerBalanceInsufficientException(
                    "Payer wallet " + payerWallet.getWalletId() + " doesn't have enough credits!");
        }

        payerWallet.setWalletBalance(payerBalance.subtract(billPrice));
        payerWallet.getOutgoingTransactions().add(transaction);
    }

}
