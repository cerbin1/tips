package afterady.domain.advice;

import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.UUID;

import static afterady.domain.advice.CategoriesStatistics.CATEGORIES_STATISTICS_COLLECTION;

@Document(collection = CATEGORIES_STATISTICS_COLLECTION)
@Getter
public class CategoriesStatistics {
    public static final String CATEGORIES_STATISTICS_COLLECTION = "categories_statistics";

    @MongoId
    private final UUID id;
    private final AdviceCategory category;
    private final String categoryDisplayName;
    private final String description;
    private final int advicesCount;

    public CategoriesStatistics(UUID id, AdviceCategory category, String categoryDisplayName, String description, int advicesCount) {
        this.id = id;
        this.category = category;
        this.categoryDisplayName = categoryDisplayName;
        this.description = description;
        this.advicesCount = advicesCount;
    }
}
