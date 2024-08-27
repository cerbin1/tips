package afterady.controller;

import afterady.config.db.MongoDbConfig;
import afterady.config.db.TestDataInitializer;
import afterady.domain.advice.Advice;
import afterady.domain.advice.category.CategoriesStatistics;
import afterady.domain.advice.category.Category;
import afterady.domain.repository.*;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.security.auth.AuthUtil;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.advice.AdviceService;
import afterady.service.advice.category.CategoryDetailsDto;
import afterady.service.captcha.CaptchaService;
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

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

import static afterady.TestUtils.*;
import static afterady.domain.advice.category.AdviceCategory.HEALTH;
import static afterady.domain.advice.category.AdviceCategory.HOME;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
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
class CategoryControllerTest {
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
    private SuggestedAdviceRepository suggestedAdviceRepository;
    @MockBean
    private MongoDbConfig mongoDbConfig;
    @MockBean
    private RoleRepository roleRepository;
    @MockBean
    private ResetPasswordService resetPasswordService;
    @MockBean
    private TriggerSendingActivationLinkSender resetPasswordLinkSender;
    @MockBean
    private AdviceService adviceService;
    @MockBean
    private CaptchaService captchaService;
    @MockBean
    private CategoriesStatisticsRepository categoriesStatisticsRepository;
    @MockBean
    private AuthUtil authUtil;
    @MockBean
    private CategoryRepository categoryRepository;


    @Test
    public void shouldGetCategoriesStatistics() throws Exception {
        // arrange
        when(categoriesStatisticsRepository.findAll()).thenReturn(
                List.of(
                        new CategoriesStatistics(UUID_1, HOME, "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.", 10),
                        new CategoriesStatistics(UUID_2, HEALTH, "Porady dotyczące zdrowia i dobrego samopoczucia.", 20))
        );

        // act & assert
        mvc.perform(get("/categories-statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(UUID_1.toString())))
                .andExpect(jsonPath("$[0].category.name", is("HOME")))
                .andExpect(jsonPath("$[0].category.displayName", is("Dom")))
                .andExpect(jsonPath("$[0].description", is("Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.")))
                .andExpect(jsonPath("$[0].advicesCount", is(10)))
                .andExpect(jsonPath("$[1].id", is(UUID_2.toString())))
                .andExpect(jsonPath("$[1].category.name", is("HEALTH")))
                .andExpect(jsonPath("$[1].category.displayName", is("Zdrowie")))
                .andExpect(jsonPath("$[1].description", is("Porady dotyczące zdrowia i dobrego samopoczucia.")))
                .andExpect(jsonPath("$[1].advicesCount", is(20)));
    }

    @Test
    public void shouldGetEmptyList() throws Exception {
        // arrange
        when(categoriesStatisticsRepository.findAll()).thenReturn(Collections.emptyList());

        // act & assert
        mvc.perform(get("/categories-statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
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
    public void shouldReturn400WhenCategoryNotExists() throws Exception {
        // act & assert
        mvc.perform(get("/advices/byCategory/invalidCategory"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnEmptyListOfAdvicesByCategory() throws Exception {
        // arrange
        when(adviceService.getCategoryDetails(HOME)).thenReturn(new CategoryDetailsDto(HOME.getDisplayName(), 0, Collections.emptyList()));

        // act & assert
        mvc.perform(get("/advices/byCategory/" + HOME))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.advices", hasSize(0)));
    }

    @Test
    public void shouldReturnCategoryDetails() throws Exception {
        // arrange
        when(adviceService.getCategoryDetails(HOME)).thenReturn(
                new CategoryDetailsDto(
                        HOME.getDisplayName(), 5, Stream.of(
                        new Advice(UUID_1, "name 1", HOME, "content 1", generateTestVotes(5)),
                        new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", generateTestVotes(4)),
                        new Advice(UUID.randomUUID(), "name 3", HOME, "content 3", generateTestVotes(3)),
                        new Advice(UUID.randomUUID(), "name 4", HOME, "content 4", generateTestVotes(2)),
                        new Advice(UUID.randomUUID(), "name 5", HOME, "content 5", generateTestVotes(1))).map(Advice::toAdviceDetailsDto).toList()));

        // act & assert
        mvc.perform(get("/advices/byCategory/" + HOME))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryDisplayName", is("Dom")))
                .andExpect(jsonPath("$.advicesCount", is(5)))
                .andExpect(jsonPath("$.advices", hasSize(5)))
                .andExpect(jsonPath("$.advices[0].id", is(UUID_1.toString())))
                .andExpect(jsonPath("$.advices[0].name", is("name 1")));
    }

    @Test
    public void shouldReturn400WhenSuggestCategoryRequestParamNameIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest(null, "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestCategoryRequestParamNameIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest(null, "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestCategoryRequestParamCaptchaTokenIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest("name", null)))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestCategoryRequestParamCaptchaTokenIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest("name", "")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn422WhenCaptchaIsNotValidInSuggestCategory() throws Exception {
        // arrange
        when(captchaService.isCaptchaTokenValid("not-valid-captcha-token")).thenReturn(false);

        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest("name", "not-valid-captcha-token")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: captcha is not valid.")));
    }

    @Test
    public void shouldReturn422WhenSuggestCategoryRequestParamNameIsTooLong() throws Exception {
        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest(StringUtils.repeat("a", 101), "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: name too long.")));
    }

    @Test
    public void shouldCreateNewSuggestedCategory() throws Exception {
        // arrange
        when(captchaService.isCaptchaTokenValid("captchaToken")).thenReturn(true);
        when(authUtil.getLoggedUserId()).thenReturn(1L);

        // act & assert
        mvc.perform(post("/categories")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestCategoryRequest("name", "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(authUtil, times(1)).getLoggedUserId();
        verify(categoryRepository).save(any(Category.class));
        verify(captchaService, times(1)).isCaptchaTokenValid("captchaToken");
        verifyNoMoreInteractions(authUtil, captchaService, categoryRepository);
    }
}
