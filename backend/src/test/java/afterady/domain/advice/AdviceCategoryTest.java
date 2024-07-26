package afterady.domain.advice;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AdviceCategoryTest {

    @Test
    public void testIsValid() {
        assertTrue(AdviceCategory.isValid("PERSONAL_DEVELOPMENT"));
        assertFalse(AdviceCategory.isValid("OTHER_CATEGORY"));
    }

    @Test
    public void shouldGetValues() {
        // arrange
        String[] categoryNames = {"Rozwój osobisty", "Zdrowie", "Dom", "Finanse", "Technologia"};

        // act
        AdviceCategory[] categories = AdviceCategory.values();

        // assert
        assertEquals(5, categories.length);
        for (AdviceCategory category : categories) {
            assertEquals(categoryNames[category.ordinal()], category.getDisplayName());
        }
    }

    @Test
    public void shouldGetCategories() {
        // arrange
        String[] names = {"PERSONAL_DEVELOPMENT", "HEALTH", "HOME", "FINANCE", "TECHNOLOGY"};
        String[] displayNames = {"Rozwój osobisty", "Zdrowie", "Dom", "Finanse", "Technologia"};

        // act
        AdviceCategory.AdviceCategoryDto[] categories = AdviceCategory.getCategories();

        // assert
        assertEquals(5, categories.length);
        for (int i = 0; i < categories.length; i++) {
            assertEquals(names[i], categories[i].name());
            assertEquals(displayNames[i], categories[i].displayName());

        }
    }
}
