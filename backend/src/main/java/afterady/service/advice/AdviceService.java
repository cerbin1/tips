package afterady.service.advice;

import afterady.domain.advice.AdviceCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdviceService {

    void createSuggestedAdvice(String id, String name, AdviceCategory adviceCategory, String content);

    AdviceDetailsDto getRandomAdvice();

    List<AdviceDetailsDto> getTopTenAdvices();

    Optional<AdviceDetailsDto> getAdviceById(UUID id);
}
