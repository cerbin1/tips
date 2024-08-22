package afterady.controller;

import afterady.domain.repository.CategoriesStatisticsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoriesStatisticsController {
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;

    public CategoriesStatisticsController(CategoriesStatisticsRepository categoriesStatisticsRepository) {
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
    }

    @GetMapping("/categories-statistics")
    public ResponseEntity<?> getCategoriesStatistics() {
        return ResponseEntity.ok(categoriesStatisticsRepository.findAll());
    }

}
