package afterady.messages.activation_link;

import afterady.messages.LinkMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static afterady.messages.LinksSendingMQConfiguration.ACTIVATION_LINKS_ROUTING_KEY;
import static afterady.messages.LinksSendingMQConfiguration.LINKS_EXCHANGE;

@Service
public class TriggerSendingActivationLinkSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void send(LinkMessage message) {
        rabbitTemplate.convertAndSend(LINKS_EXCHANGE, ACTIVATION_LINKS_ROUTING_KEY, message);
    }
}
