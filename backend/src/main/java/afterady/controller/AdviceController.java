package afterady.controller;

import afterady.domain.advice.AdviceCategory;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import afterady.service.captcha.CaptchaService;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static afterady.domain.advice.AdviceCategory.isValid;
import static afterady.domain.advice.AdviceCategory.valueOf;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.unprocessableEntity;

@RestController
@RequestMapping("/advices")
public class AdviceController {
    private final AdviceService adviceService;
    private final CaptchaService captchaService;

    public AdviceController(AdviceService adviceService, CaptchaService captchaService) {
        this.adviceService = adviceService;
        this.captchaService = captchaService;
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
        String captchaToken = request.captchaToken();
        if (captchaToken == null || captchaToken.isBlank()) {
            return badRequest().body(validationError());
        }
        if (name.length() > 30) {
            return unprocessableEntity().body(new MessageResponse("Error: name too long."));
        }
        if (content.length() > 1000) {
            return unprocessableEntity().body(new MessageResponse("Error: content too long."));
        }
        if (!captchaService.isCaptchaTokenValid(captchaToken)) {
            return unprocessableEntity().body(new MessageResponse("Error: captcha is not valid."));
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

    @GetMapping("/ranking")
    public ResponseEntity<List<AdviceDetailsDto>> getTopTenAdvices() {
        return ResponseEntity.ok(adviceService.getTopTenAdvices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdviceById(@PathVariable UUID id) {
        Optional<AdviceDetailsDto> maybeAdvice = adviceService.getAdviceById(id);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", id.toString())), NOT_FOUND);
        }
        return ResponseEntity.ok(maybeAdvice.get());
    }

    private MessageResponse validationError() {
        return new MessageResponse("Error: validation failed.");
    }

    record MessageResponse(String message) {
    }
}
