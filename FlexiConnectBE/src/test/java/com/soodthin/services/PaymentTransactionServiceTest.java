package com.soodthin.services;

import com.soodthin.dto.response.MomoPaymentResponse;
import com.soodthin.entity.Package;
import com.soodthin.entity.PaymentTransaction;
import com.soodthin.entity.PaymentTransaction.TransactionStatus;
import com.soodthin.entity.User;
import com.soodthin.entity.UserPackage;
import com.soodthin.repositories.PaymentTransactionRepository;
import com.soodthin.repositories.UserPackageRepository;
import com.soodthin.services.impl.PaymentTransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentTransactionServiceTest {

    @Mock
    private PaymentTransactionRepository transactionRepository;

    @Mock
    private MomoPaymentService momoPaymentService;

    @Mock
    private UserPackageRepository userPackageRepository;

    @InjectMocks
    private PaymentTransactionServiceImpl paymentService;

    private User user;
    private Package premiumPackage;
    private PaymentTransaction transaction;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setEmail("buyer@gmail.com");

        premiumPackage = new Package();
        premiumPackage.setId(10);
        premiumPackage.setName("VIP Employer");
        premiumPackage.setPrice(BigDecimal.valueOf(500000));
        premiumPackage.setDurationDays(30);

        transaction = new PaymentTransaction();
        transaction.setId(100);
        transaction.setUserId(user);
        transaction.setPackageId(premiumPackage);
        transaction.setTransactionCode("ORDER_123");
        transaction.setAmount(BigDecimal.valueOf(500000));
        transaction.setStatus(TransactionStatus.PENDING);

        org.springframework.test.util.ReflectionTestUtils.setField(paymentService, "userPackageRepository", userPackageRepository);
    }

    @Test
    void createPremiumPayment_Success() throws Exception {
        MomoPaymentResponse mockResponse = new MomoPaymentResponse();
        mockResponse.setPayUrl("https://payment.momo.vn/pay");

        when(momoPaymentService.createPayment(anyString(), anyLong(), anyString(), anyString()))
                .thenReturn(mockResponse);

        MomoPaymentResponse response = paymentService.createPremiumPayment(
                user, premiumPackage, 500000L, "http://success", "http://fail");

        assertNotNull(response);
        assertEquals("https://payment.momo.vn/pay", response.getPayUrl());
        verify(transactionRepository).save(any(PaymentTransaction.class));
    }

    @Test
    void updateTransactionStatus_NotFound_ThrowsRuntimeException() {
        when(transactionRepository.findByTransactionCode("UNKNOWN")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> paymentService.updateTransactionStatus("UNKNOWN", TransactionStatus.SUCCESS, "MOMO_999"));
    }

    @Test
    void updateTransactionStatus_Success() {
        when(transactionRepository.findByTransactionCode("ORDER_123")).thenReturn(Optional.of(transaction));

        paymentService.updateTransactionStatus("ORDER_123", TransactionStatus.SUCCESS, "MOMO_999");

        assertEquals(TransactionStatus.SUCCESS, transaction.getStatus());
        assertEquals("MOMO_999", transaction.getMomoTransId());
        verify(transactionRepository).save(transaction);
    }

    @Test
    void handleMomoCallback_TransactionNotFound_ThrowsRuntimeException() {
        when(transactionRepository.findByTransactionCode("UNKNOWN")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> paymentService.handleMomoCallback("UNKNOWN", 0, "MOMO_999"));
    }

    @Test
    void handleMomoCallback_SuccessResult_CreatesUserPackage() {
        when(transactionRepository.findByTransactionCode("ORDER_123")).thenReturn(Optional.of(transaction));
        when(userPackageRepository.findTopByUserIdOrderByEndDateDesc(user)).thenReturn(Optional.empty());

        boolean result = paymentService.handleMomoCallback("ORDER_123", 0, "MOMO_999");

        assertTrue(result);
        assertEquals(TransactionStatus.SUCCESS, transaction.getStatus());
        assertEquals("MOMO_999", transaction.getMomoTransId());
        verify(transactionRepository).save(transaction);
        verify(userPackageRepository).save(any(UserPackage.class));
    }

    @Test
    void handleMomoCallback_FailedResult_MarksTransactionFailed() {
        when(transactionRepository.findByTransactionCode("ORDER_123")).thenReturn(Optional.of(transaction));

        boolean result = paymentService.handleMomoCallback("ORDER_123", 1, "MOMO_999");

        assertFalse(result);
        assertEquals(TransactionStatus.FAILED, transaction.getStatus());
        verify(transactionRepository).save(transaction);
        verify(userPackageRepository, never()).save(any(UserPackage.class));
    }

    @Test
    void handleMomoCallback_DowngradeNotAllowed_ThrowsIllegalStateException() {
        Package higherPackage = new Package();
        higherPackage.setId(11);
        higherPackage.setPrice(BigDecimal.valueOf(800000));

        UserPackage currentPkg = new UserPackage();
        currentPkg.setPackageId(higherPackage);
        currentPkg.setIsActive(true);
        currentPkg.setEndDate(LocalDate.now().plusDays(15));

        when(transactionRepository.findByTransactionCode("ORDER_123")).thenReturn(Optional.of(transaction));
        when(userPackageRepository.findTopByUserIdOrderByEndDateDesc(user)).thenReturn(Optional.of(currentPkg));

        assertThrows(IllegalStateException.class,
                () -> paymentService.handleMomoCallback("ORDER_123", 0, "MOMO_999"));
    }
}
