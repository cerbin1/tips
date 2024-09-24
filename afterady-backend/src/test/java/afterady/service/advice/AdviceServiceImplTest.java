package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
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
import static afterady.domain.advice.SuggestedAdvice.SUGGESTED_ADVICE_COLLECTION;
import static afterady.domain.advice.category.AdviceCategory.HOME;
import static afterady.service.advice.Fixtures.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class AdviceServiceImplTest {

    private AdviceService adviceService;

    @Mock
    private SuggestedAdviceRepository suggestedAdviceRepository;
    @Mock
    private AdviceRepository adviceRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    @BeforeEach
    public void init() {
        adviceService = new AdviceServiceImpl(suggestedAdviceRepository, adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldCreateSuggestedAdvice() {
        // act
        adviceService.createSuggestedAdvice(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"), "name", HOME, "content", "source", 1L);

        // assert
        verify(suggestedAdviceRepository, times(1)).save(any());
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetRandomAdvice() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(new Advice(UUID_1, "name", HOME, "content", "source", generateTestVotes(1))), new Document()));
        // act
        AdviceDetailsDto advice = adviceService.getRandomAdvice();

        // assert
        assertNotNull(advice);
        assertEquals("name", advice.name());
        assertEquals("HOME", advice.categoryName());
        assertEquals("Dom", advice.categoryDisplayName());
        assertEquals("content", advice.content());
        assertEquals("source", advice.source());
        assertEquals(1, advice.rating());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(mongoTemplate);
        verifyNoInteractions(suggestedAdviceRepository, adviceRepository);
    }

    @Test
    public void shouldGetTopAdvices() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(
                        new Advice(UUID.randomUUID(), "name 1", HOME, "content 1", "source", generateTestVotes(1)),
                        new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", "source", generateTestVotes(2))
                ), new Document()));

        // act
        List<AdviceDetailsDto> topAdvices = adviceService.getTopTenAdvices();

        // assert
        assertEquals(2, topAdvices.size());
        AdviceDetailsDto first = topAdvices.get(0);
        assertEquals("name 1", first.name());
        assertEquals("content 1", first.content());
        assertEquals("source", first.source());
        assertEquals(1, first.rating());
        AdviceDetailsDto second = topAdvices.get(1);
        assertEquals("name 2", second.name());
        assertEquals("content 2", second.content());
        assertEquals("source", second.source());
        assertEquals(2, second.rating());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(adviceRepository);
        verifyNoInteractions(suggestedAdviceRepository, adviceRepository);
    }

    @Test
    public void shouldGetAdviceById() {
        // arrange
        when(adviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(new Advice(UUID_1, "name", HOME, "content", "source", generateTestVotes(1))));

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
        assertEquals("source", adviceDetails.getSource());
        assertEquals(1, adviceDetails.getRating());
        verify(adviceRepository, times(1)).findById(eq(UUID_1));
        verifyNoMoreInteractions(adviceRepository);
        verifyNoInteractions(suggestedAdviceRepository, mongoTemplate);
    }

    @Test
    public void shouldVoteAdvice() {
        // arrange
        Advice advice = new Advice(UUID_1, "name", HOME, "content", "source", generateTestVotes(1));
        when(adviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(advice));
        when(adviceRepository.save(advice)).thenReturn(advice);

        // act
        Optional<Advice> maybeUpdatedAdvice = adviceService.voteAdvice(UUID_1, TEST_EMAIL);

        // assert
        assertTrue(maybeUpdatedAdvice.isPresent());
        Advice updatedAdvice = maybeUpdatedAdvice.get();
        assertEquals(UUID_1, updatedAdvice.getId());
        assertEquals(2, updatedAdvice.getRating());
        verify(adviceRepository, times(1)).findById(eq(UUID_1));
        verify(adviceRepository, times(1)).save(advice);
        verifyNoMoreInteractions(adviceRepository);
        verifyNoInteractions(suggestedAdviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetListOfVotedAdvices() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class)))
                .thenReturn(new AggregationResults<>(List.of(
                        new Advice(UUID.randomUUID(), "name 1", HOME, "content 1", "source", Set.of(TEST_EMAIL)),
                        new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", "source", Set.of(TEST_EMAIL))
                ), new Document()));

        // act
        List<VotedAdviceDetailsDto> userVotedAdvices = adviceService.getUserVotedAdvices(TEST_EMAIL);

        // assert
        assertEquals(2, userVotedAdvices.size());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(Advice.class));
        verifyNoMoreInteractions(mongoTemplate);
        verifyNoInteractions(suggestedAdviceRepository, adviceRepository);
    }

    @Test
    public void shouldGetAdvicesCountByCategory() {
        // arrange
        when(adviceRepository.countByCategory(HOME)).thenReturn(5);

        // act
        int advicesCount = adviceService.getAdvicesCountByCategory(HOME);

        // assert
        assertEquals(5, advicesCount);
        verify(adviceRepository, times(1)).countByCategory(HOME);
        verifyNoMoreInteractions(adviceRepository);
        verifyNoInteractions(suggestedAdviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetCategoryAdvices() {
        // arrange
        when(adviceRepository.findByCategory(HOME)).thenReturn(List.of(
                new Advice(UUID.randomUUID(), "name 1", HOME, "content 1", "source", generateTestVotes(1)),
                new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", "source", generateTestVotes(2))
        ));

        // act
        List<AdviceDetailsDto> categoryAdvices = adviceService.getAdvicesBy(HOME);

        // assert
        assertEquals(2, categoryAdvices.size());
        assertEquals("name 1", categoryAdvices.get(0).name());
        assertEquals("name 2", categoryAdvices.get(1).name());
        verify(adviceRepository, times(1)).findByCategory(HOME);
        verifyNoMoreInteractions(adviceRepository);
        verifyNoInteractions(suggestedAdviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetUserSuggestedAdvices() {
        // arrange
        var userId = 1L;
        when(suggestedAdviceRepository.findByCreatorId(userId)).thenReturn(SUGGESTED_ADVICES);

        // act
        List<SuggestedAdvice> suggestedAdvices = adviceService.getUserSuggestedAdvices(userId);

        // assert
        assertListOfSuggestedAdvices(suggestedAdvices);
        verify(suggestedAdviceRepository, times(1)).findByCreatorId(userId);
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetSuggestedAdvices() {
        // arrange
        when(suggestedAdviceRepository.findAll()).thenReturn(SUGGESTED_ADVICES);

        // act
        List<SuggestedAdvice> suggestedAdvices = adviceService.getSuggestedAdvices();

        // assert
        assertListOfSuggestedAdvices(suggestedAdvices);
        verify(suggestedAdviceRepository, times(1)).findAll();
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetSuggestedAdviceById() {
        // arrange
        when(suggestedAdviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(SUGGESTED_ADVICE));

        // act
        Optional<SuggestedAdvice> maybeAdvice = adviceService.getSuggestedAdviceById(UUID_1);

        // assert
        assertTrue(maybeAdvice.isPresent());
        SuggestedAdvice adviceDetails = maybeAdvice.get();
        assertEquals(UUID_1, adviceDetails.getId());
        assertEquals("name", adviceDetails.getName());
        assertEquals("Dom", adviceDetails.getCategory().getDisplayName());
        assertEquals("HOME", adviceDetails.getCategory().name());
        assertEquals("content", adviceDetails.getContent());
        assertEquals(0, adviceDetails.getRating());
        verify(suggestedAdviceRepository, times(1)).findById(eq(UUID_1));
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldVoteSuggestedAdviceUp() {
        // arrange
        when(suggestedAdviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(SUGGESTED_ADVICE));
        when(suggestedAdviceRepository.save(SUGGESTED_ADVICE)).thenReturn(SUGGESTED_ADVICE);

        // act
        Optional<SuggestedAdvice> maybeUpdatedAdvice = adviceService.voteSuggestedAdvice(UUID_1, TEST_EMAIL, true);

        // assert
        assertTrue(maybeUpdatedAdvice.isPresent());
        SuggestedAdvice updatedAdvice = maybeUpdatedAdvice.get();
        assertEquals(UUID_1, updatedAdvice.getId());
        assertEquals(1, updatedAdvice.getRating());
        verify(suggestedAdviceRepository, times(1)).findById(eq(UUID_1));
        verify(suggestedAdviceRepository, times(1)).save(SUGGESTED_ADVICE);
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldVoteSuggestedAdviceDown() {
        // arrange
        when(suggestedAdviceRepository.findById(eq(UUID_1)))
                .thenReturn(Optional.of(SUGGESTED_ADVICE));
        when(suggestedAdviceRepository.save(SUGGESTED_ADVICE)).thenReturn(SUGGESTED_ADVICE);

        // act
        Optional<SuggestedAdvice> maybeUpdatedAdvice = adviceService.voteSuggestedAdvice(UUID_1, TEST_EMAIL, false);

        // assert
        assertTrue(maybeUpdatedAdvice.isPresent());
        SuggestedAdvice updatedAdvice = maybeUpdatedAdvice.get();
        assertEquals(UUID_1, updatedAdvice.getId());
        assertEquals(0, updatedAdvice.getRating());
        verify(suggestedAdviceRepository, times(1)).findById(eq(UUID_1));
        verify(suggestedAdviceRepository, times(1)).save(SUGGESTED_ADVICE);
        verifyNoMoreInteractions(suggestedAdviceRepository);
        verifyNoInteractions(adviceRepository, mongoTemplate);
    }

    @Test
    public void shouldGetListOfVotedSuggestedAdvices() {
        // arrange
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(SUGGESTED_ADVICE_COLLECTION), eq(SuggestedAdvice.class)))
                .thenReturn(new AggregationResults<>(VOTED_SUGGESTED_ADVICES, new Document()));

        // act
        List<SuggestedAdviceDetailsDto> userVotedAdvices = adviceService.getUserVotedSuggestedAdvices(TEST_EMAIL);

        // assert
        assertEquals(2, userVotedAdvices.size());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(SUGGESTED_ADVICE_COLLECTION), eq(SuggestedAdvice.class));
        verifyNoMoreInteractions(mongoTemplate);
        verifyNoInteractions(suggestedAdviceRepository, adviceRepository);
    }
}
