package afterady.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

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
        return null;
    }

    record MessageResponse(String message) {
    }
}
