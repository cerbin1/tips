package afterady.domain.repository;

import afterady.domain.advice.CategoriesStatistics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoriesStatisticsRepository extends MongoRepository<CategoriesStatistics, UUID> {
}
