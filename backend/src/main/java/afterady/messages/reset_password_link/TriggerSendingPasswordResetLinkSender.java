package afterady.messages.reset_password_link;

import afterady.messages.LinkMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;
import static afterady.messages.LinksSendingMQConfiguration.PASSWORD_RESET_LINKS_ROUTING_KEY;

@Service
public class TriggerSendingPasswordResetLinkSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void send(LinkMessage message) {
        rabbitTemplate.convertAndSend(LINKS_EXCHANGE, PASSWORD_RESET_LINKS_ROUTING_KEY, message);
    }
}