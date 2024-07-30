package afterady.service.advice;

import afterady.domain.advice.AdviceCategory;

public interface AdviceService {

    void createSuggestedAdvice(String id, String name, AdviceCategory adviceCategory, String content);

    AdviceDetailsDto getRandomAdvice();
}
