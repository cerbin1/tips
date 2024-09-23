package afterady.domain.advice;

import afterady.domain.advice.category.AdviceCategory;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.VotedAdviceDetailsDto;
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
    private Set<String> votes;

    public void addUserVote(String userEmail) {
        votes.add(userEmail);
    }

    public AdviceDetailsDto toAdviceDetailsDto() {
        return new AdviceDetailsDto(id, name, category.name(), category.getDisplayName(), content, getRating());
    }

    public VotedAdviceDetailsDto toUserVotedAdviceDetailsDto() {
        return new VotedAdviceDetailsDto(id, name, category.name(), category.getDisplayName(), content);
    }

    public Integer getRating() {
        return votes.size();
    }
}
