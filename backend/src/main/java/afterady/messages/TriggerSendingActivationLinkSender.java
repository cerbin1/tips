package afterady.messages;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TriggerSendingActivationLinkSender {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private static final String topicExchangeName = "activation-links-exchange";

    public void send(Message message) {
        rabbitTemplate.convertAndSend(topicExchangeName, "links", message);
    }
}