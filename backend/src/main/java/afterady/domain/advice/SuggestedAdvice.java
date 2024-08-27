package afterady.domain.advice;

import afterady.domain.advice.category.AdviceCategory;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "suggestedAdvice")
public record SuggestedAdvice(@MongoId String id, String name, AdviceCategory category, String content, Long creatorId) {
}
