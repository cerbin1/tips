package afterady.controller;

import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
import afterady.security.auth.AuthUtil;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import afterady.service.advice.UserVotedAdviceDetailsDto;
import afterady.service.captcha.CaptchaService;
import org.bson.types.ObjectId;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static afterady.domain.advice.category.AdviceCategory.isValid;
import static afterady.domain.advice.category.AdviceCategory.valueOf;
import static org.springframework.http.HttpStatus.*;
import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.unprocessableEntity;

@RestController
@RequestMapping("/advices")
public class AdviceController {
    private final AdviceService adviceService;
    private final CaptchaService captchaService;
    private final AuthUtil authUtil;

    public AdviceController(AdviceService adviceService, CaptchaService captchaService, AuthUtil authUtil) {
        this.adviceService = adviceService;
        this.captchaService = captchaService;
        this.authUtil = authUtil;
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
        Long creatorId = authUtil.getLoggedUserId();
        adviceService.createSuggestedAdvice(UUID.randomUUID(), name, valueOf(category), content, creatorId);

        return ResponseEntity.ok().build();
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
        Optional<Advice> maybeAdvice = adviceService.getAdviceById(id);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", id.toString())), NOT_FOUND);
        }
        return ResponseEntity.ok(maybeAdvice.get().toAdviceDetailsDto());
    }

    @PostMapping("/{adviceId}/rate")
    public ResponseEntity<?> rateAdvice(@PathVariable UUID adviceId, @RequestBody String userEmail) {
        Optional<Advice> maybeAdvice = adviceService.getAdviceById(adviceId);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", adviceId.toString())), NOT_FOUND);
        }
        Optional<Advice> updatedAdvice = adviceService.increaseAdviceRating(adviceId, userEmail);
        if (updatedAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Could not rate advice with id %s", adviceId.toString())), INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<>(updatedAdvice.get().toAdviceDetailsDto(), OK);
        }
    }

    @GetMapping("/{adviceId}/rated")
    public ResponseEntity<UserRatingResultResponse> checkUserRatedAdvice(@RequestParam String userEmail, @PathVariable UUID adviceId) {
        Optional<Advice> adviceById = adviceService.getAdviceById(adviceId);
        if (adviceById.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Advice advice = adviceById.get();
        boolean userRatedAdvice = advice.getUserEmailVotes().contains(userEmail);
        return new ResponseEntity<>(new UserRatingResultResponse(userRatedAdvice), OK);
    }

    @GetMapping
    public ResponseEntity<List<UserVotedAdviceDetailsDto>> getUserVotedAdvices(@RequestParam String userEmail) {
        return ResponseEntity.ok(adviceService.getUserVotedAdvices(userEmail));
    }

    @GetMapping("/suggested")
    public ResponseEntity<List<SuggestedAdvice>> getUserSuggestedAdvices() {
        return ResponseEntity.ok(adviceService.getSuggestedAdvices(authUtil.getLoggedUserId()));
    }

    private MessageResponse validationError() {
        return new MessageResponse("Error: validation failed.");
    }

    record MessageResponse(String message) {
    }
}
