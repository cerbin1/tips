package afterady.domain.advice;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdviceCategoryTest {

    @Test
    public void testIsValid() {
        assertTrue(AdviceCategory.isValid("PERSONAL_DEVELOPMENT"));
        assertFalse(AdviceCategory.isValid("OTHER_CATEGORY"));
    }
}
