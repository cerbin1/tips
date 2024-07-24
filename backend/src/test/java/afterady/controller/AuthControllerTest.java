package afterady.controller;

import afterady.TestUtils;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.Message;
import afterady.messages.TriggerSendingActivationLinkSender;
import afterady.security.JwtUtil;
import afterady.service.CustomUserDetailsService;
import afterady.service.activation_link.UserActivatorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Optional;
import java.util.UUID;

import static java.util.Collections.emptySet;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class})
public class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepository;
    @MockBean
    private UserActivatorService userActivatorService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AuthenticationManager authenticationManager;
    @MockBean
    private JwtUtil jwtUtil;
    @MockBean
    private TriggerSendingActivationLinkSender sender;

    @Test
    public void shouldReturn400WhenRegistrationRequestParamEmailIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(null, "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamEmailIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamUsernameIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", null, "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Username is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamUsernameIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Username is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamPasswordIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", null, emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamPasswordIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn422WhenUsernameAlreadyExists() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(true);

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Username is already taken.")));
    }

    @Test
    public void shouldReturn422WhenEmailAlreadyExists() throws Exception {
        // arrange
        when(userRepository.existsByEmail("email")).thenReturn(true);

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Email is already in use.")));
    }

    @Test
    public void shouldReturn200WhenUserIsRegisteredSuccessfully() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail("email")).thenReturn(false);
        User createdUser = TestUtils.testUser();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(createdUser);
        when(userActivatorService.createLinkFor(Mockito.any(User.class)))
                .thenReturn(new UserActivationLink(UUID.fromString("d4645e88-0d23-4946-a75d-694fc475ceba"), createdUser, false));

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(userRepository, times(1)).save(Mockito.any(User.class));
        verify(userRepository, times(1)).existsByUsername("username");
        verify(userRepository, times(1)).existsByEmail("email");
        verify(userActivatorService, times(1)).createLinkFor(createdUser);
        verify(sender, times(1)).send(new Message("email", "d4645e88-0d23-4946-a75d-694fc475ceba"));
        Mockito.verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void shouldNotActivateUserWhenLinkNotExists() throws Exception {
        // arrange
        when(userActivatorService.getById(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldNotActivateUserWhenLinkExpired() throws Exception {
        // arrange
        when(userActivatorService.getById(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e")))
                .thenReturn(Optional.of(new UserActivationLink(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"), TestUtils.testUser(), true)));

        // act & assert
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldActivateUser() throws Exception {
        // arrange
        UUID linkId = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
        UserActivationLink link = new UserActivationLink(linkId, TestUtils.testUser(), false);
        when(userActivatorService.getById(linkId))
                .thenReturn(Optional.of(link));

        // act & assert
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isOk());
        verify(userActivatorService, times(1)).getById(linkId);
        verify(userActivatorService, times(1)).activateUserByLink(link);
        Mockito.verifyNoMoreInteractions(userActivatorService);
    }

    @Test
    public void shouldNotResendNotExistingLink() throws Exception {
        // arrange
        UUID linkId = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
        when(userActivatorService.getById(linkId)).thenReturn(Optional.empty());

        // act
        mvc.perform(post("/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());

        // assert
        verify(userActivatorService, times(1)).getById(linkId);
        Mockito.verifyNoMoreInteractions(userActivatorService);
    }

    @Test
    public void shouldResendLink() throws Exception {
        // arrange
        UUID linkId = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
        UserActivationLink link = new UserActivationLink(linkId, TestUtils.testUser(), false);
        when(userActivatorService.getById(linkId)).thenReturn(Optional.of(link));

        // act
        mvc.perform(post("/auth/resend/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isNoContent());

        // assert
        verify(userActivatorService, times(1)).getById(linkId);
        verify(userActivatorService, times(1)).resendLink(link);
        Mockito.verifyNoMoreInteractions(userActivatorService);
    }

    @Test
    public void shouldReturn400WhenLoginRequestParamEmailIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest(null, "password")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }

    @Test
    public void shouldReturn400WhenLoginRequestParamEmailIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest("", "password")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }


    @Test
    public void shouldReturn400WhenLoginRequestParamPasswordIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest("email", null)))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn400WhenLoginRequestParamPasswordIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest("email", "")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn422WhenUserIsNotActivated() throws Exception {
        // arrange
        when(userDetailsService.loadUserByUsername("email"))
                .thenReturn(new CustomUserDetailsService.UserDetailsImpl("email", "password", emptySet(), false));

        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest("email", "password")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: User is not activated!")));
    }

    @Test
    public void shouldReturn200WhenLoginIsSuccessful() throws Exception {
        // arrange
        when(userDetailsService.loadUserByUsername("email"))
                .thenReturn(new CustomUserDetailsService.UserDetailsImpl("email", "password", emptySet(), true));

        // act
        ResultActions result = mvc.perform(post("/auth/login")
                .content(new ObjectMapper()
                        .writeValueAsString(
                                new LoginRequest("email", "password")))
                .contentType(APPLICATION_JSON));

        // assert
        result.andExpect(status().isOk());
        verify(authenticationManager).authenticate(any());
        Mockito.verifyNoMoreInteractions(authenticationManager);
        verify(jwtUtil).generateToken("email");
        Mockito.verifyNoMoreInteractions(jwtUtil);
    }
}
