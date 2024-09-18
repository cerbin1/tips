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
import afterady.service.advice.category.CategoryService;
import afterady.service.advice.category.SuggestedCategoryDetailsDto;
import afterady.service.captcha.CaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.Collections.emptySet;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.unprocessableEntity;

@RestController
public class CategoryController {
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;
    private final AdviceService adviceService;
    private final CaptchaService captchaService;
    private final AuthUtil authUtil;
    private final SuggestedCategoryRepository suggestedCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public CategoryController(CategoriesStatisticsRepository categoriesStatisticsRepository,
                              AdviceService adviceService,
                              CaptchaService captchaService,
                              AuthUtil authUtil,
                              SuggestedCategoryRepository suggestedCategoryRepository,
                              CategoryRepository categoryRepository,
                              CategoryService categoryService) {
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
        this.adviceService = adviceService;
        this.captchaService = captchaService;
        this.authUtil = authUtil;
        this.suggestedCategoryRepository = suggestedCategoryRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
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
            return unprocessableEntity().body(new MessageResponse("Error: captcha is not valid."));
        }
        Long creatorId = authUtil.getLoggedUserId();
        suggestedCategoryRepository.save(new SuggestedCategory(UUID.randomUUID(), name, creatorId, emptySet(), emptySet()));
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

    @GetMapping("/categories/user-suggested")
    public ResponseEntity<List<SuggestedCategory>> getUserSuggestedCategories() {
        Long creatorId = authUtil.getLoggedUserId();
        return ResponseEntity.ok(suggestedCategoryRepository.findByCreatorId(creatorId));
    }

    @GetMapping("/categories/suggested-voted")
    public ResponseEntity<List<SuggestedCategoryDetailsDto>> getUserVotedSuggestedCategories(@RequestParam String userEmail) {
        return ResponseEntity.ok(categoryService.getCategoriesVotedByUser(userEmail));
    }

    @GetMapping("/advices/categories/suggested")
    public ResponseEntity<?> getSuggestedCategories() {
        return ResponseEntity.ok(suggestedCategoryRepository.findAll());
    }

    @GetMapping("/advices/categories/suggested/{id}")
    public ResponseEntity<?> getSuggestedCategoryById(@PathVariable UUID id) {
        Optional<SuggestedCategory> maybeCategory = categoryService.getSuggestedCategoryDetails(id);
        if (maybeCategory.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Suggested category with id %s not found!", id.toString())), NOT_FOUND);
        }
        return ResponseEntity.ok(maybeCategory.get().toSuggestedCategoryDetailsDto());
    }

    @PostMapping("/categories/suggested/{categoryId}/rate")
    public ResponseEntity<?> rateSuggestedCategory(@PathVariable UUID categoryId, @RequestBody String userEmail, @RequestParam boolean rateType) {
        Optional<SuggestedCategory> maybeCategory = categoryService.getSuggestedCategoryDetails(categoryId);
        if (maybeCategory.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Suggested category with id %s not found!", categoryId.toString())), NOT_FOUND);
        }
        Optional<SuggestedCategory> updatedCategory = categoryService.rateSuggestedCategory(categoryId, userEmail, rateType);
        if (updatedCategory.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Could not rate category with id %s", categoryId.toString())), INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<>(updatedCategory.get().toSuggestedCategoryDetailsDto(), OK);
        }
    }

    @GetMapping("/categories/suggested/{categoryId}/rated")
    public ResponseEntity<UserRatingResultResponse> checkUserRatedSuggestedCategory(@RequestParam String userEmail, @PathVariable UUID categoryId) {
        Optional<SuggestedCategory> maybeSuggestedCategory = categoryService.getSuggestedCategoryDetails(categoryId);
        if (maybeSuggestedCategory.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        SuggestedCategory suggestedCategory = maybeSuggestedCategory.get();
        boolean userRatedAdvice = suggestedCategory.userVoted(userEmail);
        return new ResponseEntity<>(new UserRatingResultResponse(userRatedAdvice), OK);
    }

    record MessageResponse(String message) {
    }
}
