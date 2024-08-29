package afterady.messages.activation_link;

import afterady.messages.LinkMessage;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.context.SpringBootTest;

import static afterady.messages.LinksSendingMQConfiguration.ACTIVATION_LINKS_ROUTING_KEY;
import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;
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
        LinkMessage message = new LinkMessage("email", "linkId");

        // act
        sender.send(message);

        // assert
        verify(rabbitTemplate).convertAndSend(eq(LINKS_EXCHANGE), eq(ACTIVATION_LINKS_ROUTING_KEY), eq(message));
    }
}
