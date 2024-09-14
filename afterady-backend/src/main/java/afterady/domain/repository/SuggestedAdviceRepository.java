package afterady.domain.repository;

import afterady.domain.advice.SuggestedAdvice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SuggestedAdviceRepository extends MongoRepository<SuggestedAdvice, UUID> {
    List<SuggestedAdvice> findByCreatorId(long userId);
}
