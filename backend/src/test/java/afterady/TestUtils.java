package afterady;

import afterady.domain.user.Role;
import afterady.domain.user.User;

import java.util.Set;
import java.util.UUID;

import static afterady.domain.user.RoleName.ROLE_ADMIN;
import static afterady.domain.user.RoleName.ROLE_USER;
import static java.util.Collections.emptySet;

public final class TestUtils {
    public static final UUID UUID_1 = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    public static final UUID UUID_2 = UUID.fromString("d4645e88-0d23-4946-a75d-694fc475ceba");

    private TestUtils() {
    }

    public static User testUser() {
        return new User(1L, "username", "email", "password", false, emptySet());
    }

    public static User testUserWithRoles() {
        return new User(1L, "username", "email", "password", true, Set.of(new Role(ROLE_USER), new Role(ROLE_ADMIN)));
    }
}
