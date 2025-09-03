/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.response.MomoPaymentResponse;
import com.soodthin.entity.PaymentTransaction;
import com.soodthin.repositories.PaymentTransactionRepository;
import com.soodthin.services.MomoPaymentService;
import com.soodthin.services.PaymentTransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.soodthin.entity.Package;
import com.soodthin.entity.PaymentTransaction.TransactionStatus;
import com.soodthin.entity.User;
import com.soodthin.entity.UserPackage;
import com.soodthin.repositories.UserPackageRepository;
import java.math.BigDecimal;
import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author ADMIN
 */
@Slf4j
@Service
@Transactional
public class PaymentTransactionServiceImpl implements PaymentTransactionService {

    @Autowired
    private PaymentTransactionRepository transactionRepository;
    @Autowired
    private MomoPaymentService momoPaymentService;
    @Autowired
    private UserPackageRepository userPackageRepository;

    public PaymentTransactionServiceImpl(PaymentTransactionRepository transactionRepository,
            MomoPaymentService momoPaymentService) {
        this.transactionRepository = transactionRepository;
        this.momoPaymentService = momoPaymentService;
    }

    @Override
    public MomoPaymentResponse createPremiumPayment(User user, Package pkg, long amount,
            String returnUrlSuccess, String returnUrlFail) throws Exception {
        String orderId = UUID.randomUUID().toString();

        log.info("🔄 Bắt đầu tạo giao dịch MoMo cho userId={}, packageId={}, amount={}",
                user.getId(), pkg.getId(), amount);

        PaymentTransaction tx = new PaymentTransaction();
        tx.setUserId(user);
        tx.setPackageId(pkg);
        tx.setTransactionCode(orderId);
        tx.setAmount(BigDecimal.valueOf(amount));
        tx.setStatus(PaymentTransaction.TransactionStatus.PENDING);
        tx.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(tx);
        log.info("💾 Transaction PENDING đã lưu vào DB với orderId={}", orderId);

        // Gọi MomoPaymentService kèm returnUrl/failUrl
        MomoPaymentResponse response = momoPaymentService.createPayment(orderId, amount, returnUrlSuccess, returnUrlFail);
        log.info("✅ Nhận được payUrl từ MoMo: {}", response.getPayUrl());

        return response;
    }

    @Override
    public void updateTransactionStatus(String orderId, PaymentTransaction.TransactionStatus status, String momoTransId) {
        Optional<PaymentTransaction> optionalTx = transactionRepository.findByTransactionCode(orderId);
        if (optionalTx.isEmpty()) {
            throw new RuntimeException("Transaction not found with orderId: " + orderId);
        }

        PaymentTransaction tx = optionalTx.get();
        tx.setStatus(status);
        tx.setMomoTransId(momoTransId);
        tx.setUpdatedAt(LocalDateTime.now());

        transactionRepository.save(tx);
    }

    @Override
    public boolean handleMomoCallback(String orderId, Integer resultCode, String transId) {
        Optional<PaymentTransaction> optionalTx = transactionRepository.findByTransactionCode(orderId);
        if (optionalTx.isEmpty()) {
            throw new RuntimeException("Transaction not found with orderId: " + orderId);
        }

        PaymentTransaction tx = optionalTx.get();

        if (resultCode == 0) {
            tx.setStatus(PaymentTransaction.TransactionStatus.SUCCESS);
            tx.setMomoTransId(transId);
            tx.setUpdatedAt(LocalDateTime.now());
            transactionRepository.save(tx);

            Package pkg = tx.getPackageId();
            if (pkg == null) {
                log.error("❌ Không tìm thấy Package liên kết với transactionId={}", tx.getId());
                throw new IllegalStateException("Associated package not found for transaction: " + orderId);
            }

            Optional<UserPackage> optionalUserPkg = userPackageRepository
                    .findTopByUserIdOrderByEndDateDesc(tx.getUserId());

            if (optionalUserPkg.isPresent()) {
                UserPackage currentPkg = optionalUserPkg.get();
                LocalDate today = LocalDate.now();

                if (currentPkg.getIsActive() && !currentPkg.getEndDate().isBefore(today)) {
                    if (pkg.getPrice().compareTo(currentPkg.getPackageId().getPrice()) <= 0) {
                        log.warn("⚠️ User={} đang có gói active chưa hết hạn hoặc không được nâng cấp xuống/lên gói thấp hơn",
                                tx.getUserId().getId());
                        throw new IllegalStateException("Bạn chưa thể nâng cấp gói này. Chỉ được nâng cấp gói cao hơn khi gói cũ còn active.");
                    }
                }
            }

            UserPackage userPkg = new UserPackage();
            userPkg.setUserId(tx.getUserId());
            userPkg.setPackageId(pkg);
            userPkg.setTransactionId(tx);
            userPkg.setStartDate(LocalDate.now());
            userPkg.setEndDate(LocalDate.now().plusDays(pkg.getDurationDays()));
            userPkg.setIsActive(true);

            userPackageRepository.save(userPkg);
            log.info("✅ Tạo UserPackage cho user={} package={}", tx.getUserId().getId(), pkg.getId());

            return true;
        } else {
            tx.setStatus(PaymentTransaction.TransactionStatus.FAILED);
            tx.setUpdatedAt(LocalDateTime.now());
            transactionRepository.save(tx);

            return false;
        }
    }

}
