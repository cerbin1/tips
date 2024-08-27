package afterady.domain.repository;

import afterady.domain.advice.Advice;
import afterady.domain.advice.category.AdviceCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdviceRepository extends MongoRepository<Advice, UUID> {
    int countByCategory(AdviceCategory category);

    List<Advice> findByCategory(AdviceCategory category);
}
