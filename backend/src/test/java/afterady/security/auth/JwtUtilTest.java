package afterady.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@SpringBootTest
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;


    @Test
    public void shouldNotParseTokenWhenAuthHeaderIsMissing() {
        // arrange
        HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
        when(mockedRequest.getHeader("Authorization")).thenReturn(null);

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isEmpty());
    }

    @Test
    public void shouldNotParseTokenWhenAuthHeaderDoesNotStartWithBearer() {
        // arrange
        HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
        when(mockedRequest.getHeader("Authorization")).thenReturn("token 12345");

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isEmpty());
    }

    @Test
    public void shouldParseJwtToken() {
        // arrange
        HttpServletRequest mockedRequest = Mockito.mock(HttpServletRequest.class);
        when(mockedRequest.getHeader("Authorization")).thenReturn("Bearer iKBIGBomyDoiFfOobySPWQsC7za0QKoEHaf15WVBP9rqt6SIQrETBXvkjpFaw2Bs");

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isPresent());
        assertEquals("iKBIGBomyDoiFfOobySPWQsC7za0QKoEHaf15WVBP9rqt6SIQrETBXvkjpFaw2Bs", token.get());
    }
}