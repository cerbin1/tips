package afterady.service.advice.category;

import afterady.domain.advice.category.SuggestedCategory;
import afterady.domain.repository.SuggestedCategoryRepository;
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
import java.util.Optional;
import java.util.UUID;

import static afterady.TestUtils.*;
import static afterady.domain.advice.category.SuggestedCategory.SUGGESTED_CATEGORY_COLLECTION;
import static java.util.Collections.emptySet;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class CategoryServiceImplTest {
    private CategoryService categoryService;

    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private SuggestedCategoryRepository suggestedCategoryRepository;

    @BeforeEach
    public void init() {
        categoryService = new CategoryServiceImpl(mongoTemplate, suggestedCategoryRepository);
    }

    @Test
    public void shouldGetListOfVotedSuggestedCategories() {
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
        List<SuggestedCategoryDetailsDto> userVotedCategories = categoryService.getUserVotedCategories(TEST_EMAIL);

        // assert
        assertEquals(5, userVotedCategories.size());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(SUGGESTED_CATEGORY_COLLECTION), eq(SuggestedCategory.class));
        verifyNoMoreInteractions(mongoTemplate);
    }

    @Test
    public void shouldGetSuggestedCategoryDetails() {
        // arrange
        when(suggestedCategoryRepository.findById(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(5), generateTestVotes(5))));

        // act
        Optional<SuggestedCategory> maybeSuggestedCategoryDetails = categoryService.getSuggestedCategoryDetails(UUID_1);

        // assert
        assertTrue(maybeSuggestedCategoryDetails.isPresent());
        var suggestedCategoryDetails = maybeSuggestedCategoryDetails.get();
        assertEquals(UUID_1, suggestedCategoryDetails.getId());
        assertEquals("name", suggestedCategoryDetails.getName());
        assertEquals(0, suggestedCategoryDetails.getRating());
        verify(suggestedCategoryRepository, times(1)).findById(UUID_1);
        verifyNoMoreInteractions(suggestedCategoryRepository);
        verifyNoInteractions(mongoTemplate);
    }

    @Test
    public void shouldVoteSuggestedCategoryUp() {
        // arrange
        SuggestedCategory suggestedCategory = new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(1), emptySet());
        when(suggestedCategoryRepository.findById(eq(UUID_1))).thenReturn(Optional.of(suggestedCategory));
        when(suggestedCategoryRepository.save(suggestedCategory)).thenReturn(suggestedCategory);

        // act
        Optional<SuggestedCategory> maybeUpdatedCategory = categoryService.voteSuggestedCategory(UUID_1, TEST_EMAIL, true);

        // assert
        assertTrue(maybeUpdatedCategory.isPresent());
        SuggestedCategory updatedCategory = maybeUpdatedCategory.get();
        assertEquals(UUID_1, updatedCategory.getId());
        assertEquals(2, updatedCategory.getRating());
        verify(suggestedCategoryRepository, times(1)).findById(eq(UUID_1));
        verify(suggestedCategoryRepository, times(1)).save(suggestedCategory);
        verifyNoMoreInteractions(suggestedCategoryRepository);
        verifyNoInteractions(mongoTemplate);
    }

    @Test
    public void shouldVoteSuggestedCategoryDown() {
        // arrange
        SuggestedCategory suggestedCategory = new SuggestedCategory(UUID_1, "name", 1L, emptySet(), generateTestVotes(1));
        when(suggestedCategoryRepository.findById(eq(UUID_1))).thenReturn(Optional.of(suggestedCategory));
        when(suggestedCategoryRepository.save(suggestedCategory)).thenReturn(suggestedCategory);

        // act
        Optional<SuggestedCategory> maybeUpdatedCategory = categoryService.voteSuggestedCategory(UUID_1, TEST_EMAIL, false);

        // assert
        assertTrue(maybeUpdatedCategory.isPresent());
        SuggestedCategory updatedCategory = maybeUpdatedCategory.get();
        assertEquals(UUID_1, updatedCategory.getId());
        assertEquals(-2, updatedCategory.getRating());
        verify(suggestedCategoryRepository, times(1)).findById(eq(UUID_1));
        verify(suggestedCategoryRepository, times(1)).save(suggestedCategory);
        verifyNoMoreInteractions(suggestedCategoryRepository);
        verifyNoInteractions(mongoTemplate);
    }
}