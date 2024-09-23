package afterady.domain.advice.category;

import afterady.service.advice.category.SuggestedCategoryDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Set;
import java.util.UUID;

import static afterady.domain.advice.category.SuggestedCategory.SUGGESTED_CATEGORY_COLLECTION;


@Document(collection = SUGGESTED_CATEGORY_COLLECTION)
@AllArgsConstructor
@Getter
public class SuggestedCategory {
    public static final String SUGGESTED_CATEGORY_COLLECTION = "suggested_category";

    @MongoId
    private final UUID id;
    private final String name;
    private final Long creatorId;
    private Set<String> votesUp;
    private Set<String> votesDown;

    public Integer getRating() {
        return votesUp.size() - votesDown.size();
    }

    public SuggestedCategoryDetailsDto toSuggestedCategoryDetailsDto() {
        return new SuggestedCategoryDetailsDto(id, name, getRating());
    }

    public void addUserVoteUp(String userEmail) {
        votesUp.add(userEmail);
    }

    public void addUserVoteDown(String userEmail) {
        votesDown.add(userEmail);
    }

    public boolean userVoted(String userEmail) {
        return votesUp.contains(userEmail) || votesDown.contains(userEmail);
    }
}
