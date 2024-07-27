package afterady;

import afterady.domain.user.RoleName;
import afterady.domain.user.User;
import afterady.domain.user.Role;

import java.util.Set;

import static afterady.domain.user.RoleName.*;
import static java.util.Collections.emptySet;

public final class TestUtils {
    private TestUtils() {
    }

    public static User testUser() {
        return new User(1L, "username", "email", "password", false, emptySet());
    }

    public static User testUserWithRoles() {
        return new User(1L, "username", "email", "password", true, Set.of(new Role(ROLE_USER), new Role(ROLE_ADMIN)));
    }
}
