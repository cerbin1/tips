package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryService {
    List<SuggestedCategoryDetailsDto> getCategoriesVotedByUser(String userEmail);

    Optional<SuggestedCategory> getSuggestedCategoryDetails(UUID categoryId);

    Optional<SuggestedCategory> rateSuggestedCategory(UUID id, String userEmail, boolean rateUp);
}
