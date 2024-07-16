package afterady.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.hamcrest.Matchers.is;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void shouldReturn400WhenRegistrationRequestParamEmailIsNull() throws Exception {
        // when & then
        mvc.perform(post("/auth/register")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new RegistrationRequest(null, "username", "password", Set.of("role"))))
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
                                        new RegistrationRequest("", "username", "password", Set.of("role"))))
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
                                        new RegistrationRequest("email", null, "password", Set.of("role"))))
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
                                        new RegistrationRequest("email", "", "password", Set.of("role"))))
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
                                        new RegistrationRequest("email", "username", null, Set.of("role"))))
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
                                        new RegistrationRequest("email", "username", "", Set.of("role"))))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: Password is required.")));
    }

}
