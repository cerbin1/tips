package afterady.service.advice.category;

import afterady.service.advice.AdviceDetailsDto;

import java.util.List;

public record CategoryDetailsDto(String categoryDisplayName, String description, List<AdviceDetailsDto> advices) {
}
