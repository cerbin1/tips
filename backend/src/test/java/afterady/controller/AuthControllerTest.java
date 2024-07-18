package afterady.controller;

import afterady.TestUtils;
import afterady.domain.repository.UserRepository;
import afterady.domain.user.User;
import afterady.domain.user.UserActivationLink;
import afterady.messages.Message;
import afterady.messages.TriggerSendingActivationLinkSender;
import afterady.service.UserActivatorService;
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
import org.springframework.test.web.servlet.MockMvc;

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
    private TriggerSendingActivationLinkSender sender;

    @Test
    public void shouldReturn400WhenRegistrationRequestParamEmailIsNull() throws Exception {
        // when & then
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
        // when & then
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
        // when & then
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
        // when & then
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
        // when & then
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
        // when & then
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

    @Test
    public void shouldReturn400WhenUsernameAlreadyExists() throws Exception {
        // given
        when(userRepository.existsByUsername("username")).thenReturn(true);

        // when & then
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Username is already taken.")));
    }

    @Test
    public void shouldReturn400WhenEmailAlreadyExists() throws Exception {
        // given
        when(userRepository.existsByEmail("email")).thenReturn(true);

        // when & then
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest("email", "username", "password", emptySet())))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Email is already in use.")));
    }

    @Test
    public void shouldReturn200WhenUserIsRegisteredSuccessfully() throws Exception {
        // given
        when(userRepository.existsByUsername("username")).thenReturn(false);
        when(userRepository.existsByEmail("email")).thenReturn(false);
        User createdUser = TestUtils.testUser();
        when(userRepository.save(Mockito.any(User.class))).thenReturn(createdUser);
        when(userActivatorService.createLinkFor(Mockito.any(User.class)))
                .thenReturn(new UserActivationLink(UUID.fromString("d4645e88-0d23-4946-a75d-694fc475ceba"), createdUser, false));

        // when & then
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
        // given
        when(userActivatorService.getById(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))).thenReturn(Optional.empty());

        // when & then
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldNotActivateUserWhenLinkExpired() throws Exception {
        // given
        when(userActivatorService.getById(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e")))
                .thenReturn(Optional.of(new UserActivationLink(UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e"), TestUtils.testUser(), true)));

        // when & then
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldActivateUser() throws Exception {
        // given
        UUID linkId = UUID.fromString("63b4072b-b8c8-4f9a-acf4-76d0948adc6e");
        UserActivationLink link = new UserActivationLink(linkId, TestUtils.testUser(), false);
        when(userActivatorService.getById(linkId))
                .thenReturn(Optional.of(link));

        // when & then
        mvc.perform(get("/auth/activate/63b4072b-b8c8-4f9a-acf4-76d0948adc6e"))
                .andExpect(status().isOk());
        verify(userActivatorService, times(1)).getById(linkId);
        verify(userActivatorService, times(1)).activateUserByLink(link);
        Mockito.verifyNoMoreInteractions(userActivatorService);
    }


}
