package afterady.controller;

import afterady.domain.repository.RoleRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.ResetPasswordLink;
import afterady.domain.user.Role;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.LinkMessage;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.messages.reset_password_link.TriggerSendingPasswordResetLinkSender;
import afterady.security.JwtUtil;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.password_reset.ResetPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

import static afterady.domain.user.RoleName.ROLE_USER;
import static afterady.util.CustomStringUtils.validateEmail;
import static afterady.util.CustomStringUtils.validatePassword;
import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserActivatorService userActivatorService;
    private final TriggerSendingActivationLinkSender activationLinkSender;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder encoder;
    private final RoleRepository roleRepository;
    private final ResetPasswordService resetPasswordService;
    private final TriggerSendingPasswordResetLinkSender resetPasswordLinkSender;

    @Autowired
    public AuthController(UserRepository userRepository,
                          UserActivatorService userActivatorService,
                          TriggerSendingActivationLinkSender activationLinkSender,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserDetailsService userDetailsService,
                          PasswordEncoder encoder,
                          RoleRepository roleRepository,
                          ResetPasswordService resetPasswordService,
                          TriggerSendingPasswordResetLinkSender resetPasswordLinkSender) {
        this.userRepository = userRepository;
        this.userActivatorService = userActivatorService;
        this.activationLinkSender = activationLinkSender;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.encoder = encoder;
        this.roleRepository = roleRepository;
        this.resetPasswordService = resetPasswordService;
        this.resetPasswordLinkSender = resetPasswordLinkSender;
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
        if (!password.equals(passwordRepeat)) {
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

        Optional<Role> maybeRoleUser = roleRepository.findByName(ROLE_USER);
        if (maybeRoleUser.isEmpty()) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error: Role user not found."));
        }
        User user = new User(username, email, encoder.encode(password), maybeRoleUser.get());

        User createdUser = userRepository.save(user);
        UserActivationLink activationLink = userActivatorService.createLinkFor(createdUser);
        activationLinkSender.send(new LinkMessage(email, activationLink.getLinkId().toString()));

        return new ResponseEntity<>(activationLink.getLinkId(), OK);
    }

    @GetMapping("/activate/{linkId}")
    public ResponseEntity<?> activateUserByLinkId(@PathVariable String linkId) {
        Optional<UserActivationLink> maybeActivationLink = userActivatorService.getById(UUID.fromString(linkId));
        if (maybeActivationLink.isEmpty()) {
            return new ResponseEntity<>(BAD_REQUEST);
        } else {
            UserActivationLink activationLink = maybeActivationLink.get();
            if (activationLink.getExpired()) {
                return new ResponseEntity<>(BAD_REQUEST);
            }
            userActivatorService.activateUserByLink(activationLink);
            return new ResponseEntity<>(OK);
        }
    }

    @PostMapping("/resend/{linkId}")
    public ResponseEntity<?> resendLink(@PathVariable UUID linkId) {
        Optional<UserActivationLink> maybeActivationLink = userActivatorService.getById(linkId);
        if (maybeActivationLink.isEmpty()) {
            return new ResponseEntity<>(BAD_REQUEST);
        } else {
            UserActivationLink activationLink = maybeActivationLink.get();
            userActivatorService.resendLink(activationLink);
            return new ResponseEntity<>(NO_CONTENT);
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
        return ResponseEntity.ok(new LoginResponse(jwt, extractRolesFrom(userDetails)));
    }

    @PutMapping("/account/password-reset")
    public ResponseEntity<?> sendPasswordResetLink(@RequestParam String email) {
        if (email.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ResetPasswordLink resetPasswordLink = resetPasswordService.createLinkFor(user.get());
        resetPasswordLinkSender.send(new LinkMessage(email, resetPasswordLink.getLinkId().toString()));
        return new ResponseEntity<>(OK);
    }

    @PatchMapping("/account/password-change/{linkId}")
    public ResponseEntity<?> updateUserPassword(@PathVariable UUID linkId, @RequestBody String password) {
        if (password.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required."));
        }
        if (!validatePassword(password)) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Password is not valid."));
        }
        Optional<ResetPasswordLink> maybeResetPasswordLink = resetPasswordService.getById(linkId);
        if (maybeResetPasswordLink.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ResetPasswordLink resetPasswordLink = maybeResetPasswordLink.get();
        if (resetPasswordLink.getExpired()) {
            return ResponseEntity.unprocessableEntity().body(new MessageResponse("Error: Link expired."));
        }
        updateUserPassword(password, resetPasswordLink.getUser());
        resetPasswordService.expireLink(resetPasswordLink);
        return new ResponseEntity<>(OK);
    }

    private void updateUserPassword(String password, User user) {
        user.changePassword(encoder.encode(password));
        userRepository.save(user);
    }


    private static String[] extractRolesFrom(UserDetails userDetails) {
        return userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toArray(String[]::new);
    }

    record MessageResponse(String message) {
    }

    public record LoginResponse(String jwt, String[] roles) {
    }
}
