package afterady.cron;

import afterady.domain.advice.category.CategoriesStatistics;
import afterady.domain.repository.CategoriesStatisticsRepository;
import afterady.domain.repository.CategoryRepository;
import afterady.service.advice.AdviceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CronJobsService {
    public static final String EVERY_DAY = "0 0 0 * * *";
    private final AdviceService adviceService;
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;
    private final CategoryRepository categoryRepository;

    public CronJobsService(AdviceService adviceService, CategoriesStatisticsRepository categoriesStatisticsRepository, CategoryRepository categoryRepository) {
        this.adviceService = adviceService;
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
        this.categoryRepository = categoryRepository;
    }

    @Scheduled(cron = EVERY_DAY)
    @Transactional
    public void updateCategoriesStatisticsData() {
        categoriesStatisticsRepository.deleteAll();
        categoryRepository.findAll().forEach(category -> {
            int advicesCount = adviceService.getAdvicesCountByCategory(category.getEnumValue());
            categoriesStatisticsRepository.save(new CategoriesStatistics(category.getId(), category.getEnumValue(), category.getDescription(), advicesCount));
        });
    }
}
