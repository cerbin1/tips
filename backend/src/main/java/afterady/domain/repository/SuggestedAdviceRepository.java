package afterady.domain.repository;

import afterady.domain.advice.SuggestedAdvice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuggestedAdviceRepository extends MongoRepository<SuggestedAdvice, String> {
}
