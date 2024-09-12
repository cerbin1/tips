package afterady.repository;

import integration.DatabaseSetupExtension;
import afterady.TestUtils;
import afterady.domain.repository.RoleRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.Role;
import afterady.domain.user.RoleName;
import afterady.domain.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(DatabaseSetupExtension.class)
public class UserRepositoryIT {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @AfterEach
    void cleanUp() {
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    public void shouldSaveUser() {
        // arrange
        Role role = roleRepository.save(new Role(RoleName.ROLE_USER));
        User user = new User("username", "email", "password", role);

        // act
        userRepository.save(user);

        // assert
        User foundUser = userRepository.findById(user.getId()).orElse(null);
        assertNotNull(foundUser);
        assertEquals("username", foundUser.getUsername());
        assertEquals("email", foundUser.getEmail());
        assertEquals("password", foundUser.getPassword());
        assertEquals(false, foundUser.getActive());
    }

    @Test
    public void shouldDeleteUser() {
        // arrange
        Role role = roleRepository.save(new Role(RoleName.ROLE_USER));
        User user = new User("username", "email", "password", role);
        userRepository.save(user);
        assertEquals(1, userRepository.count());

        // act
        userRepository.deleteById(user.getId());

        // assert
        assertEquals(0, userRepository.count());
    }

    @Test
    public void shouldUpdateUser() {
        // arrange
        Role role = roleRepository.save(new Role(RoleName.ROLE_USER));
        User user = new User("username", "email", "password", role);
        userRepository.save(user);
        Long createdUserId = user.getId();
        assertEquals(1, userRepository.count());
        User created = userRepository.findById(createdUserId).orElseThrow();
        assertEquals("username", created.getUsername());
        assertEquals("email", created.getEmail());
        assertEquals("password", created.getPassword());
        assertFalse(created.getActive());
        assertEquals(1, created.getRoles().size());

        // act
        User userWithSameIdAndDifferentOtherData = new User(createdUserId, "username2", "email2", "password2", true, Set.of(role));
        userRepository.save(userWithSameIdAndDifferentOtherData);

        // assert
        assertEquals(1, userRepository.count());
        User updated = userRepository.findById(createdUserId).orElseThrow();
        assertEquals("username2", updated.getUsername());
        assertEquals("email2", updated.getEmail());
        assertEquals("password2", updated.getPassword());
        assertTrue(updated.getActive());
        assertEquals(1, updated.getRoles().size());
    }

    @Test
    public void shouldReturnTrueIfUserByUsernameExists() {
        // arrange
        assertFalse(userRepository.existsByUsername("username"));
        User user = TestUtils.testUser();
        userRepository.save(user);

        // act & assert
        assertTrue(userRepository.existsByUsername("username"));
    }

    @Test
    public void shouldReturnTrueIfUserByEmailExists() {
        // arrange
        assertFalse(userRepository.existsByEmail("email"));
        User user = TestUtils.testUser();
        userRepository.save(user);

        // act & assert
        assertTrue(userRepository.existsByEmail("email"));
    }

    @Test
    public void shouldNotFindUserByEmail() {
        // act & assert
        assertFalse(userRepository.findByEmail("email").isPresent());
    }

    @Test
    public void shouldFindUserByEmail() {
        User user = TestUtils.testUser();
        userRepository.save(user);

        // act & assert
        assertTrue(userRepository.findByEmail("email").isPresent());
    }
}
