package afterady.security.auth;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtUtil {
    private static final Integer $24h = 86400000;

    @Value("${task.manager.jwtSecret}")
    private String jwtSecret;

    public Optional<String> parseTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return Optional.of(headerAuth.substring(7));
        }
        return Optional.empty();
    }

    public Optional<String> extractEmailFromToken(String token) {
        return Optional.of(extractAllClaims(token).getSubject());
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public boolean validateToken(String token) {
        Jwts.parserBuilder().setSigningKey(key()).build().parse(token);
        return true;
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject((email))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + $24h))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
}
