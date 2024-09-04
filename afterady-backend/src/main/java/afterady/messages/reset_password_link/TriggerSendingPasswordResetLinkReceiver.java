package afterady.messages.reset_password_link;

import afterady.config.EnvironmentWrapper;
import afterady.messages.LinkMessage;
import afterady.service.email.EmailSendingService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static afterady.config.EnvironmentWrapper.AFTERADY_FRONT_URL;
import static afterady.messages.LinksSendingMQConfiguration.PASSWORD_RESET_LINKS_QUEUE;

@Component()
public class TriggerSendingPasswordResetLinkReceiver {
    private final EmailSendingService emailSendingService;
    private final EnvironmentWrapper environment;

    public TriggerSendingPasswordResetLinkReceiver(EmailSendingService emailSendingService, EnvironmentWrapper environment) {
        this.emailSendingService = emailSendingService;
        this.environment = environment;
    }

    @RabbitListener(queues = PASSWORD_RESET_LINKS_QUEUE)
    public void receive(LinkMessage message) {
        var subject = "Afterady - password reset link";
        String email = message.email();
        var content = environment.getEnv(AFTERADY_FRONT_URL) + "user/password-change/" + message.linkId();
        emailSendingService.sendEmail(email, subject, content);
    }
}
