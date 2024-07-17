package afterady.repository;

import afterady.TestUtils;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;

import static java.util.Collections.emptySet;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserRepositoryTest {
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:16-alpine"
    );

    @BeforeAll
    static void beforeAll() {
        postgres.start();
    }

    @AfterAll
    static void afterAll() {
        postgres.stop();
    }

    @BeforeEach
    void beforeEach() {
        userRepository.deleteAll();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    public void shouldSaveUser() {
        // given
        User user = new User("username", "email", "password");

        // when
        userRepository.save(user);

        // then
        User foundUser = userRepository.findById(user.getId()).orElse(null);
        assertNotNull(foundUser);
        assertEquals("username", foundUser.getUsername());
        assertEquals("email", foundUser.getEmail());
        assertEquals("password", foundUser.getPassword());
        assertEquals(false, foundUser.getActive());
    }

    @Test
    @Transactional
    public void shouldDeleteUser() {
        // given
        User user = new User("username", "email", "password");
        userRepository.save(user);
        assertEquals(1, userRepository.count());

        // when
        userRepository.deleteById(user.getId());

        // then
        assertEquals(0, userRepository.count());
    }

    @Test
    @Transactional
    public void shouldUpdateUser() {
        // given
        User user = TestUtils.testUser();
        userRepository.save(user);
        assertEquals(1, userRepository.count());
        User created = userRepository.findById(1L).orElseThrow();
        assertEquals("username", created.getUsername());
        assertEquals("email", created.getEmail());
        assertEquals("password", created.getPassword());
        assertFalse(created.getActive());
        assertTrue(created.getRoles().isEmpty());

        // when
        User userWithSameIdAndDifferentOtherData = new User(1L, "username2", "email2", "password2", true, emptySet());
        userRepository.save(userWithSameIdAndDifferentOtherData);

        // then
        assertEquals(1, userRepository.count());
        User updated = userRepository.findById(1L).orElseThrow();
        assertEquals("username2", updated.getUsername());
        assertEquals("email2", updated.getEmail());
        assertEquals("password2", updated.getPassword());
        assertTrue(updated.getActive());
        assertTrue(updated.getRoles().isEmpty());
    }

    @Test
    public void shouldReturnTrueIfUserByUsernameExists() {
        // given
        assertFalse(userRepository.existsByUsername("username"));
        User user = TestUtils.testUser();
        userRepository.save(user);

        // when & then
        assertTrue(userRepository.existsByUsername("username"));
    }

    @Test
    public void shouldReturnTrueIfUserByEmailExists() {
        // given
        assertFalse(userRepository.existsByEmail("email"));
        User user = TestUtils.testUser();
        userRepository.save(user);

        // when & then
        assertTrue(userRepository.existsByEmail("email"));
    }

}
