package afterady.messages;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.context.SpringBootTest;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class TriggerSendingActivationLinkSenderTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private TriggerSendingActivationLinkSender sender;

    @Test
    public void shouldSendMessage() {
        // arrange
        Message message = new Message("email", "linkId");

        // act
        sender.send(message);

        // assert
        verify(rabbitTemplate).convertAndSend(eq("activation-links-exchange"), eq("links"), eq(message));
    }
}
