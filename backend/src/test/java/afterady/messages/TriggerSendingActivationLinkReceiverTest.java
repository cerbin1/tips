package afterady.messages;

import afterady.service.email.EmailSendingService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import static org.mockito.Mockito.*;

@SpringBootTest
public class TriggerSendingActivationLinkReceiverTest {

    @Mock
    private EmailSendingService emailSendingService;

    @InjectMocks
    private TriggerSendingActivationLinkReceiver receiver;

    @Test
    public void shouldReceiveMessage() {
        // arrange
        when(emailSendingService.sendEmail(eq("email"), eq("Afterady - activation link"), eq("auth/activate/linkId")))
                .thenReturn(true);
        Message message = new Message("email", "linkId");

        // act
        receiver.receive(message);

        // assert
        verify(emailSendingService, times(1))
                .sendEmail("email", "Afterady - activation link", "auth/activate/linkId");
    }
}