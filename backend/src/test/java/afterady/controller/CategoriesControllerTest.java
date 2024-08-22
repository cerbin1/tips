package afterady.controller;

import afterady.TestUtils;
import afterady.config.db.MongoDbConfig;
import afterady.config.db.TestDataInitializer;
import afterady.domain.advice.CategoriesStatistics;
import afterady.domain.repository.*;
import afterady.messages.activation_link.TriggerSendingActivationLinkSender;
import afterady.service.activation_link.UserActivatorService;
import afterady.service.advice.AdviceService;
import afterady.service.captcha.CaptchaService;
import afterady.service.password_reset.ResetPasswordService;
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

import java.util.Collections;
import java.util.List;

import static afterady.domain.advice.AdviceCategory.HEALTH;
import static afterady.domain.advice.AdviceCategory.HOME;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
class CategoriesControllerTest {
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


    @Test
    public void shouldGetCategoriesStatistics() throws Exception {
        // arrange
        when(categoriesStatisticsRepository.findAll()).thenReturn(
                List.of(
                        new CategoriesStatistics(TestUtils.UUID_1, HOME, HOME.getDisplayName(), "Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.", 10),
                        new CategoriesStatistics(TestUtils.UUID_2, HEALTH, HEALTH.getDisplayName(), "Porady dotyczące zdrowia i dobrego samopoczucia.", 20))
        );

        // act & assert
        mvc.perform(get("/categories-statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(TestUtils.UUID_1.toString())))
                .andExpect(jsonPath("$[0].category", is("HOME")))
                .andExpect(jsonPath("$[0].categoryDisplayName", is("Dom")))
                .andExpect(jsonPath("$[0].description", is("Porady dotyczące sprzątania, zarządzania przestrzenią itp. w domu.")))
                .andExpect(jsonPath("$[0].advicesCount", is(10)))
                .andExpect(jsonPath("$[1].id", is(TestUtils.UUID_2.toString())))
                .andExpect(jsonPath("$[1].category", is("HEALTH")))
                .andExpect(jsonPath("$[1].categoryDisplayName", is("Zdrowie")))
                .andExpect(jsonPath("$[1].description", is("Porady dotyczące zdrowia i dobrego samopoczucia.")))
                .andExpect(jsonPath("$[1].advicesCount", is(20)));
    }

    @Test
    public void shouldGetEmptyList() throws Exception {
        // arrange
        when(categoriesStatisticsRepository.findAll()).thenReturn(
                List.of()
        );

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
}
