package afterady.domain.advice;

import afterady.service.advice.AdviceDetailsDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

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
    private int rating;

    public void increaseRating() {
        this.rating++;
    }

    public AdviceDetailsDto toAdviceDetailsDto() {
        return new AdviceDetailsDto(id, name, category.name(), category.getDisplayName(), content, rating);
    }
}
