package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

import static afterady.domain.advice.category.SuggestedCategory.SUGGESTED_CATEGORY_COLLECTION;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class CategoryServiceImpl implements CategoryService {
    private final MongoTemplate mongoTemplate;

    public CategoryServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<SuggestedCategoryDetailsDto> getCategoriesVotedByUser(String userEmail) {
        MatchOperation matchStage = match(new Criteria()
                .orOperator(
                        Criteria.where("userEmailVotesUp").in(userEmail),
                        Criteria.where("userEmailVotesDown").in(userEmail))
        );
        ProjectionOperation projectStage = project("id", "name", "userEmailVotesUp", "userEmailVotesDown");
        SortOperation sortStage = sort(Sort.by(Sort.Direction.DESC, "name"));
        Aggregation aggregation = newAggregation(
                matchStage,
                projectStage,
                sortStage
        );
        AggregationResults<SuggestedCategory> userVotedCategories = mongoTemplate.aggregate(aggregation, SUGGESTED_CATEGORY_COLLECTION, SuggestedCategory.class);
        return userVotedCategories.getMappedResults().stream().map(SuggestedCategory::toSuggestedCategoryDetailsDto).toList();
    }
}
