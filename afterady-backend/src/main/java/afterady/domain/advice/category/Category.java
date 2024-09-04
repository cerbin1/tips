package afterady.domain.advice.category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

@Document(collection = Category.CATEGORY_COLLECTION)
@AllArgsConstructor
@Getter
public class Category {
    public static final String CATEGORY_COLLECTION = "category";

    @MongoId
    private final UUID id;
    private final AdviceCategory enumValue;
    private final String description;
}
