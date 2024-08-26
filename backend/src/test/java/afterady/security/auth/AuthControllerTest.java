package afterady.security.auth;

import afterady.TestUtils;
import afterady.domain.repository.RoleRepository;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.ResetPasswordLink;
import afterady.domain.user.Role;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.LinkMessage;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.messages.reset_password_link.TriggerSendingPasswordResetLinkSender;
import afterady.service.CustomUserDetailsService;
import afterady.service.activation_link.LinksRemover;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.password_reset.ResetPasswordService;
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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Set;
import java.util.UUID;

import static afterady.TestUtils.*;
import static afterady.domain.user.RoleName.ROLE_USER;
import static java.util.Collections.emptySet;
import static java.util.Optional.empty;
import static java.util.Optional.of;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
    private TriggerSendingActivationLinkSender activationLinkSender;
    @MockBean
    private RoleRepository roleRepository;
    @MockBean
    private ResetPasswordService resetPasswordService;
    @MockBean
    private TriggerSendingPasswordResetLinkSender resetPasswordLinkSender;
    @MockBean
    LinksRemover linksRemover;

    @Test
    public void shouldReturn400WhenRegistrationRequestParamEmailIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(null, "username", "password", "password", emptySet())))
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
                                        new RegistrationRequest("", "username", "password", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }

    @Test
    public void shouldReturn422WhenRegisterRequestParamEmailIsInvalid() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("invalid", "username", "password", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Email is not valid.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamUsernameIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, null, "password", "password", emptySet())))
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
                                        new RegistrationRequest(VALID_TEST_EMAIL, "", "password", "password", emptySet())))
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
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", null, "password", emptySet())))
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
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamRepeatPasswordIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password", null, emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password repeat is required.")));
    }

    @Test
    public void shouldReturn400WhenRegistrationRequestParamRepeatPasswordIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password", "", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password repeat is required.")));
    }

    @Test
    public void shouldReturn422WhenRegistrationRequestParamPasswordIsTooShort() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "qwe123", "qwe123", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Password is not valid.")));
    }

    @Test
    public void shouldReturn422WhenRegistrationRequestParamPasswordHaveNoLetter() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "12345678", "12345678", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Password is not valid.")));
    }

    @Test
    public void shouldReturn422WhenRegistrationRequestParamPasswordHaveNoNumber() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Password is not valid.")));
    }

    @Test
    public void shouldReturn422WhenRegistrationRequestParamPasswordHaveNoSpecialCharacter() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Password is not valid.")));
    }

    @Test
    public void shouldReturn422WhenRegistrationRequestParamsPasswordAndPasswordRepeatAreNotEqual() throws Exception {
        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password123!", "!password123", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Passwords do not match.")));
    }

    @Test
    public void shouldReturn422WhenUsernameAlreadyExists() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(true);

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password123!", "password123!", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Username is already taken.")));
    }

    @Test
    public void shouldReturn422WhenEmailAlreadyExists() throws Exception {
        // arrange
        when(userRepository.existsByEmail(VALID_TEST_EMAIL)).thenReturn(true);

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password123!", "password123!", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Email is already in use.")));
    }

    @Test
    public void shouldReturn500WhenRoleUserDoesNotExist() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail("email")).thenReturn(false);
        User createdUser = TestUtils.testUser();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(createdUser);
        when(userActivatorService.createLinkFor(Mockito.any(User.class)))
                .thenReturn(new UserActivationLink(UUID_1, createdUser, false));
        when(roleRepository.findByName(ROLE_USER)).thenReturn(empty());

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password123!", "password123!", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message", is("Error: Role user not found.")));
    }

    @Test
    public void shouldTrimEmailAndUsernameInRegistration() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail(VALID_TEST_EMAIL)).thenReturn(false);
        User createdUser = TestUtils.testUser();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(createdUser);
        when(userActivatorService.createLinkFor(createdUser))
                .thenReturn(new UserActivationLink(UUID_1, TestUtils.testUser(), false));
        when(roleRepository.findByName(ROLE_USER)).thenReturn(of(new Role(ROLE_USER)));

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(" email@test.com ", " username ", "password123!", "password123!", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(userRepository, times(1)).save(Mockito.any(User.class));
        verify(userRepository, times(1)).existsByUsername("username");
        verify(userRepository, times(1)).existsByEmail(VALID_TEST_EMAIL);
        Mockito.verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void shouldReturn200WhenUserIsRegisteredSuccessfully() throws Exception {
        // arrange
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail(VALID_TEST_EMAIL)).thenReturn(false);
        User createdUser = TestUtils.testUser();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(createdUser);
        when(userActivatorService.createLinkFor(createdUser))
                .thenReturn(new UserActivationLink(UUID_2, createdUser, false));
        when(roleRepository.findByName(ROLE_USER)).thenReturn(of(new Role(ROLE_USER)));

        // act & assert
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(VALID_TEST_EMAIL, "username", "password123!", "password123!", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(userRepository, times(1)).save(Mockito.any(User.class));
        verify(userRepository, times(1)).existsByUsername("username");
        verify(userRepository, times(1)).existsByEmail(VALID_TEST_EMAIL);
        verify(userActivatorService, times(1)).createLinkFor(createdUser);
        verify(activationLinkSender, times(1)).send(new LinkMessage(VALID_TEST_EMAIL, "d4645e88-0d23-4946-a75d-694fc475ceba"));
        Mockito.verifyNoMoreInteractions(userRepository);
    }

    @Test
    public void shouldNotActivateUserWhenLinkNotExists() throws Exception {
        // arrange
        when(userActivatorService.getById(UUID_1)).thenReturn(empty());

        // act & assert
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldNotActivateUserWhenLinkExpired() throws Exception {
        // arrange
        when(userActivatorService.getById(UUID_1))
                .thenReturn(of(new UserActivationLink(UUID_1, TestUtils.testUser(), true)));

        // act & assert
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldActivateUser() throws Exception {
        // arrange
        UUID linkId = UUID_1;
        UserActivationLink link = new UserActivationLink(linkId, TestUtils.testUser(), false);
        when(userActivatorService.getById(linkId))
                .thenReturn(of(link));

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
        UUID linkId = UUID_1;
        when(userActivatorService.getById(linkId)).thenReturn(empty());

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
        UUID linkId = UUID_1;
        UserActivationLink link = new UserActivationLink(linkId, TestUtils.testUser(), false);
        when(userActivatorService.getById(linkId)).thenReturn(of(link));

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
    public void shouldReturn401WhenLoginCredentialsAreInvalid() throws Exception {
        // arrange
        when(userDetailsService.loadUserByUsername("email"))
                .thenReturn(new CustomUserDetailsService.UserDetailsImpl("email", "password", Set.of(new Role(ROLE_USER)), true));
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        // act & assert
        mvc.perform(post("/auth/login")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new LoginRequest("email", "wrongPassword")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", is("Error: Bad credentials!")));
    }

    @Test
    public void shouldReturn200WhenLoginIsSuccessful() throws Exception {
        // arrange
        when(userDetailsService.loadUserByUsername("email"))
                .thenReturn(new CustomUserDetailsService.UserDetailsImpl("email", "password", Set.of(new Role(ROLE_USER)), true));
        when(jwtUtil.generateToken("email")).thenReturn("token");

        // act
        ResultActions result = mvc.perform(post("/auth/login")
                .content(new ObjectMapper()
                        .writeValueAsString(
                                new LoginRequest("email", "password")))
                .contentType(APPLICATION_JSON));

        // assert
        result.andExpect(status().isOk());
        result.andExpect(jsonPath("$.jwt").value("token"));
        result.andExpect(jsonPath("$.userEmail").value("email"));
        result.andExpect(jsonPath("$.roles").isArray());
        result.andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));
        verify(authenticationManager).authenticate(any());
        Mockito.verifyNoMoreInteractions(authenticationManager);
        verify(jwtUtil).generateToken("email");
        Mockito.verifyNoMoreInteractions(jwtUtil);
    }

    @Test
    public void shouldTrimEmailInLogin() throws Exception {
        // arrange
        when(userDetailsService.loadUserByUsername("email"))
                .thenReturn(new CustomUserDetailsService.UserDetailsImpl("email", "password", Set.of(new Role(ROLE_USER)), true));
        when(jwtUtil.generateToken("email")).thenReturn("token");

        // act
        mvc.perform(post("/auth/login")
                .content(new ObjectMapper()
                        .writeValueAsString(
                                new LoginRequest(" email ", "password")))
                .contentType(APPLICATION_JSON));

        // assert
        verify(userDetailsService, times(1)).loadUserByUsername("email");
        Mockito.verifyNoMoreInteractions(userDetailsService);
    }

    @Test
    public void shouldReturn400WhenEmailIsNullWhenRestartingPassword() throws Exception {
        // act & assert
        mvc.perform(put("/auth/account/password-reset"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturn400WhenEmailIsEmptyWhenRestartingPassword() throws Exception {
        // act & assert
        mvc.perform(put("/auth/account/password-reset?email="))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is required.")));
    }

    @Test
    public void shouldReturn400WhenEmailNotExistsWhenRestartingPassword() throws Exception {
        when(userRepository.findByEmail("test@test")).thenReturn(empty());

        // act & assert
        mvc.perform(put("/auth/account/password-reset?email=test@test"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldSendRestartPasswordLink() throws Exception {
        User user = TestUtils.testUser();
        when(userRepository.findByEmail(VALID_TEST_EMAIL)).thenReturn(of(user));
        when(resetPasswordService.createLinkFor(Mockito.any(User.class)))
                .thenReturn(new ResetPasswordLink(UUID_2, user, false));

        // act
        mvc.perform(put("/auth/account/password-reset?email=email@test.com"))
                .andExpect(status().isOk());

        // assert
        verify(userRepository, times(1)).findByEmail(VALID_TEST_EMAIL);
        verify(resetPasswordService, times(1)).createLinkFor(Mockito.any(User.class));
        Mockito.verifyNoMoreInteractions(userRepository);
        Mockito.verifyNoMoreInteractions(resetPasswordService);
        verify(resetPasswordService, times(1)).createLinkFor(user);
        verify(resetPasswordLinkSender, times(1)).send(new LinkMessage(VALID_TEST_EMAIL, "d4645e88-0d23-4946-a75d-694fc475ceba"));
    }

    @Test
    public void shouldReturn400WhenLinkIdIsNotCorrectUuid() throws Exception {
        // act & assert
        mvc.perform(patch("/auth/account/password-change/qwe"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturn400WhenChangingUserPasswordAndPasswordParamIsNull() throws Exception {
        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturn400WhenChangingUserPasswordAndPasswordParamIsEmpty() throws Exception {
        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e")
                        .contentType(APPLICATION_JSON)
                        .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturn422WhenChangingUserPasswordAndPasswordParamIsInvalid() throws Exception {
        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e")
                        .contentType(APPLICATION_JSON)
                        .content("password"))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    public void shouldNotChangeUserPasswordWhenLinkNotExists() throws Exception {
        // arrange
        when(resetPasswordService.getById(UUID_1)).thenReturn(empty());

        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e")
                        .contentType(APPLICATION_JSON)
                        .content("password123!"))
                .andExpect(status().isBadRequest());
        verify(resetPasswordService, times(1)).getById(UUID_1);
        Mockito.verifyNoMoreInteractions(resetPasswordService);
    }

    @Test
    public void shouldNotChangeUserPasswordWhenLinkExpired() throws Exception {
        // arrange
        when(resetPasswordService.getById(UUID_1))
                .thenReturn(of(new ResetPasswordLink(UUID_1, TestUtils.testUser(), true)));

        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e")
                        .contentType(APPLICATION_JSON)
                        .content("password123!"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: Link expired.")));
        verify(resetPasswordService, times(1)).getById(UUID_1);
        Mockito.verifyNoMoreInteractions(resetPasswordService);
    }

    @Test
    public void shouldSuccessfullyChangePasswordAndExpireLink() throws Exception {
        // arrange
        ResetPasswordLink link = new ResetPasswordLink(UUID_1, TestUtils.testUser(), false);
        when(resetPasswordService.getById(UUID_1))
                .thenReturn(of(link));

        // act & assert
        mvc.perform(patch("/auth/account/password-change/63b4072b-b8c8-4f9a-acf4-76d0948adc6e")
                        .contentType(APPLICATION_JSON)
                        .content("password123!"))
                .andExpect(status().isOk());
        verify(resetPasswordService, times(1)).getById(UUID_1);
        verify(resetPasswordService, times(1)).expireLink(link);
        Mockito.verifyNoMoreInteractions(resetPasswordService);
        verify(userRepository, times(1)).save(Mockito.any(User.class));
        Mockito.verifyNoMoreInteractions(userRepository);
    }
}
