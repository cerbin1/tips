package afterady.service.advice;

import java.util.UUID;

public record AdviceDetailsDto(UUID id, String name, String category, String content, Integer rating) {
}
