package afterady.service.activation_link;

import afterady.domain.repository.UserActivationLinkRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class UserActivatorService {
    private final UserActivationLinkRepository userActivationLinkRepository;
    private final UserRepository userRepository;

    public UserActivatorService(UserActivationLinkRepository userActivationLinkRepository, UserRepository userRepository) {
        this.userActivationLinkRepository = userActivationLinkRepository;
        this.userRepository = userRepository;
    }

    public UserActivationLink createLinkFor(User user) {
        Optional<UserActivationLink> activeUserActivationLink = StreamSupport
                .stream(userActivationLinkRepository.findAllByUser((user)).spliterator(), false)
                .filter(userActivationLink -> !userActivationLink.getExpired())
                .findFirst();
        if (activeUserActivationLink.isPresent()) {
            throw new UserActivationLinkAlreadyExistsException();
        }

        UserActivationLink userActivationLink = new UserActivationLink(UUID.randomUUID(), user, false);
        return userActivationLinkRepository.save(userActivationLink);
    }


    public Optional<UserActivationLink> getById(UUID linkId) {
        return userActivationLinkRepository.findById(linkId);
    }

    public void activateUserByLink(UserActivationLink link) {
        expireLink(link);
        activateUser(link);
    }

    private void activateUser(UserActivationLink link) {
        User user = link.getUser();
        user.activate();
        userRepository.save(user);
    }

    private void expireLink(UserActivationLink link) {
        link.expire();
        userActivationLinkRepository.save(link);
    }

    @Transactional
    public void resendLink(UserActivationLink activationLink) {
        expireLink(activationLink);
        createLinkFor(activationLink.getUser());
    }
}
