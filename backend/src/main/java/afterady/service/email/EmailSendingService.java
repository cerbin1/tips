package afterady.service.email;

import afterady.config.EnvironmentWrapper;
import org.springframework.stereotype.Service;

import static afterady.config.EnvironmentWrapper.AFTERADY_MAIL_PWD;
import static afterady.config.EnvironmentWrapper.AFTERADY_MAIL_SENDER;

@Service
public class EmailSendingService {
    private final Sender sender;
    private final EnvironmentWrapper environment;

    public EmailSendingService(Sender sender, EnvironmentWrapper environment) {
        this.sender = sender;
        this.environment = environment;
    }

    public boolean sendEmail(String to, String subject, String content) {
        String senderEmail = environment.getEnv(AFTERADY_MAIL_SENDER);
        String senderPassword = environment.getEnv(AFTERADY_MAIL_PWD);

        return sender.send(senderEmail, senderPassword, to, subject, content);
    }
}
