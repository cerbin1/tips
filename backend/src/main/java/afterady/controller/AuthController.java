package afterady.controller;

import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.Message;
import afterady.messages.TriggerSendingActivationLinkSender;
import afterady.security.JwtUtil;
import afterady.service.activation_link.UserActivatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

import static afterady.util.CustomStringUtils.validateEmail;
import static afterady.util.CustomStringUtils.validatePassword;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserActivatorService userActivatorService;
    private final TriggerSendingActivationLinkSender sender;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder encoder;

    @Autowired
    public AuthController(UserRepository userRepository,
                          UserActivatorService userActivatorService,
                          TriggerSendingActivationLinkSender sender,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserDetailsService userDetailsService,
                          PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.userActivatorService = userActivatorService;
        this.sender = sender;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request) {
        String email = request.getEmail();
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        if (!validateEmail(email)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Email is not valid."));
        }
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is required."));
        }
        String password = request.getPassword();
        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required."));
        }
        String passwordRepeat = request.getPasswordRepeat();
        if (passwordRepeat == null || passwordRepeat.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password repeat is required."));
        }
        if(!password.equals(passwordRepeat)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Passwords do not match."));
        }
        if (!validatePassword(password)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Password is not valid."));
        }
        String username = request.getUsername();
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Username is already taken."));
        }
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Email is already in use."));
        }
        User createdUser = userRepository.save(new User(username, email, encoder.encode(password)));
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
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required."));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        if (!userDetails.isEnabled()) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: User is not activated!"));
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String jwt = jwtUtil.generateToken(userDetails.getUsername());
        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    record MessageResponse(String message) {
    }
}
