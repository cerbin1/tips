package afterady.service.captcha;

import afterady.config.EnvironmentWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static afterady.config.EnvironmentWrapper.AFTERADY_CAPTCHA_SECRET;

@Service
public class CaptchaServiceImpl implements CaptchaService {
    private final static Logger logger = LoggerFactory.getLogger(CaptchaServiceImpl.class);

    private final EnvironmentWrapper environment;

    public CaptchaServiceImpl(EnvironmentWrapper environment) {
        this.environment = environment;
    }

    @Override
    public boolean isCaptchaTokenValid(String captchaToken) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://hcaptcha.com/siteverify" +
                            "?secret=" + environment.getEnv(AFTERADY_CAPTCHA_SECRET) +
                            "&response=" + captchaToken))
                    .method("POST", HttpRequest.BodyPublishers.noBody())
                    .header("Content-Type", "application/json")
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            return response.body().contains("\"success\":true");
        } catch (Exception e) {
            logger.error(String.format("Failed to validate captcha token: {%s}.", captchaToken), e);
            return false;
        }
    }
}
