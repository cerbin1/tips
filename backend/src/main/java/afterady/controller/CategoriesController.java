package afterady.controller;

import afterady.domain.advice.AdviceCategory;
import afterady.domain.repository.CategoriesStatisticsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CategoriesController {
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;

    public CategoriesController(CategoriesStatisticsRepository categoriesStatisticsRepository) {
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
    }

    @GetMapping("/categories-statistics")
    public ResponseEntity<?> getCategoriesStatistics() {
        return ResponseEntity.ok(categoriesStatisticsRepository.findAll());
    }

    @GetMapping("/advices/categories")
    public ResponseEntity<?> getAdviceCategories() {
        return ResponseEntity.ok(AdviceCategory.getCategories());
    }
}
