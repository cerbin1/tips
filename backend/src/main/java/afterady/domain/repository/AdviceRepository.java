package afterady.domain.repository;

import afterady.domain.advice.Advice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdviceRepository extends MongoRepository<Advice, String> {
}
