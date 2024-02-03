package com.sgw.backend.service;

import com.sgw.backend.config.AuthenticationRequest;
import com.sgw.backend.config.AuthenticationResponse;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.GeneralUserRepository;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.StudentRepository;
import com.sgw.backend.utilities.UserContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.channels.FileChannel;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
@AllArgsConstructor
public class JwtService {

    // Extract to ENV
    private static final String SECRET_KEY = "d532c25a5723d669faa66734054fcbb14b5f8c02333d5dfda05f17bb77ff0af6";

    private final UserContext userContext;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OwnerRepository ownerRepository;

    // Extract username from JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract particular field from JWT body payload
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claim = extractAllClaims(token);
        return claimsResolver.apply(claim);
    }

    // Get SecretKey
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate a JWT for issuing
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails) {
        System.out.println("GENERATING TOKEN!");
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 60000 * 60 * 24)) // 1 minute * 60 minutes * 24
                                                                                       // hours = 1 day
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // comment
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Extract the body payload from JWT
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Check if JWT is expired
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date field from JWT payload
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Check if the JWT is valid
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public Optional<AuthenticationResponse> refreshOwnerJWT() {
        HashMap<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "Owner");
        return refreshGeneralJWT((username) -> ownerRepository.getOwnerByUsername(username), extraClaims);
    }

    public Optional<AuthenticationResponse> refreshStudentJWT() {
        HashMap<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "Student");
        return refreshGeneralJWT((username) -> studentRepository.getStudentByUsername(username), extraClaims);
    }

    public Optional<AuthenticationResponse> refreshAdminJWT() {
        HashMap<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", "Admin");
        return refreshGeneralJWT((username) -> adminRepository.getAdminByUsername(username), extraClaims);
    }

    private Optional<AuthenticationResponse> refreshGeneralJWT(Function<String, ? extends UserDetails> searchFunction,
            HashMap<String, Object> extraClaims) {
        return userContext.obtainRequesterIdentity(searchFunction)
                .map(user -> AuthenticationResponse.builder().token(generateToken(extraClaims, user)).build());
    }
}
