package afterady.controller;

import afterady.domain.advice.category.AdviceCategory;
import afterady.domain.advice.category.Category;
import afterady.domain.advice.category.SuggestedCategory;
import afterady.domain.repository.CategoriesStatisticsRepository;
import afterady.domain.repository.CategoryRepository;
import afterady.domain.repository.SuggestedCategoryRepository;
import afterady.security.auth.AuthUtil;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import afterady.service.advice.category.CategoryDetailsDto;
import afterady.service.captcha.CaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.http.ResponseEntity.unprocessableEntity;

@RestController
public class CategoryController {
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;
    private final AdviceService adviceService;
    private final CaptchaService captchaService;
    private final AuthUtil authUtil;
    private final SuggestedCategoryRepository suggestedCategoryRepository;
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoriesStatisticsRepository categoriesStatisticsRepository,
                              AdviceService adviceService,
                              CaptchaService captchaService,
                              AuthUtil authUtil,
                              SuggestedCategoryRepository suggestedCategoryRepository,
                              CategoryRepository categoryRepository) {
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
        this.adviceService = adviceService;
        this.captchaService = captchaService;
        this.authUtil = authUtil;
        this.suggestedCategoryRepository = suggestedCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    @PostMapping("/categories")
    public ResponseEntity<?> suggestCategory(@RequestBody SuggestCategoryRequest request) {
        String name = request.name();
        if (name == null || name.isBlank()) {
            return validationErrorResponse();
        }
        String captchaToken = request.captchaToken();
        if (captchaToken == null || captchaToken.isBlank()) {
            return validationErrorResponse();
        }
        if (name.length() > 100) {
            return unprocessableEntity().body(new MessageResponse("Error: name too long."));
        }
        if (!captchaService.isCaptchaTokenValid(captchaToken)) {
            return unprocessableEntity().body(new AdviceController.MessageResponse("Error: captcha is not valid."));
        }
        Long creatorId = authUtil.getLoggedUserId();
        suggestedCategoryRepository.save(new SuggestedCategory(UUID.randomUUID(), name, creatorId));
        return ResponseEntity.ok().build();
    }

    private static ResponseEntity<MessageResponse> validationErrorResponse() {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: validation failed."));
    }

    @GetMapping("/categories-statistics")
    public ResponseEntity<?> getCategoriesStatistics() {
        return ResponseEntity.ok(categoriesStatisticsRepository.findAll());
    }

    @GetMapping("/advices/categories")
    public ResponseEntity<?> getAdviceCategories() {
        return ResponseEntity.ok(AdviceCategory.getCategories());
    }

    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<CategoryDetailsDto> getCategoryDetails(@PathVariable UUID categoryId) {
        Optional<Category> maybeCategory = categoryRepository.findById(categoryId);
        if (maybeCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var category = maybeCategory.get();
        List<AdviceDetailsDto> categoryAdvices = adviceService.getAdvicesBy(category.getEnumValue());
        return ResponseEntity.ok(
                new CategoryDetailsDto(
                        category.getEnumValue().getDisplayName(),
                        category.getDescription(),
                        categoryAdvices));
    }

    record MessageResponse(String message) {
    }
}
