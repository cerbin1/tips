package afterady.domain.user;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
