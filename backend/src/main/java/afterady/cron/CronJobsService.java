package afterady.cron;

import afterady.domain.advice.CategoriesStatistics;
import afterady.domain.repository.CategoriesStatisticsRepository;
import afterady.service.advice.AdviceService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class CronJobsService {
    public static final String EVERY_DAY = "0 0 0 * * *";
    private final AdviceService adviceService;
    private final CategoriesStatisticsRepository categoriesStatisticsRepository;

    public CronJobsService(AdviceService adviceService, CategoriesStatisticsRepository categoriesStatisticsRepository) {
        this.adviceService = adviceService;
        this.categoriesStatisticsRepository = categoriesStatisticsRepository;
    }

    @Scheduled(cron = EVERY_DAY)
    public void updateCategoriesStatisticsData() {
        categoriesStatisticsRepository.findAll().forEach(categoriesStatistics -> {
            int newAdvicesCount = adviceService.getAdvicesCountByCategory(categoriesStatistics.getCategory());
            if (newAdvicesCount != categoriesStatistics.getAdvicesCount()) {
                categoriesStatisticsRepository.delete(categoriesStatistics);
                categoriesStatisticsRepository.save(new CategoriesStatistics(categoriesStatistics.getId(), categoriesStatistics.getCategory(), categoriesStatistics.getCategoryDisplayName(), categoriesStatistics.getDescription(), newAdvicesCount));
            }
        });
    }
}
