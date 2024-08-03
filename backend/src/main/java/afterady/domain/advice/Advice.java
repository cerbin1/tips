package afterady.domain.advice;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

import static afterady.domain.advice.Advice.ADVICE_COLLECTION;

@Document(collection = ADVICE_COLLECTION)
public record Advice(@MongoId UUID id, String name, AdviceCategory category, String content, Integer rating) {
    public static final String ADVICE_COLLECTION = "advice";
}
