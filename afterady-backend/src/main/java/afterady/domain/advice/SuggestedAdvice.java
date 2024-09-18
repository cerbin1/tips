package afterady.domain.advice;

import afterady.domain.advice.category.AdviceCategory;
import afterady.service.advice.SuggestedAdviceDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Set;
import java.util.UUID;

import static afterady.domain.advice.SuggestedAdvice.SUGGESTED_ADVICE_COLLECTION;

@Document(collection = SUGGESTED_ADVICE_COLLECTION)
@AllArgsConstructor
@Getter
public final class SuggestedAdvice {

    public static final String SUGGESTED_ADVICE_COLLECTION = "suggested_advice";

    @MongoId
    private final UUID id;
    private final String name;
    private final AdviceCategory category;
    private final String content;
    private final Long creatorId;
    private Set<String> userEmailVotesUp;
    private Set<String> userEmailVotesDown;

    public Integer getRating() {
        return userEmailVotesUp.size() - userEmailVotesDown.size();
    }

    public SuggestedAdviceDetailsDto toSuggestedAdviceDetailsDto() {
        return new SuggestedAdviceDetailsDto(id, name, category.getDisplayName(), content, getRating());
    }

    public void addUserVoteUp(String userEmail) {
        userEmailVotesUp.add(userEmail);
    }

    public void addUserVoteDown(String userEmail) {
        userEmailVotesDown.add(userEmail);
    }

    public boolean userVoted(String userEmail) {
        return userEmailVotesUp.contains(userEmail) || userEmailVotesDown.contains(userEmail);
    }
}
