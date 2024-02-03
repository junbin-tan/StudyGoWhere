package com.sgw.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sgw.backend.entity_booking.Booking;

@Component
public class SchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private BookingService bookingService;

    // runs every 60 seconds * X minutes
    @Scheduled(fixedRate = 60000 * 1)
    public void expireVouchers() {
        logger.info("Scheduled task 'expireVouchers' started");
        try {
            voucherService.expireVouchersBasedOnExpiryDate();
            voucherService.expireActivatedVouchers();
            logger.info("Scheduled task 'expireVouchers' completed successfully");
        } catch (Exception e) {
            logger.error("An error occurred during execution of 'expireVouchers': ", e);
        }
    }

    @Scheduled(fixedRate = 60000 * 15)
    public void cancelBookings() {
        logger.info("Scheduled task 'cancelBookings' started");
        try {
            bookingService.cancelAllPastBookings();
            logger.info("Scheduled task 'cancelBookings' completed successfully");
        } catch (Exception e) {
            logger.error("An error occurred during execution of 'cancelBookings': ", e);
        }
    }
}