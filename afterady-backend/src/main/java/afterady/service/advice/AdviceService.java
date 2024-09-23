package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.advice.category.AdviceCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AdviceService {

    void createSuggestedAdvice(UUID id, String name, AdviceCategory adviceCategory, String content, Long creatorId);

    AdviceDetailsDto getRandomAdvice();

    List<AdviceDetailsDto> getTopTenAdvices();

    Optional<Advice> getAdviceById(UUID id);

    Optional<Advice> voteAdvice(UUID adviceId, String userEmail);

    List<VotedAdviceDetailsDto> getUserVotedAdvices(String userEmail);

    int getAdvicesCountByCategory(AdviceCategory category);

    List<AdviceDetailsDto> getAdvicesBy(AdviceCategory category);

    List<SuggestedAdvice> getUserSuggestedAdvices(Long userId);

    List<SuggestedAdvice> getSuggestedAdvices();

    Optional<SuggestedAdvice> getSuggestedAdviceById(UUID id);

    Optional<SuggestedAdvice> voteSuggestedAdvice(UUID id, String userEmail, boolean voteUp);

    List<SuggestedAdviceDetailsDto> getUserVotedSuggestedAdvices(String userEmail);
}
