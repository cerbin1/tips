package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;
import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;

import static afterady.TestUtils.TEST_EMAIL;
import static afterady.TestUtils.generateTestVotes;
import static afterady.domain.advice.category.SuggestedCategory.SUGGESTED_CATEGORY_COLLECTION;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class CategoryServiceImplTest {
    private CategoryService categoryService;

    @Mock
    private MongoTemplate mongoTemplate;

    @BeforeEach
    public void init() {
        categoryService = new CategoryServiceImpl(mongoTemplate);
    }

    @Test
    public void shouldGetListOfSuggestedCategoriesVotedByUser() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(SUGGESTED_CATEGORY_COLLECTION), eq(SuggestedCategory.class)))
                .thenReturn(new AggregationResults<>(List.of(
                        new SuggestedCategory(UUID.randomUUID(), "name 1", 1L, generateTestVotes(5), generateTestVotes(5)),
                        new SuggestedCategory(UUID.randomUUID(), "name 2", 1L, generateTestVotes(4), generateTestVotes(4)),
                        new SuggestedCategory(UUID.randomUUID(), "name 3", 1L, generateTestVotes(3), generateTestVotes(3)),
                        new SuggestedCategory(UUID.randomUUID(), "name 4", 1L, generateTestVotes(2), generateTestVotes(2)),
                        new SuggestedCategory(UUID.randomUUID(), "name 5", 1L, generateTestVotes(1), generateTestVotes(1))
                ), new Document()));

        // act
        List<SuggestedCategoryDetailsDto> userVotedCategories = categoryService.getCategoriesVotedByUser(TEST_EMAIL);

        // assert
        assertEquals(5, userVotedCategories.size());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(SUGGESTED_CATEGORY_COLLECTION), eq(SuggestedCategory.class));
        verifyNoMoreInteractions(mongoTemplate);

    }
}