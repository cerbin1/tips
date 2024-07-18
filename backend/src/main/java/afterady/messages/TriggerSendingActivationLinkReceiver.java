package afterady.messages;

import afterady.config.EnvironmentWrapper;
import afterady.service.email.EmailSendingService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static afterady.config.EnvironmentWrapper.AFTERADY_FRONT_URL;

@Component
public class TriggerSendingActivationLinkReceiver {
    private final EmailSendingService emailSendingService;
    private final EnvironmentWrapper environment;

    public TriggerSendingActivationLinkReceiver(EmailSendingService emailSendingService, EnvironmentWrapper environment) {
        this.emailSendingService = emailSendingService;
        this.environment = environment;
    }

    @RabbitListener(queues = "activation-links-queue")
    public void receive(Message message) {
        var subject = "Afterady - activation link";
        var content = environment.getEnv(AFTERADY_FRONT_URL) + "auth/activate/" + message.linkId();
        emailSendingService.sendEmail(message.email(), subject, content);
    }
}
