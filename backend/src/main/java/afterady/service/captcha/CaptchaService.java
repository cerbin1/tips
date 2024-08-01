package afterady.service.captcha;

public interface CaptchaService {

    boolean isCaptchaTokenValid(String captchaToken);
}
