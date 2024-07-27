package afterady.service.password_reset;

import afterady.domain.repository.ResetPasswordLinkRepository;
import afterady.domain.user.ResetPasswordLink;
import afterady.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class ResetPasswordService {
    private static final Byte EXPIRATION_TIME_IN_MINUTES = 15;

    private final ResetPasswordLinkRepository resetPasswordLinkRepository;

    @Autowired
    public ResetPasswordService(ResetPasswordLinkRepository resetPasswordLinkRepository) {
        this.resetPasswordLinkRepository = resetPasswordLinkRepository;
    }

    public ResetPasswordLink createLinkFor(User user) {
        Optional<ResetPasswordLink> activeResetPasswordLink = StreamSupport
                .stream(resetPasswordLinkRepository.findAllByUser((user)).spliterator(), false)
                .filter(link -> !link.getExpired())
                .findFirst();
        if (activeResetPasswordLink.isPresent()) {
            throw new ResetPasswordLinkAlreadyExistsException();
        }
        ResetPasswordLink resetPasswordLink = new ResetPasswordLink(UUID.randomUUID(), user, false);
        return resetPasswordLinkRepository.save(resetPasswordLink);
    }

    public Optional<ResetPasswordLink> getById(UUID linkId) {
        return resetPasswordLinkRepository.findById(linkId);
    }

    public void expireOldLinks() {
        resetPasswordLinkRepository.findAll().forEach(link -> {
            if (link.getCreatedAt().plusMinutes(EXPIRATION_TIME_IN_MINUTES).isBefore(LocalDateTime.now())) {
                expireLink(link);
            }
        });
    }

    private void expireLink(ResetPasswordLink link) {
        link.expire();
        resetPasswordLinkRepository.save(link);
    }
}
