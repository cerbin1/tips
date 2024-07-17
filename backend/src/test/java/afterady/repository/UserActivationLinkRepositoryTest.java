package afterady.repository;

import afterady.TestUtils;
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
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class UserActivationLinkRepositoryTest {
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
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserActivationLinkRepository userActivationLinkRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    @Transactional
    public void shouldSaveLink() {
        // given
        User user = TestUtils.testUser();
        userRepository.save(user);
        assertEquals(0, userActivationLinkRepository.count());
        UUID linkId = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
        UserActivationLink userActivationLink = new UserActivationLink(linkId, user, false);

        // when
        userActivationLinkRepository.save(userActivationLink);

        // then
        assertEquals(1, userActivationLinkRepository.count());
        UserActivationLink foundUserActivationLink = userActivationLinkRepository.findById(linkId).orElse(null);
        assertNotNull(foundUserActivationLink);
        assertEquals(linkId, foundUserActivationLink.getLinkId());
        assertNotNull(foundUserActivationLink.getUser());
        assertEquals(false, foundUserActivationLink.getExpired());
    }
}
