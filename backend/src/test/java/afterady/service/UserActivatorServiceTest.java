package afterady.service;

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

import java.util.UUID;

import static afterady.TestUtils.testUser;
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
        // given
        User user = userRepository.save(testUser());
        assertEquals(0, userActivationLinkRepository.count());

        // when
        UserActivationLink link = userActivatorService.createLinkFor(user);

        // then
        assertNotNull(link.getLinkId());
        assertEquals("username", link.getUser().getUsername());
        assertEquals(false, link.getExpired());
        assertEquals(1, userActivationLinkRepository.count());
    }

    @Test
    public void shouldThrowExceptionWhenTryingToCreateLinkWhenThereIsAlreadyActiveLink() {
        // given
        User user = userRepository.save(testUser());
        assertEquals(0, userActivationLinkRepository.count());
        userActivatorService.createLinkFor(user);

        // when & then
        assertThrows(UserActivationLinkAlreadyExistsException.class, () -> userActivatorService.createLinkFor(user));
    }

    @Test
    public void shouldCreateSecondLinkWhenFirstIsExpired() {
        // given
        User user = userRepository.save(testUser());
        userActivationLinkRepository.save(new UserActivationLink(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"), testUser(), true));
        assertEquals(1, userActivationLinkRepository.count());

        // when
        userActivatorService.createLinkFor(user);

        // then
        assertEquals(2, userActivationLinkRepository.count());
    }

}
