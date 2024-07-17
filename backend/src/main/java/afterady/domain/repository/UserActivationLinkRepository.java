package afterady.domain.repository;

import afterady.domain.user.UserActivationLink;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserActivationLinkRepository extends CrudRepository<UserActivationLink, UUID> {
}
