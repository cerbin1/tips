package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.AdviceCategory;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.SuggestedAdviceRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static afterady.domain.advice.Advice.ADVICE_COLLECTION;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sample;

@Service
public class AdviceServiceImpl implements AdviceService {

    private final SuggestedAdviceRepository suggestedAdviceRepository;
    private final AdviceRepository adviceRepository;
    private final MongoTemplate mongoTemplate;

    public AdviceServiceImpl(SuggestedAdviceRepository suggestedAdviceRepository, AdviceRepository adviceRepository, MongoTemplate mongoTemplate) {
        this.suggestedAdviceRepository = suggestedAdviceRepository;
        this.adviceRepository = adviceRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void createSuggestedAdvice(String id, String name, AdviceCategory category, String content) {
        suggestedAdviceRepository.save(new SuggestedAdvice(id, name, category, content));
    }

    public AdviceDetailsDto getRandomAdvice() {
        Aggregation agg = newAggregation(sample(1));

        AggregationResults<AdviceDetailsDto> advices = mongoTemplate.aggregate(agg, ADVICE_COLLECTION, AdviceDetailsDto.class);

        return advices.getUniqueMappedResult();
    }

    @Override
    public List<AdviceDetailsDto> getTopTenAdvices() {
        return adviceRepository.findTop10ByOrderByRatingDesc();
    }

    @Override
    public Optional<AdviceDetailsDto> getAdviceById(UUID id) {
        Optional<Advice> maybeAdvice = adviceRepository.findById(id);
        if (maybeAdvice.isEmpty()) {
            return Optional.empty();
        }
        Advice advice = maybeAdvice.get();
        return Optional.of(new AdviceDetailsDto(advice.id(), advice.name(), advice.category().getDisplayName(), advice.content(), advice.rating()));
    }
}
