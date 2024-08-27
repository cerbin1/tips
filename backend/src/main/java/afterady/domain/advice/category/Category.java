package afterady.domain.advice.category;

import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

import static afterady.domain.advice.category.Category.*;


@Document(collection = CATEGORY_COLLECTION)
@AllArgsConstructor
public class Category {
    public static final String CATEGORY_COLLECTION = "suggested_category";

    @MongoId
    private final UUID id;
    private final String name;
    private final Long creatorId;
}
