package afterady.service.activation_link;

import afterady.domain.repository.UserActivationLinkRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.LocalDateTime;
import java.util.Optional;

import static afterady.TestUtils.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserActivatorServiceTest {

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
        userActivationLinkRepository.deleteAll();
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
    @Autowired
    private UserActivationLinkRepository userActivationLinkRepository;
    @Autowired
    private UserActivatorService userActivatorService;

    @Test
    public void shouldCreateLink() {
        // arrange
        User user = userRepository.save(testUser());
        assertEquals(0, userActivationLinkRepository.count());

        // act
        UserActivationLink link = userActivatorService.createLinkFor(user);

        // assert
        assertNotNull(link.getLinkId());
        assertEquals("username", link.getUser().getUsername());
        assertEquals(false, link.getExpired());
        assertEquals(1, userActivationLinkRepository.count());
    }

    @Test
    public void shouldThrowExceptionWhenTryingToCreateLinkWhenThereIsAlreadyActiveLink() {
        // arrange
        User user = userRepository.save(testUser());
        assertEquals(0, userActivationLinkRepository.count());
        userActivatorService.createLinkFor(user);

        // act & assert
        assertThrows(UserActivationLinkAlreadyExistsException.class, () -> userActivatorService.createLinkFor(user));
    }

    @Test
    public void shouldCreateSecondLinkWhenFirstIsExpired() {
        // arrange
        User user = userRepository.save(testUser());
        userActivationLinkRepository.save(new UserActivationLink(UUID_1, user, true));
        assertEquals(1, userActivationLinkRepository.count());

        // act
        userActivatorService.createLinkFor(user);

        // assert
        assertEquals(2, userActivationLinkRepository.count());
    }

    @Test
    public void shouldFindLinkById() {
        // arrange
        User user = userRepository.save(testUser());
        userActivationLinkRepository.save(new UserActivationLink(UUID_1, user, false));

        // act & assert
        assertTrue(userActivatorService.getById(UUID_1).isPresent());
    }

    @Test
    public void shouldNotFindLinkById() {
        // act & assert
        assertTrue(userActivatorService.getById(UUID_1).isEmpty());
    }

    @Test
    public void shouldActivateUser() {
        // arrange
        User user = userRepository.save(testUser());
        UserActivationLink link = userActivationLinkRepository.save(new UserActivationLink(UUID_1, user, false));
        assertFalse(user.getActive());
        assertFalse(link.getExpired());

        // act
        userActivatorService.activateUserByLink(link);

        // assert
        Optional<UserActivationLink> activatedLink = userActivatorService.getById(UUID_1);
        assertTrue(activatedLink.isPresent());
        assertTrue(activatedLink.get().getExpired());
        Optional<User> activatedUser = userRepository.findById(user.getId());
        assertTrue(activatedUser.isPresent());
        assertTrue(activatedUser.get().getActive());
    }

    @Test
    public void shouldResendLink() {
        // arrange
        User user = userRepository.save(testUser());
        UserActivationLink link = userActivationLinkRepository.save(new UserActivationLink(UUID_1, user, false));
        assertFalse(user.getActive());
        assertFalse(link.getExpired());
        assertEquals(userActivationLinkRepository.count(), 1);

        // act
        userActivatorService.resendLink(link);

        // assert
        assertEquals(userActivationLinkRepository.count(), 2);
        userActivationLinkRepository.findAllByUser(user).forEach(activationLink -> {
            if (activationLink.getLinkId().equals(UUID_1)) {
                assertTrue(activationLink.getExpired());
            } else {
                assertFalse(activationLink.getExpired());
            }
        });
    }

    @Test
    public void shouldExpireOldLinks() {
        // arrange
        User user = userRepository.save(testUser());
        userActivationLinkRepository.save(new UserActivationLink(UUID_1, user, false, LocalDateTime.now().minusHours(1)));
        userActivationLinkRepository.save(new UserActivationLink(UUID_2, user, false, LocalDateTime.now().minusHours(1)));
        assertEquals(2, userActivationLinkRepository.count());
        userActivationLinkRepository.findAll().forEach(link -> assertFalse(link.getExpired()));

        // act
        userActivatorService.expireOldLinks();

        // assert
        assertEquals(2, userActivationLinkRepository.count());
        userActivationLinkRepository.findAll().forEach(link -> assertTrue(link.getExpired()));
    }
}
