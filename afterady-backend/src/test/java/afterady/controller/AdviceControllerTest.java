package afterady.controller;

import afterady.config.db.MongoDbConfig;
import afterady.config.db.TestDataInitializer;
import afterady.domain.advice.Advice;
import afterady.domain.advice.SuggestedAdvice;
import afterady.domain.advice.category.AdviceCategory;
import afterady.domain.repository.*;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.security.auth.AuthUtil;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.advice.AdviceDetailsDto;
import afterady.service.advice.AdviceService;
import afterady.service.advice.UserVotedAdviceDetailsDto;
import afterady.service.captcha.CaptchaService;
import afterady.service.password_reset.ResetPasswordService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
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

import java.util.*;

import static afterady.TestUtils.*;
import static afterady.domain.advice.category.AdviceCategory.HEALTH;
import static afterady.domain.advice.category.AdviceCategory.HOME;
import static java.util.UUID.randomUUID;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
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
    private SuggestedCategoryRepository suggestedCategoryRepository;
    @MockBean
    private CategoryRepository categoryRepository;

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamNameIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest(null, "HOME", "content", "captchaToken")))
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
                                        new SuggestAdviceRequest("", "HOME", "content", "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn422WhenSuggestAdviceRequestParamNameIsTooLong() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "HOME", "content", "captchaToken")))
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
                                        new SuggestAdviceRequest("name", null, "content", "captchaToken")))
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
                                        new SuggestAdviceRequest("name", "", "content", "captchaToken")))
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
                                        new SuggestAdviceRequest("name", "category", "content", "captchaToken")))
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
                                        new SuggestAdviceRequest("name", "HOME", null, "captchaToken")))
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
                                        new SuggestAdviceRequest("name", "HOME", "", "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamCaptchaTokenIsNull() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "content", null)))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn400WhenSuggestAdviceRequestParamCaptchaTokenIsEmpty() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "content", "")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Error: validation failed.")));
    }

    @Test
    public void shouldReturn422WhenCaptchaIsNotValidInSuggestAdvice() throws Exception {
        // arrange
        when(captchaService.isCaptchaTokenValid("not-valid-captcha-token")).thenReturn(false);

        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "content", "not-valid-captcha-token")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: captcha is not valid.")));
    }

    @Test
    public void shouldReturn422WhenSuggestAdviceRequestParamContentIsTooLong() throws Exception {
        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", StringUtils.repeat("a", 1001), "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.message", is("Error: content too long.")));
    }

    @Test
    public void shouldCreateNewSuggestedAdvice() throws Exception {
        // arrange
        when(captchaService.isCaptchaTokenValid("captchaToken")).thenReturn(true);
        when(authUtil.getLoggedUserId()).thenReturn(1L);

        // act & assert
        mvc.perform(post("/advices")
                        .content(new ObjectMapper()
                                .writeValueAsString(
                                        new SuggestAdviceRequest("name", "HOME", "content", "captchaToken")))
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(authUtil, times(1)).getLoggedUserId();
        verify(adviceService).createSuggestedAdvice(ArgumentMatchers.any(UUID.class), eq("name"), eq(AdviceCategory.HOME), eq("content"), eq(1L));
        verifyNoMoreInteractions(authUtil, adviceService);
    }

    @Test
    public void shouldGetRandomAdvice() throws Exception {
        // arrange
        when(adviceService.getRandomAdvice()).thenReturn(new AdviceDetailsDto(UUID_1, "name", "Health", "Zdrowie", "content", 1));

        // act & assert
        mvc.perform(get("/advices/random"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"name\":\"name\", \"categoryName\":\"Health\", \"categoryDisplayName\":\"Zdrowie\", \"content\":\"content\"}"));
    }

    @Test
    public void shouldReturnEmptyRankingWhenNoAdvicesYet() throws Exception {
        // arrange
        when(adviceService.getTopTenAdvices()).thenReturn(Collections.emptyList());

        // act & assert
        mvc.perform(get("/advices/ranking"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    public void shouldReturnAdvicesRanking() throws Exception {
        // arrange
        when(adviceService.getTopTenAdvices()).thenReturn(List.of(new AdviceDetailsDto(randomUUID(), "name 1", "HOME", "Dom", "content 1", 10),
                new AdviceDetailsDto(randomUUID(), "name 2", "HOME", "Dom", "content 2", 9),
                new AdviceDetailsDto(randomUUID(), "name 3", "HOME", "Dom", "content 3", 8),
                new AdviceDetailsDto(randomUUID(), "name 4", "HOME", "Dom", "content 4", 7),
                new AdviceDetailsDto(randomUUID(), "name 5", "HOME", "Dom", "content 5", 6),
                new AdviceDetailsDto(randomUUID(), "name 6", "HOME", "Dom", "content 6", 5),
                new AdviceDetailsDto(randomUUID(), "name 7", "HOME", "Dom", "content 7", 4),
                new AdviceDetailsDto(randomUUID(), "name 8", "HOME", "Dom", "content 8", 3),
                new AdviceDetailsDto(randomUUID(), "name 9", "HOME", "Dom", "content 9", 2),
                new AdviceDetailsDto(randomUUID(), "name 10", "HOME", "Dom", "content 10", 1)
        ));

        // act & assert
        String responseContent = mvc.perform(get("/advices/ranking"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        List<AdviceDetailsDto> ranking = new ObjectMapper().readValue(responseContent, new TypeReference<>() {
        });
        assertEquals(10, ranking.size());
        AdviceDetailsDto first = ranking.get(0);
        AdviceDetailsDto last = ranking.get(9);
        assertEquals("name 1", first.name());
        assertEquals(10, first.rating());
        assertEquals("name 10", last.name());
        assertEquals(1, last.rating());
    }

    @Test
    public void shouldReturn400IfAdviceByIdNotExists() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/advices/" + UUID_1))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Advice with id 63b4072b-b8c8-4f9a-acf4-76d0948adc6e not found!")));
    }

    @Test
    public void shouldReturnAdviceById() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.of(new Advice(UUID_1, "name", AdviceCategory.HOME, "content", generateTestVotes(1))));

        // act & assert
        mvc.perform(get("/advices/" + UUID_1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(UUID_1.toString())))
                .andExpect(jsonPath("$.name", is("name")))
                .andExpect(jsonPath("$.categoryName", is("HOME")))
                .andExpect(jsonPath("$.categoryDisplayName", is("Dom")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.rating", is(1)));
    }

    @Test
    public void shouldReturn404WhenRatingAdviceThatDoesNotExist() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(post("/advices/" + UUID_1 + "/rate").content(TEST_EMAIL)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Advice with id 63b4072b-b8c8-4f9a-acf4-76d0948adc6e not found!")));
    }

    @Test
    public void shouldRateAdvice() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.of(new Advice(UUID_1, "name", AdviceCategory.HOME, "content", generateTestVotes(1))));
        when(adviceService.increaseAdviceRating(UUID_1, TEST_EMAIL)).thenReturn(Optional.of(new Advice(UUID_1, "name", AdviceCategory.HOME, "content", generateTestVotes(2))));

        // act & assert
        mvc.perform(post("/advices/" + UUID_1 + "/rate").content(TEST_EMAIL)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("name")))
                .andExpect(jsonPath("$.categoryName", is("HOME")))
                .andExpect(jsonPath("$.categoryDisplayName", is("Dom")))
                .andExpect(jsonPath("$.content", is("content")))
                .andExpect(jsonPath("$.rating", is(2)));
    }

    @Test
    public void shouldReturn400WhenGettingUserAdviceRateInfoAndAdviceNotExist() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/advices/" + UUID_1 + "/rated?userEmail=" + TEST_EMAIL))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnFalseWhenUserNotRatedAdvice() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.of(new Advice(UUID_1, "name", AdviceCategory.HOME, "content", generateTestVotes(1))));

        // act & assert
        mvc.perform(get("/advices/" + UUID_1 + "/rated?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rated", is(false)));
    }

    @Test
    public void shouldReturnTrueWhenUserRatedAdvice() throws Exception {
        // arrange
        when(adviceService.getAdviceById(UUID_1)).thenReturn(Optional.of(new Advice(UUID_1, "name", AdviceCategory.HOME, "content", Set.of(TEST_EMAIL))));

        // act & assert
        mvc.perform(get("/advices/" + UUID_1 + "/rated?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rated", is(true)));
    }

    @Test
    public void shouldReturnEmptyUserVotedAdvices() throws Exception {
        // arrange
        when(adviceService.getUserVotedAdvices(TEST_EMAIL)).thenReturn(Collections.emptyList());

        // act & assert
        mvc.perform(get("/advices?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void shouldReturnListOfUserVotedAdvices() throws Exception {
        // arrange
        when(adviceService.getUserVotedAdvices(TEST_EMAIL)).thenReturn(List.of(
                new UserVotedAdviceDetailsDto(UUID_1, "name", "HOME", "Dom", "content"),
                new UserVotedAdviceDetailsDto(UUID_2, "name 2", "HEALTH", "Zdrowie", "content")));

        // act & assert
        mvc.perform(get("/advices?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(content().json("[{\"id\":\"63b4072b-b8c8-4f9a-acf4-76d0948adc6e\",\"name\":\"name\",\"categoryName\":\"HOME\",\"categoryDisplayName\":\"Dom\",\"content\":\"content\"},{\"id\":\"d4645e88-0d23-4946-a75d-694fc475ceba\",\"name\":\"name 2\",\"categoryName\":\"HEALTH\",\"categoryDisplayName\":\"Zdrowie\",\"content\":\"content\"}]"));
    }

    @Test
    public void shouldGetSuggestedAdvices() throws Exception {
        // arrange
        Long userId = 1L;
        when(adviceService.getSuggestedAdvices(userId)).thenReturn(List.of(
                new SuggestedAdvice(UUID_1, "name 1", HOME, "content 1", 1L),
                new SuggestedAdvice(UUID_2, "name 2", HEALTH, "content 2", 1L)));
        when(authUtil.getLoggedUserId()).thenReturn(userId);

        // act & assert
        mvc.perform(get("/advices/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(content().json("[{\"id\":\"63b4072b-b8c8-4f9a-acf4-76d0948adc6e\",\"name\":\"name 1\",\"category\":{\"displayName\":\"Dom\"},\"content\":\"content 1\",\"creatorId\":1},{\"id\":\"d4645e88-0d23-4946-a75d-694fc475ceba\",\"name\":\"name 2\",\"category\":{\"displayName\":\"Zdrowie\"},\"content\":\"content 2\",\"creatorId\":1}]"));
    }

    @Test
    public void shouldGetEmptyListWhenUserHaveNoSuggestedAdvices() throws Exception {
        // arrange
        Long userId = 1L;
        when(adviceService.getSuggestedAdvices(userId)).thenReturn(Collections.emptyList());
        when(authUtil.getLoggedUserId()).thenReturn(userId);

        // act & assert
        mvc.perform(get("/advices/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)))
                .andExpect(content().json("[]"));
    }
}
