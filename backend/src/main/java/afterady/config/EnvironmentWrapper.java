package afterady.config;

import org.springframework.stereotype.Component;

@Component
public class EnvironmentWrapper {
    public static final String AFTERADY_MAIL_SENDER = "AFTERADY_MAIL_SENDER";
    public static final String AFTERADY_MAIL_PWD = "AFTERADY_MAIL_PWD";
    public static final String AFTERADY_MAIL_HOST = "AFTERADY_MAIL_HOST";

    public String getEnv(String name) {
        return System.getenv(name);
    }
}
