package afterady.service.advice;

import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.advice.category.AdviceCategory;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.SuggestedAdviceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

import static afterady.domain.advice.Advice.ADVICE_COLLECTION;
import static afterady.domain.advice.SuggestedAdvice.SUGGESTED_ADVICE_COLLECTION;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

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
    public void createSuggestedAdvice(UUID id, String name, AdviceCategory category, String content, Long creatorId) {
        suggestedAdviceRepository.save(new SuggestedAdvice(id, name, category, content, creatorId, Collections.emptySet(), Collections.emptySet()));
    }

    public AdviceDetailsDto getRandomAdvice() {
        Aggregation agg = newAggregation(sample(1));

        AggregationResults<Advice> advices = mongoTemplate.aggregate(agg, ADVICE_COLLECTION, Advice.class);

        return Objects.requireNonNull(advices.getUniqueMappedResult()).toAdviceDetailsDto();
    }

    @Override
    public List<AdviceDetailsDto> getTopTenAdvices() {
        ProjectionOperation projectStage = project("name", "category", "content", "votes")
                .andExpression("size(votes)").as("rating");
        SortOperation sortStage = sort(Sort.by(Sort.Direction.DESC, "rating"));
        Aggregation aggregation = newAggregation(
                projectStage,
                sortStage,
                limit(10)
        );
        AggregationResults<Advice> topAdvices = mongoTemplate.aggregate(aggregation, ADVICE_COLLECTION, Advice.class);
        return topAdvices.getMappedResults().stream().map(Advice::toAdviceDetailsDto).toList();
    }

    @Override
    public Optional<Advice> getAdviceById(UUID id) {
        return adviceRepository.findById(id);
    }

    @Override
    public Optional<Advice> voteAdvice(UUID adviceId, String userEmail) {
        Optional<Advice> maybeAdvice = adviceRepository.findById(adviceId);
        if (maybeAdvice.isPresent()) {
            Advice advice = maybeAdvice.get();
            advice.addUserVote(userEmail);
            return Optional.of(adviceRepository.save(advice));
        }
        return Optional.empty();

    }

    @Override
    public List<VotedAdviceDetailsDto> getUserVotedAdvices(String userEmail) {
        MatchOperation matchStage = match(Criteria.where("votes").in(userEmail));
        ProjectionOperation projectStage = project("name", "category", "content");
        SortOperation sortStage = sort(Sort.by(Sort.Direction.DESC, "name"));
        Aggregation aggregation = newAggregation(
                matchStage,
                projectStage,
                sortStage
        );
        AggregationResults<Advice> userVotedAdvices = mongoTemplate.aggregate(aggregation, ADVICE_COLLECTION, Advice.class);
        return userVotedAdvices.getMappedResults().stream().map(Advice::toUserVotedAdviceDetailsDto).toList();
    }

    @Override
    public int getAdvicesCountByCategory(AdviceCategory category) {
        return adviceRepository.countByCategory(category);
    }

    @Override
    public List<AdviceDetailsDto> getAdvicesBy(AdviceCategory category) {
        return adviceRepository.findByCategory(category).stream().map(Advice::toAdviceDetailsDto).toList();
    }

    @Override
    public List<SuggestedAdvice> getUserSuggestedAdvices(Long userId) {
        return suggestedAdviceRepository.findByCreatorId(userId);
    }

    @Override
    public List<SuggestedAdvice> getSuggestedAdvices() {
        return suggestedAdviceRepository.findAll();
    }

    @Override
    public Optional<SuggestedAdvice> getSuggestedAdviceById(UUID id) {
        return suggestedAdviceRepository.findById(id);
    }

    @Override
    public Optional<SuggestedAdvice> voteSuggestedAdvice(UUID id, String userEmail, boolean voteUp) {
        Optional<SuggestedAdvice> maybeAdvice = suggestedAdviceRepository.findById(id);
        if (maybeAdvice.isPresent()) {
            SuggestedAdvice suggestedAdvice = maybeAdvice.get();
            if (voteUp) {
                suggestedAdvice.addUserVoteUp(userEmail);
            } else {
                suggestedAdvice.addUserVoteDown(userEmail);
            }
            return Optional.of(suggestedAdviceRepository.save(suggestedAdvice));
        }
        return Optional.empty();
    }

    @Override
    public List<SuggestedAdviceDetailsDto> getUserVotedSuggestedAdvices(String userEmail) {
        MatchOperation matchStage = match(new Criteria()
                .orOperator(
                        Criteria.where("votesUp").in(userEmail),
                        Criteria.where("votesDown").in(userEmail))
        );
        ProjectionOperation projectStage = project("name", "category", "content", "votesUp", "votesDown");
        SortOperation sortStage = sort(Sort.by(Sort.Direction.DESC, "name"));
        Aggregation aggregation = newAggregation(
                matchStage,
                projectStage,
                sortStage
        );
        AggregationResults<SuggestedAdvice> userVotedAdvices = mongoTemplate.aggregate(aggregation, SUGGESTED_ADVICE_COLLECTION, SuggestedAdvice.class);
        return userVotedAdvices.getMappedResults().stream().map(SuggestedAdvice::toSuggestedAdviceDetailsDto).toList();
    }
}
