package afterady.controller;

import afterady.domain.advice.AdviceCategory;
import afterady.domain.repository.CategoriesStatisticsRepository;
import afterady.service.advice.AdviceService;
import afterady.service.advice.category.CategoryDetailsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CategoryController {
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;
    private final AdviceService adviceService;

    public CategoryController(CategoriesStatisticsRepository categoriesStatisticsRepository, AdviceService adviceService) {
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
        this.adviceService = adviceService;
    }

    @PostMapping("/categories")
    public ResponseEntity<?> suggestCategory(@RequestBody SuggestCategoryRequest request) {
        String name = request.name();
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Error: validation failed.");
        }

        return null;
    }

    @GetMapping("/categories-statistics")
    public ResponseEntity<?> getCategoriesStatistics() {
        return ResponseEntity.ok(categoriesStatisticsRepository.findAll());
    }

    @GetMapping("/advices/categories")
    public ResponseEntity<?> getAdviceCategories() {
        return ResponseEntity.ok(AdviceCategory.getCategories());
    }

    @GetMapping("/advices/byCategory/{categoryAsString}")
    public ResponseEntity<CategoryDetailsDto> getCategoryDetails(@PathVariable String categoryAsString) {
        if (AdviceCategory.isValid(categoryAsString)) {
            return ResponseEntity.ok(adviceService.getCategoryDetails(AdviceCategory.valueOf(categoryAsString)));
        }
        return ResponseEntity.badRequest().build();
    }
}
