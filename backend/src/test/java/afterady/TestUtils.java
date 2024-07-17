package afterady;

import afterady.domain.user.User;
import lombok.experimental.UtilityClass;

import static java.util.Collections.emptySet;

@UtilityClass
public class TestUtils {

    public User testUser() {
        return new User(1L, "username", "email", "password", false, emptySet());
    }
}
