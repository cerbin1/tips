package afterady.service;

import afterady.config.EnvironmentWrapper;
import afterady.service.email.EmailSendingService;
import afterady.service.email.Sender;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static afterady.config.EnvironmentWrapper.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EmailSendingServiceTest {

    @Autowired
    private EmailSendingService emailSendingService;

    @MockBean
    private Sender sender;

    @MockBean
    private EnvironmentWrapper environment;

    @Test
    public void shouldSendEmail() {
        // given
        when(environment.getEnv(AFTERADY_MAIL_SENDER)).thenReturn("email");
        when(environment.getEnv(AFTERADY_MAIL_PWD)).thenReturn("password");
        when(environment.getEnv(AFTERADY_MAIL_HOST)).thenReturn("host");
        when(sender.send("email", "password", "to", "subject", "content")).thenReturn(true);

        // when
        boolean emailSent = emailSendingService.sendEmail("to", "subject", "content");

        // then
        assertTrue(emailSent);
    }
}
