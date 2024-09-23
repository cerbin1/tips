package afterady.service.advice;

import java.util.UUID;

public record VotedAdviceDetailsDto(UUID id, String name, String categoryName, String categoryDisplayName,
                                    String content) {
}
