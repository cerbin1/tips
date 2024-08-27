package afterady.security.auth;

import afterady.service.CustomUserDetailsService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public final class AuthUtil {

    public Long getLoggedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object loggedInUser = authentication.getPrincipal();
        if (loggedInUser instanceof CustomUserDetailsService.UserDetailsImpl) {
            return ((CustomUserDetailsService.UserDetailsImpl) loggedInUser).id();
        }
        throw new IllegalStateException("User not logged in");
    }
}
