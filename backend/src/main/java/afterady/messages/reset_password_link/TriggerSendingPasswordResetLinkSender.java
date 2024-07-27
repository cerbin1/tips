package afterady.messages.reset_password_link;

import afterady.messages.LinkMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;

@Service
public class TriggerSendingPasswordResetLinkSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void send(LinkMessage message) {
        rabbitTemplate.convertAndSend(LINKS_EXCHANGE, "routing.key.2", message);
    }
}