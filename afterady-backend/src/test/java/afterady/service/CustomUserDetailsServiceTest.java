package afterady.service;

import afterady.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static afterady.TestUtils.testUser;
import static afterady.TestUtils.testUserWithRoles;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void init() {
        customUserDetailsService = new CustomUserDetailsService(userRepository);
    }

    @Test
    public void shouldThrowExceptionIfUserByEmailNotFound() {
        // arrange
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());

        // act & assert
        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername("email"), "User not found");
        verify(userRepository, times(1)).findByEmail("email");
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void shouldReturnUserDetails() {
        // arrange
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(testUser()));

        // act
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("email");

        // assert
        assertNotNull(userDetails);
        assertEquals("email", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertFalse(userDetails.isEnabled());
        assertTrue(userDetails.getAuthorities().isEmpty());
        verify(userRepository, times(1)).findByEmail("email");
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void shouldReturnUserDetailsWithAuthorities() {
        // arrange
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(testUserWithRoles()));

        // act
        UserDetails userDetails = customUserDetailsService.loadUserByUsername("email");

        // assert
        assertNotNull(userDetails);
        assertEquals("email", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertEquals(2, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(authority -> "ROLE_USER".equals(authority.getAuthority())));
        assertTrue(userDetails.getAuthorities().stream().anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority())));
        verify(userRepository, times(1)).findByEmail("email");
        verifyNoMoreInteractions(userRepository);
    }
}
