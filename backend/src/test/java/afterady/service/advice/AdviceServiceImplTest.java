package afterady.service.advice;

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

import static afterady.domain.advice.Advice.ADVICE_COLLECTION;
import static afterady.domain.advice.AdviceCategory.HOME;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
        AdviceDetailsDto adviceDetailsDto = new AdviceDetailsDto("name", "category", "content");
        when(mongoTemplate.aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(AdviceDetailsDto.class)))
                .thenReturn(new AggregationResults<>(List.of(adviceDetailsDto), new Document()));

        // act
        AdviceDetailsDto advice = adviceService.getRandomAdvice();

        // assert
        assertNotNull(advice);
        assertEquals("name", advice.name());
        assertEquals("category", advice.category());
        assertEquals("content", advice.content());
        verify(mongoTemplate, times(1)).aggregate(any(Aggregation.class), eq(ADVICE_COLLECTION), eq(AdviceDetailsDto.class));
        verifyNoMoreInteractions(mongoTemplate);
    }
}
