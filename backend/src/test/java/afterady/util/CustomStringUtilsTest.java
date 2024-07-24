package afterady.util;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static afterady.util.CustomStringUtils.validateEmail;

class CustomStringUtilsTest {

    @Test
    public void validateEmailValidEmails() {
        Assertions.assertTrue(validateEmail("email@example.com"));
        Assertions.assertTrue(validateEmail("firstname.lastname@example.com"));
        Assertions.assertTrue(validateEmail("email@subdomain.example.com"));
        Assertions.assertTrue(validateEmail("firstname+lastname@example.com"));
        Assertions.assertTrue(validateEmail("email@123.123.123.123"));
        Assertions.assertTrue(validateEmail("1234567890@example.com"));
        Assertions.assertTrue(validateEmail("email@example-one.com"));
        Assertions.assertTrue(validateEmail("_______@example.com"));
        Assertions.assertTrue(validateEmail("email@example.name"));
        Assertions.assertTrue(validateEmail("email@example.co.jp"));
    }

    @Test
    public void validateEmailInvalidEmails() {
        Assertions.assertFalse(validateEmail("plainaddress"));
        Assertions.assertFalse(validateEmail("#@%^%#$@#$@#.com"));
        Assertions.assertFalse(validateEmail("@example.com"));
        Assertions.assertFalse(validateEmail("Joe Smith <email@example.com>"));
        Assertions.assertFalse(validateEmail("email.example.com"));
        Assertions.assertFalse(validateEmail("email@example@example.com"));
        Assertions.assertFalse(validateEmail("あいうえお@example.com"));
        Assertions.assertFalse(validateEmail("email@example.com (Joe Smith)"));
        Assertions.assertFalse(validateEmail("email@example"));
        Assertions.assertFalse(validateEmail("email@111.222.333.44444"));
        Assertions.assertFalse(validateEmail("email@example..com"));
    }

}