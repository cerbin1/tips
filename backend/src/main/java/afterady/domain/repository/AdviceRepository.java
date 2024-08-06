package afterady.domain.repository;

import afterady.domain.advice.Advice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdviceRepository extends MongoRepository<Advice, UUID> {
}
