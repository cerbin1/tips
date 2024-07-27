package afterady.messages;

import java.io.Serial;
import java.io.Serializable;

public record LinkMessage(String email, String linkId) implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;
}
