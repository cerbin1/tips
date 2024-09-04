package afterady.config.db;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

@Configuration
public class MongoDbConfig {

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Value("${mongodb.advice.schema.file.path}")
    private String adviceSchemaPath;

    @Value("${mongodb.suggestedAdvice.schema.file.path}")
    private String suggestedAdviceSchemaPath;

    private final MongoClient mongoClient;

    public MongoDbConfig(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @PostConstruct
    public void init() throws IOException {
        MongoDatabase database = mongoClient.getDatabase(databaseName);
        initCollection(database, "advice", adviceSchemaPath);
        initCollection(database, "suggestedAdvice", suggestedAdviceSchemaPath);
    }

    private void initCollection(MongoDatabase database, String collectionName, String schemaFilePath) throws IOException {
        if (!database.listCollectionNames().into(new ArrayList<>()).contains(collectionName)) {
            database.createCollection(collectionName);
        }
        String schemaJson = new String(Files.readAllBytes(Paths.get(schemaFilePath)));
        Document schemaDocument = Document.parse(schemaJson);
        database.runCommand(new Document("collMod", collectionName).append("validator", schemaDocument));
    }
}