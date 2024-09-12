package afterady.service.password_reset;

import afterady.domain.repository.ResetPasswordLinkRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.ResetPasswordLink;
import afterady.domain.user.User;
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

import static afterady.TestUtils.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ResetPasswordServiceIT {

    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:16-alpine"
    );

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResetPasswordLinkRepository resetPasswordLinkRepository;
    @Autowired
    private ResetPasswordService resetPasswordService;

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
        resetPasswordLinkRepository.deleteAll();
        userRepository.deleteAll();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    public void shouldCreateLink() {
        // arrange
        User user = userRepository.save(testUser());
        assertEquals(0, resetPasswordLinkRepository.count());

        // act
        ResetPasswordLink link = resetPasswordService.createLinkFor(user);

        // assert
        assertNotNull(link.getLinkId());
        assertEquals("username", link.getUser().getUsername());
        assertEquals(false, link.getExpired());
        assertEquals(1, resetPasswordLinkRepository.count());
    }

    @Test
    public void shouldThrowExceptionWhenTryingToCreateLinkWhenThereIsAlreadyActiveLink() {
        // arrange
        User user = userRepository.save(testUser());
        assertEquals(0, resetPasswordLinkRepository.count());
        resetPasswordService.createLinkFor(user);

        // act & assert
        assertThrows(ResetPasswordLinkAlreadyExistsException.class, () -> resetPasswordService.createLinkFor(user));
    }

    @Test
    public void shouldCreateSecondLinkWhenFirstIsExpired() {
        // arrange
        User user = userRepository.save(testUser());
        resetPasswordLinkRepository.save(new ResetPasswordLink(UUID_1, user, true));
        assertEquals(1, resetPasswordLinkRepository.count());

        // act
        resetPasswordService.createLinkFor(user);

        // assert
        assertEquals(2, resetPasswordLinkRepository.count());
    }

    @Test
    public void shouldFindLinkById() {
        // arrange
        User user = userRepository.save(testUser());
        resetPasswordLinkRepository.save(new ResetPasswordLink(UUID_1, user, false));

        // act & assert
        assertTrue(resetPasswordService.getById(UUID_1).isPresent());
    }

    @Test
    public void shouldExpireOldLinks() {
        // arrange
        User user = userRepository.save(testUser());
        resetPasswordLinkRepository.save(new ResetPasswordLink(UUID_1, user, false, LocalDateTime.now().minusHours(1)));
        resetPasswordLinkRepository.save(new ResetPasswordLink(UUID_2, user, false, LocalDateTime.now().minusHours(1)));
        assertEquals(2, resetPasswordLinkRepository.count());
        resetPasswordLinkRepository.findAll().forEach(link -> assertFalse(link.getExpired()));

        // act
        resetPasswordService.expireOldLinks();

        // assert
        assertEquals(2, resetPasswordLinkRepository.count());
        resetPasswordLinkRepository.findAll().forEach(link -> assertTrue(link.getExpired()));
    }
}