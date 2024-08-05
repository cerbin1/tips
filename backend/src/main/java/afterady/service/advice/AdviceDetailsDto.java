package afterady.service.advice;

import java.util.UUID;

public record AdviceDetailsDto(UUID id, String name, String categoryName, String categoryDisplayName, String content, Integer rating) {
}
