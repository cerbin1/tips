package afterady.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@SpringBootTest
class JwtUtilTest {
    @MockBean
    private HttpServletRequest mockedRequest;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    public void shouldNotParseTokenWhenAuthHeaderIsMissing() {
        // arrange
        when(mockedRequest.getHeader("Authorization")).thenReturn(null);

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isEmpty());
        verifyGetAuthorizationHeaderFromRequest();
    }

    @Test
    public void shouldNotParseTokenWhenAuthHeaderDoesNotStartWithBearer() {
        // arrange
        when(mockedRequest.getHeader("Authorization")).thenReturn("token 12345");

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isEmpty());
        verifyGetAuthorizationHeaderFromRequest();
    }

    @Test
    public void shouldParseJwtToken() {
        // arrange
        when(mockedRequest.getHeader("Authorization")).thenReturn("Bearer iKBIGBomyDoiFfOobySPWQsC7za0QKoEHaf15WVBP9rqt6SIQrETBXvkjpFaw2Bs");

        // act
        Optional<String> token = jwtUtil.parseTokenFromRequest(mockedRequest);

        // assert
        assertTrue(token.isPresent());
        assertEquals("iKBIGBomyDoiFfOobySPWQsC7za0QKoEHaf15WVBP9rqt6SIQrETBXvkjpFaw2Bs", token.get());
        verifyGetAuthorizationHeaderFromRequest();
    }

    private void verifyGetAuthorizationHeaderFromRequest() {
        verify(mockedRequest, times(1)).getHeader("Authorization");
        verifyNoMoreInteractions(mockedRequest);
    }
}