package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {
    List<SuggestedCategoryDetailsDto> getUserVotedCategories(String userEmail);

    Optional<SuggestedCategory> getSuggestedCategoryDetails(UUID categoryId);

    Optional<SuggestedCategory> voteSuggestedCategory(UUID id, String userEmail, boolean voteUp);
}
