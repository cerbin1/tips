package afterady.service;

import afterady.config.EnvironmentWrapper;
import afterady.service.email.EmailSendingService;
import afterady.service.email.Sender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static afterady.config.EnvironmentWrapper.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailSendingServiceTest {

    private EmailSendingService emailSendingService;

    @Mock
    private Sender sender;

    @Mock
    private EnvironmentWrapper environment;

    @BeforeEach
    void init() {
        emailSendingService = new EmailSendingService(sender, environment);
    }

    @Test
    public void shouldSendEmail() {
        // arrange
        when(environment.getEnv(AFTERADY_MAIL_SENDER)).thenReturn("email");
        when(environment.getEnv(AFTERADY_MAIL_PWD)).thenReturn("password");
        when(sender.send("email", "password", "to", "subject", "content")).thenReturn(true);

        // act
        boolean emailSent = emailSendingService.sendEmail("to", "subject", "content");

        // assert
        assertTrue(emailSent);
        verify(sender, times(1)).send("email", "password", "to", "subject", "content");
        verifyNoMoreInteractions(sender);
        verify(environment, times(1)).getEnv(AFTERADY_MAIL_SENDER);
        verify(environment, times(1)).getEnv(AFTERADY_MAIL_PWD);
//        verify(environment, times(1)).getEnv(AFTERADY_MAIL_HOST);
        Mockito.verifyNoMoreInteractions(environment);
    }
}
