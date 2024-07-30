package afterady.controller;

import afterady.domain.advice.AdviceCategory;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static afterady.domain.advice.AdviceCategory.isValid;
import static afterady.domain.advice.AdviceCategory.valueOf;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.unprocessableEntity;

@RestController
@RequestMapping("/advices")
public class AdviceController {
    private final AdviceService adviceService;

    public AdviceController(AdviceService adviceService) {
        this.adviceService = adviceService;
    }

    @PostMapping
    public ResponseEntity<?> suggestAdvice(@RequestBody SuggestAdviceRequest request) {
        String name = request.name();
        if (name == null || name.isBlank()) {
            return badRequest().body(validationError());
        }
        String category = request.category();
        if (category == null || category.isBlank()) {
            return badRequest().body(validationError());
        }
        if (!isValid(category)) {
            return badRequest().body(validationError());
        }
        String content = request.content();
        if (content == null || content.isBlank()) {
            return badRequest().body(validationError());
        }
        if (name.length() > 30) {
            return unprocessableEntity().body(new MessageResponse("Error: name too long."));
        }
        if (content.length() > 1000) {
            return unprocessableEntity().body(new MessageResponse("Error: content too long."));
        }
        adviceService.createSuggestedAdvice(ObjectId.get().toString(), name, valueOf(category), content);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAdviceCategories() {
        return ResponseEntity.ok(AdviceCategory.getCategories());
    }

    @GetMapping("/random")
    public ResponseEntity<AdviceDetailsDto> getRandomAdvice() {
        return ResponseEntity.ok(adviceService.getRandomAdvice());
    }

    private MessageResponse validationError() {
        return new MessageResponse("Error: validation failed.");
    }

    record MessageResponse(String message) {
    }
}
