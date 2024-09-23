package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;
import afterady.domain.repository.SuggestedCategoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static afterady.domain.advice.category.SuggestedCategory.SUGGESTED_CATEGORY_COLLECTION;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final MongoTemplate mongoTemplate;
    private final SuggestedCategoryRepository suggestedCategoryRepository;

    public CategoryServiceImpl(MongoTemplate mongoTemplate, SuggestedCategoryRepository suggestedCategoryRepository) {
        this.mongoTemplate = mongoTemplate;
        this.suggestedCategoryRepository = suggestedCategoryRepository;
    }

    @Override
    public List<SuggestedCategoryDetailsDto> getUserVotedCategories(String userEmail) {
        MatchOperation matchStage = match(new Criteria()
                .orOperator(
                        Criteria.where("votesUp").in(userEmail),
                        Criteria.where("votesDown").in(userEmail))
        );
        ProjectionOperation projectStage = project("id", "name", "votesUp", "votesDown");
        SortOperation sortStage = sort(Sort.by(Sort.Direction.DESC, "name"));
        Aggregation aggregation = newAggregation(
                matchStage,
                projectStage,
                sortStage
        );
        AggregationResults<SuggestedCategory> userVotedCategories = mongoTemplate.aggregate(aggregation, SUGGESTED_CATEGORY_COLLECTION, SuggestedCategory.class);
        return userVotedCategories.getMappedResults().stream().map(SuggestedCategory::toSuggestedCategoryDetailsDto).toList();
    }

    @Override
    public Optional<SuggestedCategory> getSuggestedCategoryDetails(UUID categoryId) {
        return suggestedCategoryRepository.findById(categoryId);
    }

    @Override
    public Optional<SuggestedCategory> voteSuggestedCategory(UUID id, String userEmail, boolean voteUp) {
        Optional<SuggestedCategory> maybeSuggestedCategory = suggestedCategoryRepository.findById(id);
        if (maybeSuggestedCategory.isPresent()) {
            SuggestedCategory suggestedCategory = maybeSuggestedCategory.get();
            if (voteUp) {
                suggestedCategory.addUserVoteUp(userEmail);
            } else {
                suggestedCategory.addUserVoteDown(userEmail);
            }
            return Optional.of(suggestedCategoryRepository.save(suggestedCategory));
        }
        return Optional.empty();
    }
}
