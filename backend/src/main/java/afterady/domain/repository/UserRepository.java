package afterady.domain.repository;

import afterady.domain.user.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}