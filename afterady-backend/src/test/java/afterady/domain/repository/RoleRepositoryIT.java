package afterady.domain.repository;

import afterady.domain.user.Role;
import afterady.domain.user.RoleName;
import integration.DatabaseSetupExtension;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ExtendWith(DatabaseSetupExtension.class)
class RoleRepositoryIT {

    @Autowired
    private RoleRepository roleRepository;

    @AfterEach
    void cleanUp() {
        roleRepository.deleteAll();
    }

    @Test
    public void shouldSaveRole() {
        // arrange
        Role role = new Role(RoleName.ROLE_USER);

        // act
        roleRepository.save(role);

        // assert
        assertEquals(1, roleRepository.count());
        Role roleByName = roleRepository.findByName(RoleName.ROLE_USER).orElseThrow();
        assertEquals(RoleName.ROLE_USER, roleByName.getName());
    }

    @Test
    public void shouldDeleteRole() {
        // arrange
        Role role = roleRepository.save(new Role(RoleName.ROLE_USER));
        assertEquals(1, roleRepository.count());

        // act
        roleRepository.delete(role);

        // assert
        assertEquals(0, roleRepository.count());
    }

    @Test
    public void shouldFindRoleByName() {
        // arrange
        roleRepository.save(new Role(RoleName.ROLE_USER));
        assertEquals(1, roleRepository.count());

        // act
        Role roleByName = roleRepository.findByName(RoleName.ROLE_USER).orElseThrow();

        // assert
        assertEquals(RoleName.ROLE_USER, roleByName.getName());
    }
}