package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.category.AdviceCategory;
import afterady.domain.advice.SuggestedAdvice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdviceService {

    void createSuggestedAdvice(UUID id, String name, AdviceCategory adviceCategory, String content, Long creatorId);

    AdviceDetailsDto getRandomAdvice();

    List<AdviceDetailsDto> getTopTenAdvices();

    Optional<Advice> getAdviceById(UUID id);

    Optional<Advice> increaseAdviceRating(UUID adviceId, String userEmail);

    List<UserVotedAdviceDetailsDto> getUserVotedAdvices(String userEmail);

    int getAdvicesCountByCategory(AdviceCategory category);

    List<AdviceDetailsDto> getAdvicesBy(AdviceCategory category);

    List<SuggestedAdvice> getSuggestedAdvices(Long userId);
}
