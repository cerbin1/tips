package afterady.domain.advice;

import afterady.domain.advice.category.AdviceCategory;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.UserVotedAdviceDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.Set;
import java.util.UUID;

import static afterady.domain.advice.Advice.ADVICE_COLLECTION;

@Document(collection = ADVICE_COLLECTION)
@AllArgsConstructor
@Getter
public class Advice {

    public static final String ADVICE_COLLECTION = "advice";

    @MongoId
    private final UUID id;
    private String name;
    private AdviceCategory category;
    private String content;
    private Set<String> userEmailVotes;

    public void addUserVote(String userEmail) {
        userEmailVotes.add(userEmail);
    }

    public AdviceDetailsDto toAdviceDetailsDto() {
        return new AdviceDetailsDto(id, name, category.name(), category.getDisplayName(), content, getRating());
    }

    public UserVotedAdviceDetailsDto toUserVotedAdviceDetailsDto() {
        return new UserVotedAdviceDetailsDto(id, name, category.name(), category.getDisplayName(), content);
    }

    public Integer getRating() {
        return userEmailVotes.size();
    }
}
