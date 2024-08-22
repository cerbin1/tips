package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.SuggestedAdviceRepository;
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
import java.util.Set;
import java.util.UUID;

import static afterady.TestUtils.*;
import static afterady.domain.advice.Advice.ADVICE_COLLECTION;
import static afterady.domain.advice.AdviceCategory.HOME;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
class AdviceServiceImplTest {

    @Mock
    private SuggestedAdviceRepository suggestedAdviceRepository;
    @Mock
    private AdviceRepository adviceRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    private AdviceService adviceService;

    @BeforeEach
    public void setUp() {
        adviceService = new AdviceServiceImpl(suggestedAdviceRepository, adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldCreateSuggestedAdvice() {
        // act
        adviceService.createSuggestedAdvice("63b4072b-b8c8-4f9a-acf4-76d0948adc6e", "name", HOME, "content");

        // assert
        verify(suggestedAdviceRepository, times(1)).save(any());
        verifyNoMoreInteractions(suggestedAdviceRepository);
    }

    @Test
    public void shouldGetRandomAdvice() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(new Advice(UUID_1, "name", HOME, "content", generateTestVotes(1))), new Document()));
        // act
        AdviceDetailsDto advice = adviceService.getRandomAdvice();

        // assert
        assertNotNull(advice);
        assertEquals("name", advice.name());
        assertEquals("HOME", advice.categoryName());
        assertEquals("Dom", advice.categoryDisplayName());
        assertEquals("content", advice.content());
        assertEquals(1, advice.rating());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(mongoTemplate);
    }

    @Test
    public void shouldGetTopAdvices() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(
                        new Advice(UUID.randomUUID(), "name 1", HOME, "content 1", generateTestVotes(5)),
                        new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", generateTestVotes(4)),
                        new Advice(UUID.randomUUID(), "name 3", HOME, "content 3", generateTestVotes(3)),
                        new Advice(UUID.randomUUID(), "name 4", HOME, "content 4", generateTestVotes(2)),
                        new Advice(UUID.randomUUID(), "name 5", HOME, "content 5", generateTestVotes(1))
                ), new Document()));

        // act
        List<AdviceDetailsDto> topAdvices = adviceService.getTopTenAdvices();

        // assert
        assertEquals(5, topAdvices.size());
        AdviceDetailsDto first = topAdvices.get(0);
        AdviceDetailsDto last = topAdvices.get(4);
        assertEquals("name 1", first.name());
        assertEquals(5, first.rating());
        assertEquals("name 5", last.name());
        assertEquals(1, last.rating());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(adviceRepository);
    }

    @Test
    public void shouldGetAdviceById() {
        // arrange
        when(adviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(new Advice(UUID_1, "name", HOME, "content", generateTestVotes(1))));

        // act
        Optional<Advice> maybeAdvice = adviceService.getAdviceById(UUID_1);

        // assert
        assertTrue(maybeAdvice.isPresent());
        Advice adviceDetails = maybeAdvice.get();
        assertEquals(UUID_1, adviceDetails.getId());
        assertEquals("name", adviceDetails.getName());
        assertEquals("Dom", adviceDetails.getCategory().getDisplayName());
        assertEquals("HOME", adviceDetails.getCategory().name());
        assertEquals("content", adviceDetails.getContent());
        assertEquals(1, adviceDetails.getRating());
        verify(adviceRepository, times(1)).findById(eq(UUID_1));
        verifyNoMoreInteractions(adviceRepository);
    }

    @Test
    public void shouldIncreaseAdviceRating() {
        // arrange
        Advice advice = new Advice(UUID_1, "name", HOME, "content", generateTestVotes(1));
        when(adviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(advice));
        when(adviceRepository.save(advice)).thenReturn(advice);

        // act
        adviceService.increaseAdviceRating(UUID_1, TEST_EMAIL);

        // assert
        assertEquals(2, advice.getRating());
        verify(adviceRepository, times(1)).findById(eq(UUID_1));
        verify(adviceRepository, times(1)).save(advice);
        verifyNoMoreInteractions(adviceRepository);
    }

    @Test
    public void shouldGetListOfUserVotedAdvices() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(
                        new Advice(UUID.randomUUID(), "name 1", HOME, "content 1", Set.of(TEST_EMAIL)),
                        new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", Set.of(TEST_EMAIL)),
                        new Advice(UUID.randomUUID(), "name 3", HOME, "content 3", Set.of(TEST_EMAIL)),
                        new Advice(UUID.randomUUID(), "name 4", HOME, "content 4", Set.of(TEST_EMAIL)),
                        new Advice(UUID.randomUUID(), "name 5", HOME, "content 5", Set.of(TEST_EMAIL))
                ), new Document()));

        // act
        List<UserVotedAdviceDetailsDto> userVotedAdvices = adviceService.getUserVotedAdvices(TEST_EMAIL);

        // assert
        assertEquals(5, userVotedAdvices.size());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(mongoTemplate);
    }

    @Test
    public void shouldGetAdvicesCountByCategory() {
        // arrange
        when(adviceRepository.countByCategory(HOME)).thenReturn(5);

        // act
        int advicesCount = adviceService.getAdvicesCountByCategory(HOME);

        // assert
        assertEquals(5, advicesCount);
    }
}
