package afterady.domain.repository;

import afterady.domain.user.ResetPasswordLink;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResetPasswordLinkRepository extends CrudRepository<ResetPasswordLink, UUID> {

    Iterable<ResetPasswordLink> findAllByUser(User user);
}
