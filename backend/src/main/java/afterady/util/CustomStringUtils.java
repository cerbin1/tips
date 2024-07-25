package afterady.util;

public final class CustomStringUtils {
    private CustomStringUtils() {
    }

    public static boolean validateEmail(String email) {
        return email.matches("^[a-zA-Z0-9_.+-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }

    public static boolean validatePassword(String password) {
        return password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
    }
}
