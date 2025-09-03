package com.soodthin.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.soodthin.configs.momo.Environment;
import com.soodthin.configs.momo.MoMoEndpoint;
import com.soodthin.configs.momo.PartnerInfo;
import com.soodthin.dto.request.MomoPaymentRequest;
import com.soodthin.dto.response.MomoPaymentResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class MomoPaymentService {

    @Autowired
    private Environment momoEnv;

    @Autowired
    private ObjectMapper mapper;

    private final String ipnUrl;

    @Autowired
    public MomoPaymentService(Environment momoEnv) {
        this.momoEnv = momoEnv;
        this.ipnUrl = momoEnv.getIpnUrl();
    }

    public MomoPaymentResponse createPayment(String orderId, long amount, String returnUrl, String failUrl) throws Exception {
        PartnerInfo partner = momoEnv.getPartnerInfo();
        MoMoEndpoint endpoint = momoEnv.getMomoEndpoint();

        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán Premium";
        String extraData = "";

        // Tạo rawSignature theo yêu cầu MoMo
        String rawSignature = "accessKey=" + partner.getAccessKey()
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + partner.getPartnerCode()
                + "&redirectUrl=" + returnUrl // MoMo redirect thành công
                + "&requestId=" + requestId
                + "&requestType=captureWallet";

        String signature = hmacSHA256(rawSignature, partner.getSecretKey());

        MomoPaymentRequest request = new MomoPaymentRequest();
        request.setPartnerCode(partner.getPartnerCode());
        request.setPartnerName("FlexiConnect");
        request.setStoreId("MomoTestStore");
        request.setRequestId(requestId);
        request.setAmount(amount);
        request.setOrderId(orderId);
        request.setOrderInfo(orderInfo);
        request.setRedirectUrl(returnUrl); // redirect thành công
        request.setIpnUrl(ipnUrl);
        request.setLang("vi");
        request.setExtraData(extraData);
        request.setRequestType("captureWallet");
        request.setSignature(signature);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.postForObject(endpoint.getCreateUrl(), request, String.class);

        MomoPaymentResponse momoResponse = mapper.readValue(response, MomoPaymentResponse.class);

        momoResponse.setReturnUrl(returnUrl);
        momoResponse.setFailUrl(failUrl);

        return momoResponse;
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKeySpec);
        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
