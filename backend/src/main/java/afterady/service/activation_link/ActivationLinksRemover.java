package afterady.service.activation_link;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ActivationLinksRemover {

    private final UserActivatorService userActivatorService;

    public ActivationLinksRemover(UserActivatorService userActivatorService) {
        this.userActivatorService = userActivatorService;
    }

    @Scheduled(fixedRate = 60000) // every minute
    public void executeTask() {
        userActivatorService.expireOldLinks();
    }

}
