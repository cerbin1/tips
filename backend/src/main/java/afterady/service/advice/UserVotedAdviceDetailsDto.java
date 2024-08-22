package afterady.service.advice;

import java.util.UUID;

public record UserVotedAdviceDetailsDto(UUID id, String name, String categoryName, String categoryDisplayName,
                                        String content) {
}
