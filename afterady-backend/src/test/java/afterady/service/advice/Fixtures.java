package afterady.service.advice;

import afterady.domain.advice.SuggestedAdvice;

import java.util.List;
import java.util.Set;

import static afterady.TestUtils.*;
import static afterady.domain.advice.category.AdviceCategory.HEALTH;
import static afterady.domain.advice.category.AdviceCategory.HOME;
import static java.util.Collections.emptySet;
import static org.junit.jupiter.api.Assertions.assertEquals;

public final class Fixtures {
    public static final List<SuggestedAdvice> SUGGESTED_ADVICES = List.of(
            new SuggestedAdvice(UUID_1, "name 1", HOME, "content 1", "source 1", 1L, generateTestVotes(1), generateTestVotes(1)),
            new SuggestedAdvice(UUID_2, "name 2", HEALTH, "content 2", "source 2", 1L, generateTestVotes(2), generateTestVotes(2))
    );

    public static final List<SuggestedAdvice> VOTED_SUGGESTED_ADVICES = List.of(
            new SuggestedAdvice(UUID_1, "name 1", HOME, "content 1", "source 1", 1L, Set.of(TEST_EMAIL), emptySet()),
            new SuggestedAdvice(UUID_2, "name 2", HEALTH, "content 2", "source 2", 1L, Set.of(TEST_EMAIL), Set.of(TEST_EMAIL))
    );

    public static final SuggestedAdvice SUGGESTED_ADVICE = new SuggestedAdvice(UUID_1, "name", HOME, "content", "source", 1L, generateTestVotes(1), generateTestVotes(1));

    public static final SuggestedAdvice UNVOTED_SUGGESTED_ADVICE = new SuggestedAdvice(UUID_1, "name", HOME, "content", "source", 1L, emptySet(), emptySet());
    public static final SuggestedAdvice VOTED_SUGGESTED_ADVICE_UP = new SuggestedAdvice(UUID_1, "name", HOME, "content", "source", 1L, Set.of(TEST_EMAIL), emptySet());
    public static final SuggestedAdvice VOTED_SUGGESTED_ADVICE_DOWN = new SuggestedAdvice(UUID_1, "name", HOME, "content", "source", 1L, emptySet(), Set.of(TEST_EMAIL));

    public static void assertListOfSuggestedAdvices(List<SuggestedAdvice> actual) {
        assertEquals(2, actual.size());
        var firstSuggestedAdvice = actual.get(0);
        var secondSuggestedAdvice = actual.get(1);
        assertEquals(UUID_1, firstSuggestedAdvice.getId());
        assertEquals("name 1", firstSuggestedAdvice.getName());
        assertEquals(HOME, firstSuggestedAdvice.getCategory());
        assertEquals("source 1", firstSuggestedAdvice.getSource());
        assertEquals(1L, firstSuggestedAdvice.getCreatorId());
        assertEquals(0, firstSuggestedAdvice.getRating());
        assertEquals(UUID_2, secondSuggestedAdvice.getId());
        assertEquals("name 2", secondSuggestedAdvice.getName());
        assertEquals(HEALTH, secondSuggestedAdvice.getCategory());
        assertEquals("source 2", secondSuggestedAdvice.getSource());
        assertEquals(1L, secondSuggestedAdvice.getCreatorId());
        assertEquals(0, secondSuggestedAdvice.getRating());
    }
}
