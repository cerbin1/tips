package afterady.messages.reset_password_link;

import afterady.messages.LinkMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;
import static afterady.messages.LinksSendingMQConfiguration.PASSWORD_RESET_LINKS_ROUTING_KEY;

@Service
public class TriggerSendingPasswordResetLinkSender {

    private final RabbitTemplate rabbitTemplate;

    public TriggerSendingPasswordResetLinkSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(LinkMessage message) {
        rabbitTemplate.convertAndSend(LINKS_EXCHANGE, PASSWORD_RESET_LINKS_ROUTING_KEY, message);
    }
}