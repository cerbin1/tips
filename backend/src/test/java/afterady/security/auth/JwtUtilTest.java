package afterady.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest mockedRequest;

    @BeforeEach
    public void init() {
        jwtUtil = new JwtUtil();
    }

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