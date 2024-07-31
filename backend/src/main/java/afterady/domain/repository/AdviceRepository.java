package afterady.domain.repository;

import afterady.domain.advice.Advice;
import afterady.service.advice.AdviceDetailsDto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdviceRepository extends MongoRepository<Advice, String> {

    List<AdviceDetailsDto> findTop10ByOrderByRatingDesc();
}
