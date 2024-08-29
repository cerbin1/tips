package afterady.util;

import org.junit.jupiter.api.Test;

import static afterady.util.CustomStringUtils.validateEmail;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class CustomStringUtilsTest {

    @Test
    public void shouldValidateEmails() {
        assertFalse(validateEmail("plainaddress"));
        assertFalse(validateEmail("#@%^%#$@#$@#.com"));
        assertFalse(validateEmail("@example.com"));
        assertFalse(validateEmail("Joe Smith <email@example.com>"));
        assertFalse(validateEmail("email.example.com"));
        assertFalse(validateEmail("email@example@example.com"));
        assertFalse(validateEmail("あいうえお@example.com"));
        assertFalse(validateEmail("email@example.com (Joe Smith)"));
        assertFalse(validateEmail("email@example"));
        assertFalse(validateEmail("email@111.222.333.44444"));
        assertFalse(validateEmail("email@example..com"));
        assertTrue(validateEmail("email@example.com"));
        assertTrue(validateEmail("firstname.lastname@example.com"));
        assertTrue(validateEmail("email@subdomain.example.com"));
        assertTrue(validateEmail("firstname+lastname@example.com"));
        assertTrue(validateEmail("email@123.123.123.123"));
        assertTrue(validateEmail("1234567890@example.com"));
        assertTrue(validateEmail("email@example-one.com"));
        assertTrue(validateEmail("_______@example.com"));
        assertTrue(validateEmail("email@example.name"));
        assertTrue(validateEmail("email@example.co.jp"));
    }


    @Test
    public void shouldValidatePasswords() {
        assertFalse(CustomStringUtils.validatePassword("qwe123"));
        assertFalse(CustomStringUtils.validatePassword("password"));
        assertFalse(CustomStringUtils.validatePassword("12345678"));
        assertFalse(CustomStringUtils.validatePassword("password123"));
        assertFalse(CustomStringUtils.validatePassword("password123"));
        assertTrue(CustomStringUtils.validatePassword("password123!"));
    }
}
