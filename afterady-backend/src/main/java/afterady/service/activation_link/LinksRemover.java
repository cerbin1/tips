package afterady.service.activation_link;

import afterady.service.password_reset.ResetPasswordService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LinksRemover {

    private final UserActivatorService userActivatorService;
    private final ResetPasswordService resetPasswordService;

    public LinksRemover(UserActivatorService userActivatorService, ResetPasswordService resetPasswordService) {
        this.userActivatorService = userActivatorService;
        this.resetPasswordService = resetPasswordService;
    }

    @Scheduled(fixedRate = 60000) // every minute
    public void executeTask() {
        userActivatorService.expireOldLinks();
        resetPasswordService.expireOldLinks();
    }

}
