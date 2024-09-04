package afterady.messages.reset_password_link;

import afterady.messages.LinkMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;
import static afterady.messages.LinksSendingMQConfiguration.PASSWORD_RESET_LINKS_ROUTING_KEY;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
public class TriggerSendingPasswordResetLinkSenderTest {

    private TriggerSendingPasswordResetLinkSender sender;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @BeforeEach
    void init() {
        sender = new TriggerSendingPasswordResetLinkSender(rabbitTemplate);
    }

    @Test
    public void shouldSendMessage() {
        // arrange
        LinkMessage message = new LinkMessage("email", "linkId");

        // act
        sender.send(message);

        // assert
        verify(rabbitTemplate).convertAndSend(eq(LINKS_EXCHANGE), eq(PASSWORD_RESET_LINKS_ROUTING_KEY), eq(message));
        verifyNoMoreInteractions(rabbitTemplate);
    }
}
