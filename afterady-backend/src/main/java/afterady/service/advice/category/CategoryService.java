package afterady.service.advice.category;

import java.util.List;

public interface CategoryService {
    List<SuggestedCategoryDetailsDto> getCategoriesVotedByUser(String userEmail);
}
