package afterady.domain.advice;

import afterady.domain.advice.category.AdviceCategory;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Document(collection = "suggested_advice")
public record SuggestedAdvice(@MongoId UUID id, String name, AdviceCategory category, String content, Long creatorId) {
}
