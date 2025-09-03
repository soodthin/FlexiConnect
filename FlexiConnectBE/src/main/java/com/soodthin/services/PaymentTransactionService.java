/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.response.MomoPaymentResponse;
import com.soodthin.entity.PaymentTransaction.TransactionStatus;
import com.soodthin.entity.User;
import com.soodthin.entity.Package;
/**
 *
 * @author ADMIN
 */
public interface PaymentTransactionService {

    MomoPaymentResponse createPremiumPayment(User user,Package pkg, long amount,
            String returnUrlSuccess, String returnUrlFail) throws Exception;

    void updateTransactionStatus(String orderId, TransactionStatus status, String momoTransId);

    boolean handleMomoCallback(String orderId, Integer resultCode, String transId);

}
