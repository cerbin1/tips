package afterady.messages.reset_password_link;

import afterady.config.EnvironmentWrapper;
import afterady.messages.LinkMessage;
import afterady.service.email.EmailSendingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static afterady.config.EnvironmentWrapper.AFTERADY_FRONT_URL;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TriggerSendingPasswordResetLinkReceiverTest {

    private TriggerSendingPasswordResetLinkReceiver receiver;

    @Mock
    private EmailSendingService emailSendingService;
    @Mock
    private EnvironmentWrapper environment;

    @BeforeEach
    void init() {
        receiver = new TriggerSendingPasswordResetLinkReceiver(emailSendingService, environment);
    }

    @Test
    public void shouldReceiveMessage() {
        // arrange
        when(emailSendingService.sendEmail("email", "Afterady - password reset link", "http://localhost:8080/user/password-change/linkId"))
                .thenReturn(true);
        when(environment.getEnv(AFTERADY_FRONT_URL)).thenReturn("http://localhost:8080/");
        LinkMessage message = new LinkMessage("email", "linkId");

        // act
        receiver.receive(message);

        // assert
        verify(emailSendingService, times(1))
                .sendEmail("email", "Afterady - password reset link", "http://localhost:8080/user/password-change/linkId");
        verify(environment, times(1)).getEnv(AFTERADY_FRONT_URL);
        verifyNoMoreInteractions(emailSendingService, environment);
    }
}
