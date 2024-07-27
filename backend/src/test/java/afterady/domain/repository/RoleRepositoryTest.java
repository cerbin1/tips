package afterady.domain.repository;

import afterady.domain.user.Role;
import afterady.domain.user.RoleName;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class RoleRepositoryTest {

    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            "postgres:16-alpine"
    );

    @Autowired
    private RoleRepository roleRepository;

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
        roleRepository.deleteAll();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
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