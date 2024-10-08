package afterady.controller;

import afterady.config.db.MongoDbConfig;
import afterady.config.db.TestDataInitializer;
import afterady.domain.advice.Advice;
import afterady.domain.advice.category.CategoriesStatistics;
import afterady.domain.advice.category.Category;
import afterady.domain.advice.category.SuggestedCategory;
import afterady.domain.repository.*;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.security.auth.AuthUtil;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.advice.AdviceService;
import afterady.service.advice.category.CategoryService;
import afterady.service.advice.category.SuggestedCategoryDetailsDto;
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

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static afterady.TestUtils.*;
import static afterady.domain.advice.category.AdviceCategory.HEALTH;
import static afterady.domain.advice.category.AdviceCategory.HOME;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptySet;
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
class CategoryControllerIT {
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
    @MockBean
    private CategoryService categoryService;


    @Test
    public void shouldGetCategoriesStatistics() throws Exception {
        // arrange
        when(categoriesStatisticsRepository.findAll()).thenReturn(
                List.of(
                        new CategoriesStatistics(UUID_1, HOME, "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.", 10),
                        new CategoriesStatistics(UUID_2, HEALTH, "Porady dotyczące zdrowia i dobrego samopoczucia.", 20))
        );

        // act & assert
        mvc.perform(get("/categories/statistics"))
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
        when(categoriesStatisticsRepository.findAll()).thenReturn(emptyList());

        // act & assert
        mvc.perform(get("/categories/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void shouldGetCategories() throws Exception {
        // act & assert
        mvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(("$"), hasSize(5)))
                .andExpect(content().json("[{\"name\":\"PERSONAL_DEVELOPMENT\", \"displayName\":\"Rozwój osobisty\"},{\"name\":\"HEALTH\", \"displayName\":\"Zdrowie\"}, {\"name\":\"HOME\", \"displayName\":\"Dom\"}, {\"name\":\"FINANCE\", \"displayName\":\"Finanse\"}, {\"name\":\"TECHNOLOGY\", \"displayName\":\"Technologia\"}]"));
    }

    @Test
    public void shouldReturn404WhenCategoryByIdNotExists() throws Exception {
        // act & assert
        mvc.perform(get("/categories/" + UUID_1))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldReturnEmptyListOfAdvices() throws Exception {
        // arrange
        when(categoryRepository.findById(UUID_1)).thenReturn(Optional.of(new Category(UUID_1, HOME, "description")));
        when(adviceService.getAdvicesBy(HOME)).thenReturn(emptyList());

        // act & assert
        mvc.perform(get("/categories/" + UUID_1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.advices", hasSize(0)))
                .andExpect(jsonPath("$.categoryDisplayName", is("Dom")))
                .andExpect(jsonPath("$.description", is("description")));
    }

    @Test
    public void shouldReturnCategoryDetails() throws Exception {
        // arrange
        when(categoryRepository.findById(UUID_1)).thenReturn(Optional.of(new Category(UUID_1, HOME, "description")));
        when(adviceService.getAdvicesBy(HOME)).thenReturn(Stream.of(
                new Advice(UUID_1, "name 1", HOME, "content 1", "source", generateTestVotes(5)),
                new Advice(UUID.randomUUID(), "name 2", HOME, "content 2", "source", generateTestVotes(4)),
                new Advice(UUID.randomUUID(), "name 3", HOME, "content 3", "source", generateTestVotes(3)),
                new Advice(UUID.randomUUID(), "name 4", HOME, "content 4", "source", generateTestVotes(2)),
                new Advice(UUID.randomUUID(), "name 5", HOME, "content 5", "source", generateTestVotes(1))).map(Advice::toAdviceDetailsDto).toList());

        // act & assert
        mvc.perform(get("/categories/" + UUID_1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.categoryDisplayName", is("Dom")))
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
        verify(suggestedCategoryRepository).save(any(SuggestedCategory.class));
        verify(captchaService, times(1)).isCaptchaTokenValid("captchaToken");
        verifyNoMoreInteractions(authUtil, captchaService, suggestedCategoryRepository);
    }

    @Test
    public void shouldGetEmptyListOfUserSuggestedCategories() throws Exception {
        // arrange
        when(authUtil.getLoggedUserId()).thenReturn(1L);
        when(suggestedCategoryRepository.findByCreatorId(1L)).thenReturn(emptyList());

        // act & assert
        mvc.perform(get("/users/categories/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void shouldGetUserSuggestedCategories() throws Exception {
        // arrange
        when(authUtil.getLoggedUserId()).thenReturn(1L);
        when(suggestedCategoryRepository.findByCreatorId(1L)).thenReturn(
                List.of(
                        new SuggestedCategory(UUID_1, "name 1", 1L, generateTestVotes(5), emptySet()),
                        new SuggestedCategory(UUID.randomUUID(), "name 2", 1L, emptySet(), emptySet())));

        // act & assert
        mvc.perform(get("/users/categories/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(UUID_1.toString())))
                .andExpect(jsonPath("$[0].name", is("name 1")))
                .andExpect(jsonPath("$[0].creatorId", is(1)))
                .andExpect(jsonPath("$[0].rating", is(5)));
    }

    @Test
    public void shouldReturnEmptyListOfVotedSuggestedCategories() throws Exception {
        // arrange
        when(categoryService.getUserVotedCategories(TEST_EMAIL)).thenReturn(emptyList());

        // act & assert
        mvc.perform(get("/users/categories/suggested/voted?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void shouldReturnListOfVotedSuggestedCategories() throws Exception {
        // arrange
        when(categoryService.getUserVotedCategories(TEST_EMAIL)).thenReturn(List.of(
                new SuggestedCategoryDetailsDto(UUID_1, "name 1", 5),
                new SuggestedCategoryDetailsDto(UUID_2, "name 2", -5)));

        // act & assert
        mvc.perform(get("/users/categories/suggested/voted?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(content().json("[{\"id\":\"63b4072b-b8c8-4f9a-acf4-76d0948adc6e\",\"name\":\"name 1\",\"rating\":5},{\"id\":\"d4645e88-0d23-4946-a75d-694fc475ceba\",\"name\":\"name 2\",\"rating\":-5}]"));
    }

    @Test
    public void shouldGetEmptyListOfSuggestedCategories() throws Exception {
        // arrange
        when(suggestedCategoryRepository.findAll()).thenReturn(emptyList());

        // act & assert
        mvc.perform(get("/categories/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void shouldGetListOfSuggestedCategories() throws Exception {
        // arrange
        when(suggestedCategoryRepository.findAll()).thenReturn(List.of(
                new SuggestedCategory(UUID_1, "name 1", 1L, emptySet(), emptySet()),
                new SuggestedCategory(UUID_2, "name 2", 1L, emptySet(), emptySet())));

        // act & assert
        mvc.perform(get("/categories/suggested"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(content().json("[{\"id\":\"63b4072b-b8c8-4f9a-acf4-76d0948adc6e\",\"name\":\"name 1\",\"creatorId\":1,\"votesUp\":[],\"votesDown\":[],\"rating\":0},{\"id\":\"d4645e88-0d23-4946-a75d-694fc475ceba\",\"name\":\"name 2\",\"creatorId\":1,\"votesUp\":[],\"votesDown\":[],\"rating\":0}]"));
    }

    @Test
    public void shouldReturn400IfSuggestedCategoryByIdNotExists() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/advices/suggested/" + UUID_1))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Suggested advice with id 63b4072b-b8c8-4f9a-acf4-76d0948adc6e not found!")));
    }

    @Test
    public void shouldReturnSuggestedCategoryById() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(2), generateTestVotes(1))));

        // act & assert
        mvc.perform(get("/categories/suggested/" + UUID_1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(UUID_1.toString())))
                .andExpect(jsonPath("$.name", is("name")))
                .andExpect(jsonPath("$.rating", is(1)));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldReturn404WhenSuggestedCategoryNotExists() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/categories/suggested/" + UUID_1))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Suggested category with id 63b4072b-b8c8-4f9a-acf4-76d0948adc6e not found!")));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldReturn404WhenVoteSuggestedCategoryThatDoesNotExist() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(post("/categories/suggested/" + UUID_1 + "/vote?voteType=true").content(TEST_EMAIL)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Suggested category with id 63b4072b-b8c8-4f9a-acf4-76d0948adc6e not found!")));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldVoteSuggestedCategoryUp() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(1), emptySet())));
        when(categoryService.voteSuggestedCategory(UUID_1, TEST_EMAIL, true)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(2), emptySet())));

        // act & assert
        mvc.perform(post("/categories/suggested/" + UUID_1 + "/vote?voteType=true").content(TEST_EMAIL)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(UUID_1.toString())))
                .andExpect(jsonPath("$.name", is("name")))
                .andExpect(jsonPath("$.rating", is(2)));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verify(categoryService, times(1)).voteSuggestedCategory(UUID_1, TEST_EMAIL, true);
        verifyNoMoreInteractions(categoryService);
    }


    @Test
    public void shouldVoteSuggestedCategoryDown() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, emptySet(), generateTestVotes(1))));
        when(categoryService.voteSuggestedCategory(UUID_1, TEST_EMAIL, false)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, emptySet(), generateTestVotes(2))));

        // act & assert
        mvc.perform(post("/categories/suggested/" + UUID_1 + "/vote?voteType=false").content(TEST_EMAIL)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(UUID_1.toString())))
                .andExpect(jsonPath("$.name", is("name")))
                .andExpect(jsonPath("$.rating", is(-2)));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verify(categoryService, times(1)).voteSuggestedCategory(UUID_1, TEST_EMAIL, false);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldReturn400WhenGettingUserSuggestedCategoryVoteInfoAndCategoryNotExist() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.empty());

        // act & assert
        mvc.perform(get("/categories/suggested/" + UUID_1 + "/vote/check?userEmail=" + TEST_EMAIL))
                .andExpect(status().isBadRequest());
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldReturnFalseWhenUserNotVotedSuggestedCategory() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, generateTestVotes(1), emptySet())));

        // act & assert
        mvc.perform(get("/categories/suggested/" + UUID_1 + "/vote/check?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.voted", is(false)));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }

    @Test
    public void shouldReturnTrueWhenUserVotedSuggestedCategory() throws Exception {
        // arrange
        when(categoryService.getSuggestedCategoryDetails(UUID_1)).thenReturn(Optional.of(new SuggestedCategory(UUID_1, "name", 1L, Set.of(TEST_EMAIL), emptySet())));

        // act & assert
        mvc.perform(get("/categories/suggested/" + UUID_1 + "/vote/check?userEmail=" + TEST_EMAIL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.voted", is(true)));
        verify(categoryService, times(1)).getSuggestedCategoryDetails(UUID_1);
        verifyNoMoreInteractions(categoryService);
    }
}
