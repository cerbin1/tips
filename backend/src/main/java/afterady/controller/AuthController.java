package afterady.controller;

import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.Message;
import afterady.messages.TriggerSendingActivationLinkSender;
import afterady.service.activation_link.UserActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserActivatorService userActivatorService;
    private final TriggerSendingActivationLinkSender sender;

    @Autowired
    public AuthController(UserRepository userRepository, UserActivatorService userActivatorService, TriggerSendingActivationLinkSender sender) {
        this.userRepository = userRepository;
        this.userActivatorService = userActivatorService;
        this.sender = sender;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is required."));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required."));
        }
        String username = request.getUsername();
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Username is already taken."));
        }
        String email = request.getEmail();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Email is already in use."));
        }
        User createdUser = userRepository.save(new User(username, email, request.getPassword()));
        UserActivationLink activationLink = userActivatorService.createLinkFor(createdUser);
        sender.send(new Message(email, activationLink.getLinkId().toString()));

        return new ResponseEntity<>(activationLink.getLinkId(), HttpStatus.OK);
    }

    @GetMapping("/activate/{linkId}")
    public ResponseEntity<?> activateUserByLinkId(@PathVariable String linkId) {
        Optional<UserActivationLink> maybeActivationLink = userActivatorService.getById(UUID.fromString(linkId));
        if (maybeActivationLink.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            UserActivationLink activationLink = maybeActivationLink.get();
            if (activationLink.getExpired()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            userActivatorService.activateUserByLink(activationLink);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @PostMapping("/resend/{linkId}")
    public ResponseEntity<?> resendLink(@PathVariable UUID linkId) {
        Optional<UserActivationLink> maybeActivationLink = userActivatorService.getById(linkId);
        if (maybeActivationLink.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            UserActivationLink activationLink = maybeActivationLink.get();
            userActivatorService.resendLink(activationLink);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required."));
        }
        return null;
    }

    record MessageResponse(String message) {
    }
}
