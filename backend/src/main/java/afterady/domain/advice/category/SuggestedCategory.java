package afterady.domain.advice.category;

import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

import static afterady.domain.advice.category.SuggestedCategory.*;


@Document(collection = SUGGESTED_CATEGORY_COLLECTION)
@AllArgsConstructor
public class SuggestedCategory {
    public static final String SUGGESTED_CATEGORY_COLLECTION = "suggested_category";

    @MongoId
    private final UUID id;
    private final String name;
    private final Long creatorId;
}
