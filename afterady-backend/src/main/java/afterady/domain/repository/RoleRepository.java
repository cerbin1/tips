package afterady.domain.repository;

import afterady.domain.user.Role;
import afterady.domain.user.RoleName;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}
