package com.soodthin.controllers;

import com.soodthin.dto.response.MomoPaymentResponse;
import com.soodthin.entity.User;
import com.soodthin.entity.Package;
import com.soodthin.repositories.UserRepository;
import com.soodthin.repositories.PackageRepository;
import com.soodthin.services.PaymentTransactionService;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

@Slf4j
@RestController
@RequestMapping("/api/momo")
public class MomoPaymentController {

    @Autowired
    private PaymentTransactionService paymentTransactionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PackageRepository packageRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

   
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestParam long amount,
            @RequestParam Integer packageId,
            Authentication auth) {
        try {
            User user = getCurrentUser(auth);
            Package pkg = packageRepository.findById(packageId)
                    .orElseThrow(() -> new RuntimeException("Package not found"));

//            String returnUrlSuccess = "http://localhost:3000/payment-success";
//            String returnUrlFail = "http://localhost:3000/payment-failed";
            // URL frontend để MoMo redirect sau khi thanh toán
            String returnUrlSuccess = "https://flexiconnectweb.onrender.com/payment-success";
            String returnUrlFail = "https://flexiconnectweb.onrender.com/payment-failed";

            // Gọi service tạo payment, truyền returnUrl/failUrl
            MomoPaymentResponse payUrl = paymentTransactionService.createPremiumPayment(
                    user, pkg, amount, returnUrlSuccess, returnUrlFail
            );

            return ResponseEntity.ok(Map.of("payUrl", payUrl));
        } catch (Exception e) {
            log.error("❌ Lỗi tạo payment", e);
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    
    @GetMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestParam Map<String, String> params) {
        try {
            String orderId = params.get("orderId");
            int resultCode = Integer.parseInt(params.get("resultCode"));
            String transId = params.get("transId"); // nếu MoMo gửi

            // Gọi service xử lý logic thanh toán (success/fail, tạo UserPackage…)
            boolean success = paymentTransactionService.handleMomoCallback(orderId, resultCode, transId);

            // Redirect user sang trang frontend dựa trên kết quả
            String redirectUrl = success
                    ? "http://localhost:3000/payment-success"
                    : "http://localhost:3000/payment-failed";

            return ResponseEntity.status(302) // HTTP redirect
                    .header("Location", redirectUrl)
                    .build();
        } catch (Exception e) {
            log.error("❌ Lỗi confirm callback", e);
            return ResponseEntity.status(302)
                    .header("Location", "http://localhost:3000/payment-failed")
                    .build();
        }
    }

    
    @PostMapping("/callback")
    public ResponseEntity<String> notifyPayment(@RequestBody Map<String, Object> body) {
        try {
            String orderId = body.get("orderId").toString();
            int resultCode = Integer.parseInt(body.get("resultCode").toString());
            String transId = body.get("transId") != null ? body.get("transId").toString() : null;

            // Xử lý logic thanh toán (success/fail, tạo UserPackage…)
            paymentTransactionService.handleMomoCallback(orderId, resultCode, transId);

            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("❌ Lỗi IPN callback", e);
            return ResponseEntity.status(500).body("error");
        }
    }
}
