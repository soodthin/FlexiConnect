/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.utils;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jwt.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 *
 * @author ADMIN
 */
@Component
public class JwtUtils {

    private static final String DEFAULT_SECRET = "12345678901234567890123456789012"; // tối thiểu 32 ký tự
    private static String secret;
    private static final long EXPIRATION_MS = 86400000; // 1 ngày

    static {
        String envSecret = System.getenv().getOrDefault("JWT_SECRET", DEFAULT_SECRET);
        secret = (envSecret != null && envSecret.trim().length() >= 32) ? envSecret.trim() : DEFAULT_SECRET;
    }

    @Value("${JWT_SECRET:12345678901234567890123456789012}")
    public void setSecret(String jwtSecret) {
        if (jwtSecret != null && jwtSecret.trim().length() >= 32) {
            JwtUtils.secret = jwtSecret.trim();
        }
    }

    public static String generateToken(String username, String role) throws Exception {
        JWSSigner signer = new MACSigner(secret);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(username)
            .claim("role", "ROLE_" + role.toUpperCase())
            .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS))
            .issueTime(new Date())
            .build();

        SignedJWT signedJWT = new SignedJWT(
            new JWSHeader(JWSAlgorithm.HS256),
            claimsSet
        );

        signedJWT.sign(signer);
        return signedJWT.serialize();
    }

    public static String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(secret);

        if (signedJWT.verify(verifier)) {
            Date expiration = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiration.after(new Date())) {
                return signedJWT.getJWTClaimsSet().getSubject();
            }
        }
        return null;
    }

    public static String getRoleFromToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet().getStringClaim("role");
    }
}
