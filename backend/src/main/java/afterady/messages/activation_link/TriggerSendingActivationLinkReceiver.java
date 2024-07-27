package afterady.messages.activation_link;

import afterady.config.EnvironmentWrapper;
import afterady.messages.LinkMessage;
import afterady.service.email.EmailSendingService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static afterady.config.EnvironmentWrapper.AFTERADY_FRONT_URL;
import static afterady.messages.LinksSendingMQConfiguration.ACTIVATION_LINKS_QUEUE;

@Component
public class TriggerSendingActivationLinkReceiver {
    private final EmailSendingService emailSendingService;
    private final EnvironmentWrapper environment;

    public TriggerSendingActivationLinkReceiver(EmailSendingService emailSendingService, EnvironmentWrapper environment) {
        this.emailSendingService = emailSendingService;
        this.environment = environment;
    }

    @RabbitListener(queues = ACTIVATION_LINKS_QUEUE)
    public void receive(LinkMessage message) {
        var subject = "Afterady - activation link";
        var content = environment.getEnv(AFTERADY_FRONT_URL) + "user/activate/" + message.linkId();
        emailSendingService.sendEmail(message.email(), subject, content);
    }
}
