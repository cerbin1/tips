package afterady.domain.advice;

import static java.util.Arrays.*;

public enum AdviceCategory {
    PERSONAL_DEVELOPMENT,
    HEALTH,
    HOME,
    FINANCE,
    TECHNOLOGY;

    public static boolean isValid(String category) {
        return stream(values())
                .anyMatch(enumCategory -> enumCategory.name().equals(category));
    }
}
