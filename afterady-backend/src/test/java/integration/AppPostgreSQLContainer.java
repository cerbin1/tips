package integration;

import org.testcontainers.containers.PostgreSQLContainer;

public class AppPostgreSQLContainer extends PostgreSQLContainer<AppPostgreSQLContainer> {

    public static AppPostgreSQLContainer container = new AppPostgreSQLContainer()
            .withDatabaseName("test")
            .withUsername("test")
            .withPassword("test");

    public AppPostgreSQLContainer() {
        super("postgres:16-alpine");
    }
}
