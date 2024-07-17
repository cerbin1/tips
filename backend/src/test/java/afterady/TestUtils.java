package afterady;

import afterady.domain.user.User;

import static java.util.Collections.emptySet;

public final class TestUtils {
    private TestUtils() {
    }

    public static User testUser() {
        return new User(1L, "username", "email", "password", false, emptySet());
    }
}
