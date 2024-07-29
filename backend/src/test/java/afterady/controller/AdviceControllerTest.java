package afterady.controller;

import afterady.config.db.MongoDbConfig;
import afterady.config.db.TestDataInitializer;
import afterady.domain.advice.AdviceCategory;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.repository.AdviceRepository;
import afterady.domain.repository.RoleRepository;
import afterady.domain.repository.SuggestedAdviceRepository;
import afterady.domain.repository.UserRepository;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.password_reset.ResetPasswordService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.shaded.org.apache.commons.lang3.StringUtils;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        MongoAutoConfiguration.class,
        MongoDataAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class AdviceControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private TestDataInitializer testDataInitializer;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private UserActivatorService userActivatorService;
    @MockBean
    private UserDetailsService userDetailsService;
    @MockBean
    private AdviceRepository adviceRepository;
    @MockBean
    private MongoDbConfig mongoDbConfig;
    @MockBean
    private SuggestedAdviceRepository suggestedAdviceRepository;
    @MockBean
    private RoleRepository roleRepository;
    @MockBean
    private ResetPasswordService resetPasswordService;
    @MockBean
    private TriggerSendingActivationLinkSender resetPasswordLinkSender;

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamNameIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest(null, "HOME", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamNameIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("", "HOME", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamNameIsTooLong() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "HOME", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: name too long.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamCategoryIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", null, "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamCategoryIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamCategoryIsNotValid() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "category", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamContentIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", null)))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamContentIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamContentIsTooLong() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", StringUtils.repeat("a", 1001))))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: content too long.")));
    }

    @Test
    public void shouldGetCategories() throws Exception {
        // act & assert
        mvc.perform(get("/advices/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(("$"), hasSize(5)))
                .andExpect(content().json("[{\"name\":\"PERSONAL_DEVELOPMENT\", \"displayName\":\"Rozwój osobisty\"},{\"name\":\"HEALTH\", \"displayName\":\"Zdrowie\"}, {\"name\":\"HOME\", \"displayName\":\"Dom\"}, {\"name\":\"FINANCE\", \"displayName\":\"Finanse\"}, {\"name\":\"TECHNOLOGY\", \"displayName\":\"Technologia\"}]"));
    }

    @Test
    public void shouldCreateNewAdvice() throws Exception {
        when(suggestedAdviceRepository.save(any(SuggestedAdvice.class)))
                .thenReturn(new SuggestedAdvice("1", "name", AdviceCategory.HOME, "content"));

        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "content")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
