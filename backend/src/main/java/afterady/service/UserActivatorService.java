package afterady.service;

import afterady.domain.repository.UserActivationLinkRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class UserActivatorService {
    private final UserActivationLinkRepository userActivationLinkRepository;

    public UserActivatorService(UserActivationLinkRepository userActivationLinkRepository) {
        this.userActivationLinkRepository = userActivationLinkRepository;
    }

    public void createLinkFor(User user) {
        Optional<UserActivationLink> activeUserActivationLink = StreamSupport
                .stream(userActivationLinkRepository.findAllByUser((user)).spliterator(), false)
                .filter(userActivationLink -> !userActivationLink.getExpired())
                .findFirst();
        if (activeUserActivationLink.isPresent()) {
            throw new UserActivationLinkAlreadyExistsException();
        }

        UserActivationLink userActivationLink = new UserActivationLink(UUID.randomUUID(), user, false);
        userActivationLinkRepository.save(userActivationLink);
    }
}
