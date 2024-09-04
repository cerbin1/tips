package afterady.controller;

public record SuggestAdviceRequest(String name, String category, String content, String captchaToken) {

}
