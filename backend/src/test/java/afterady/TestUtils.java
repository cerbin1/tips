package afterady;

import afterady.domain.user.Role;
import afterady.domain.user.User;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static afterady.domain.user.RoleName.ROLE_ADMIN;
import static afterady.domain.user.RoleName.ROLE_USER;
import static java.util.Collections.emptySet;

public final class TestUtils {
    public static final UUID UUID_1 = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
    public static final UUID UUID_2 = UUID.fromString("d4645e88-0d23-4946-a75d-694fc475ceba");
    public static final String TEST_EMAIL = "email@test";
    public static final String VALID_TEST_EMAIL = "email@test.com";


    private TestUtils() {
    }

    public static User testUser() {
        return new User(1L, "username", "email", "password", false, emptySet());
    }

    public static User testUserWithRoles() {
        return new User(1L, "username", "email", "password", true, Set.of(new Role(ROLE_USER), new Role(ROLE_ADMIN)));
    }

    public static Set<String> generateTestVotes(int count) {
        Set<String> votes = new HashSet<>(count);
        for (int i = 0; i < count; i++) {
            votes.add(String.format("test%s@test.pl", i));
        }
        return votes;
    }
}
