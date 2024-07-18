package afterady.messages;

import afterady.service.email.EmailSendingService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TriggerSendingActivationLinkReceiver {

    @Autowired
    private EmailSendingService emailSendingService;

    @RabbitListener(queues = "activation-links-queue")
    public void receive(Message message) {
        var subject = "Afterady - activation link";
        var content = "auth/activate/" + message.linkId();
        emailSendingService.sendEmail(message.email(), subject, content);
    }
}
