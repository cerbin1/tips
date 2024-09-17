package afterady.service.advice.category;

import java.util.UUID;

public record SuggestedCategoryDetailsDto(UUID id, String name, int rating) {
}
