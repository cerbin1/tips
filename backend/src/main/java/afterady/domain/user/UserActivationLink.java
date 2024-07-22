package afterady.domain.user;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "user_activation_link")
@Table(name = "user_activation_link")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserActivationLink {
    @Id
    private UUID linkId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private Boolean expired = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public void expire() {
        expired = true;
    }

    public UserActivationLink(UUID linkId, User user, Boolean expired) {
        this.linkId = linkId;
        this.user = user;
        this.expired = expired;
    }
}
