package afterady.messages.activation_link;

import afterady.config.EnvironmentWrapper;
import afterady.messages.LinkMessage;
import afterady.service.email.EmailSendingService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import static afterady.config.EnvironmentWrapper.AFTERADY_FRONT_URL;
import static org.mockito.Mockito.*;

@SpringBootTest
public class TriggerSendingActivationLinkReceiverTest {

    @Mock
    private EmailSendingService emailSendingService;
    @Mock
    private EnvironmentWrapper environment;

    @InjectMocks
    private TriggerSendingActivationLinkReceiver receiver;

    @Test
    public void shouldReceiveMessage() {
        // arrange
        when(emailSendingService.sendEmail(eq("email"), eq("Afterady - activation link"), eq("auth/activate/linkId")))
                .thenReturn(true);
        when(environment.getEnv(AFTERADY_FRONT_URL)).thenReturn("http://localhost:8080/");
        LinkMessage message = new LinkMessage("email", "linkId");

        // act
        receiver.receive(message);

        // assert
        verify(emailSendingService, times(1))
                .sendEmail("email", "Afterady - activation link", "http://localhost:8080/user/activate/linkId");
    }
}