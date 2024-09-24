package afterady.service.advice;

import java.util.UUID;

public record SuggestedAdviceDetailsDto(UUID id, String name, String categoryDisplayName, String content,
                                        String source, Integer rating) {
}