package afterady.domain.repository;

import afterady.domain.advice.category.SuggestedCategory;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SuggestedCategoryRepository extends CrudRepository<SuggestedCategory, UUID> {

    List<SuggestedCategory> findByCreatorId(Long creatorId);
}
