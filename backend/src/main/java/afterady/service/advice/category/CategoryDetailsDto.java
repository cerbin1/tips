package afterady.service.advice.category;

import afterady.service.advice.AdviceDetailsDto;

import java.util.List;

public record CategoryDetailsDto(String categoryDisplayName, int advicesCount, List<AdviceDetailsDto> advices) {
}
