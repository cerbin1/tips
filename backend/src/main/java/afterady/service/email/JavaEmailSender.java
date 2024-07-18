package afterady.service.email;

import afterady.config.EnvironmentWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

import static afterady.config.EnvironmentWrapper.AFTERADY_MAIL_HOST;

@Component
public class JavaEmailSender implements Sender {
    private final static Logger logger = LoggerFactory.getLogger(JavaEmailSender.class);

    private final EnvironmentWrapper environment;

    public JavaEmailSender(EnvironmentWrapper environment) {
        this.environment = environment;
    }

    @Override
    public boolean send(String senderEmail, String senderPassword, String to, String subject, String content) {
        try {
            MimeMessage message = prepareMessage(senderEmail, senderPassword, to, subject, content);
            Transport.send(message);
            logger.info(String.format("Email for %s with subject: %s sent successfully.", to, subject));
            return true;
        } catch (MessagingException e) {
            logger.error(String.format("Failed to send email %s with subject: %s.", to, subject));
            return false;
        }
    }

    private MimeMessage prepareMessage(String senderEmail, String senderPassword, String to, String subject, String content)
            throws MessagingException {
        MimeMessage message = new MimeMessage(getConfiguredSession(senderEmail, senderPassword));
        message.setFrom(new InternetAddress(senderEmail));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
        message.setSubject(subject);
        message.setText(content);
        return message;
    }

    private Session getConfiguredSession(String senderEmail, String senderPassword) {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", environment.getEnv(AFTERADY_MAIL_HOST));
        properties.put("mail.smtp.starttls.required", "true");
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.port", "465");

        return Session.getDefaultInstance(properties,
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(senderEmail, senderPassword);
                    }
                });
    }
}
