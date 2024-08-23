package afterady.security.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
public class RegistrationRequest {
    private String email;
    private String username;
    private String password;
    private String passwordRepeat;
    private Set<String> role;
}

