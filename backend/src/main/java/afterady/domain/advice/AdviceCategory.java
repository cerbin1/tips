package afterady.domain.advice;

import afterady.util.AdviceCategorySerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;

import static java.util.Arrays.stream;

@Getter
@JsonSerialize(using = AdviceCategorySerializer.class)
public enum AdviceCategory {

    PERSONAL_DEVELOPMENT("Rozwój osobisty"),
    HEALTH("Zdrowie"),
    HOME("Dom"),
    FINANCE("Finanse"),
    TECHNOLOGY("Technologia");

    private final String displayName;

    AdviceCategory(String displayName) {
        this.displayName = displayName;
    }

    public static boolean isValid(String category) {
        return stream(values())
                .anyMatch(enumCategory -> enumCategory.name().equals(category));
    }

    public static AdviceCategoryDto[] getCategories() {
        AdviceCategoryDto[] categories = new AdviceCategoryDto[values().length];
        stream(values()).forEach(category -> {
            categories[category.ordinal()] = new AdviceCategoryDto(category.name(), category.getDisplayName());
        });
        return categories;
    }

    public record AdviceCategoryDto(String name, String displayName) {
    }
}
