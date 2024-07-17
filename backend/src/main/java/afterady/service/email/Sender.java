package afterady.service.email;

public interface Sender {
    boolean send(String senderEmail, String senderPassword ,String to, String subject, String content);
}
