package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.AdviceCategory;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.SuggestedAdviceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
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

        AggregationResults<Advice> advices = mongoTemplate.aggregate(agg, ADVICE_COLLECTION, Advice.class);

        return Objects.requireNonNull(advices.getUniqueMappedResult()).toAdviceDetailsDto();
    }

    @Override
    public List<AdviceDetailsDto> getTopTenAdvices() {
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.DESC, "rating"));
        query.limit(10);
        List<Advice> objects = mongoTemplate.find(query, Advice.class);
        return objects.stream().map(Advice::toAdviceDetailsDto).toList();
    }

    @Override
    public Optional<Advice> getAdviceById(UUID id) {
        return adviceRepository.findById(id);
    }

    @Override
    public Optional<Advice> increaseAdviceRating(UUID adviceId) {
        Optional<Advice> maybeAdvice = adviceRepository.findById(adviceId);
        if (maybeAdvice.isPresent()) {
            Advice advice = maybeAdvice.get();
            advice.increaseRating();
            return Optional.of(adviceRepository.save(advice));
        }
        return Optional.empty();

    }
}
