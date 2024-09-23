package afterady.controller;

import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
import afterady.security.auth.AuthUtil;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import afterady.service.advice.SuggestedAdviceDetailsDto;
import afterady.service.advice.VotedAdviceDetailsDto;
import afterady.service.captcha.CaptchaService;
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
public class AdviceController {
    private final AdviceService adviceService;
    private final CaptchaService captchaService;
    private final AuthUtil authUtil;

    public AdviceController(AdviceService adviceService, CaptchaService captchaService, AuthUtil authUtil) {
        this.adviceService = adviceService;
        this.captchaService = captchaService;
        this.authUtil = authUtil;
    }

    @GetMapping("/advices/random")
    public ResponseEntity<AdviceDetailsDto> getRandomAdvice() {
        return ResponseEntity.ok(adviceService.getRandomAdvice());
    }

    @GetMapping("/advices/ranking")
    public ResponseEntity<List<AdviceDetailsDto>> getTopTenAdvices() {
        return ResponseEntity.ok(adviceService.getTopTenAdvices());
    }

    @GetMapping("/advices/{id}")
    public ResponseEntity<?> getAdviceById(@PathVariable UUID id) {
        Optional<Advice> maybeAdvice = adviceService.getAdviceById(id);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", id.toString())), NOT_FOUND);
        }
        return ResponseEntity.ok(maybeAdvice.get().toAdviceDetailsDto());
    }

    @PostMapping("/advices/{adviceId}/vote")
    public ResponseEntity<?> voteAdvice(@PathVariable UUID adviceId, @RequestBody String userEmail) {
        Optional<Advice> maybeAdvice = adviceService.getAdviceById(adviceId);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", adviceId.toString())), NOT_FOUND);
        }
        Optional<Advice> updatedAdvice = adviceService.voteAdvice(adviceId, userEmail);
        if (updatedAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Could not vote advice with id %s", adviceId.toString())), INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<>(updatedAdvice.get().toAdviceDetailsDto(), OK);
        }
    }

    @GetMapping("/advices/{adviceId}/vote/check")
    public ResponseEntity<UserVotedCheckResponse> checkUserVotedAdvice(@RequestParam String userEmail, @PathVariable UUID adviceId) {
        Optional<Advice> adviceById = adviceService.getAdviceById(adviceId);
        if (adviceById.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Advice advice = adviceById.get();
        boolean userVotedAdvice = advice.userVoted(userEmail);
        return new ResponseEntity<>(new UserVotedCheckResponse(userVotedAdvice), OK);
    }

    @PostMapping("/advices/suggested")
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
        String source = request.source();
        if (source == null) {
            source = "";
        }
        Long creatorId = authUtil.getLoggedUserId();
        adviceService.createSuggestedAdvice(UUID.randomUUID(), name, valueOf(category), content, source, creatorId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/advices/suggested")
    public ResponseEntity<List<SuggestedAdvice>> getSuggestedAdvices() {
        return ResponseEntity.ok(adviceService.getSuggestedAdvices());
    }

    @GetMapping("/advices/suggested/{id}")
    public ResponseEntity<?> getSuggestedAdviceById(@PathVariable UUID id) {
        Optional<SuggestedAdvice> maybeAdvice = adviceService.getSuggestedAdviceById(id);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Suggested advice with id %s not found!", id.toString())), NOT_FOUND);
        }
        return ResponseEntity.ok(maybeAdvice.get().toSuggestedAdviceDetailsDto());
    }

    @PostMapping("/advices/suggested/{adviceId}/vote")
    public ResponseEntity<?> voteSuggestedAdvice(@PathVariable UUID adviceId, @RequestBody String userEmail, @RequestParam boolean voteType) {
        Optional<SuggestedAdvice> maybeAdvice = adviceService.getSuggestedAdviceById(adviceId);
        if (maybeAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Advice with id %s not found!", adviceId.toString())), NOT_FOUND);
        }
        Optional<SuggestedAdvice> updatedAdvice = adviceService.voteSuggestedAdvice(adviceId, userEmail, voteType);
        if (updatedAdvice.isEmpty()) {
            return new ResponseEntity<>(new MessageResponse(String.format("Could not vote advice with id %s", adviceId.toString())), INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<>(updatedAdvice.get().toSuggestedAdviceDetailsDto(), OK);
        }
    }

    @GetMapping("/advices/suggested/{adviceId}/vote/check")
    public ResponseEntity<UserVotedCheckResponse> checkUserVotedSuggestedAdvice(@RequestParam String userEmail, @PathVariable UUID adviceId) {
        Optional<SuggestedAdvice> adviceById = adviceService.getSuggestedAdviceById(adviceId);
        if (adviceById.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        SuggestedAdvice suggestedAdvice = adviceById.get();
        boolean userVotedAdvice = suggestedAdvice.userVoted(userEmail);
        return new ResponseEntity<>(new UserVotedCheckResponse(userVotedAdvice), OK);
    }

    @GetMapping("/users/advices/voted")
    public ResponseEntity<List<VotedAdviceDetailsDto>> getUserVotedAdvices(@RequestParam String userEmail) {
        return ResponseEntity.ok(adviceService.getUserVotedAdvices(userEmail));
    }

    @GetMapping("/users/advices/suggested")
    public ResponseEntity<List<SuggestedAdvice>> getUserSuggestedAdvices() {
        return ResponseEntity.ok(adviceService.getUserSuggestedAdvices(authUtil.getLoggedUserId()));
    }

    @GetMapping("/users/advices/suggested/voted")
    public ResponseEntity<List<SuggestedAdviceDetailsDto>> getUserVotedSuggestedAdvices(@RequestParam String userEmail) {
        return ResponseEntity.ok(adviceService.getUserVotedSuggestedAdvices(userEmail));
    }

    private MessageResponse validationError() {
        return new MessageResponse("Error: validation failed.");
    }

    record MessageResponse(String message) {
    }
}
