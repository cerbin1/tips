package afterady.domain.advice;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "advice")
public record Advice(@MongoId String id, String name, AdviceCategory category, String content) {
}
