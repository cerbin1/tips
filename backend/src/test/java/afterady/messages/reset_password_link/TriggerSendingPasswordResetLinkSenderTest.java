package afterady.messages.reset_password_link;

import afterady.messages.LinkMessage;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.context.SpringBootTest;

import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;
import static afterady.messages.LinksSendingMQConfiguration.PASSWORD_RESET_LINKS_ROUTING_KEY;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest
public class TriggerSendingPasswordResetLinkSenderTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private TriggerSendingPasswordResetLinkSender sender;

    @Test
    public void shouldSendMessage() {
        // arrange
        LinkMessage message = new LinkMessage("email", "linkId");

        // act
        sender.send(message);

        // assert
        verify(rabbitTemplate).convertAndSend(eq(LINKS_EXCHANGE), eq(PASSWORD_RESET_LINKS_ROUTING_KEY), eq(message));
    }
}
