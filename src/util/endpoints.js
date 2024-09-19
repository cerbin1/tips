export function getAdviceDetailsUrl(adviceId) {
  return import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId;
}

export function getUserRatedAdviceInfoUrl(adviceId, email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "advices/" +
    adviceId +
    "/rate/check?userEmail=" +
    email
  );
}

export function rateAdviceUrl(adviceId) {
  return import.meta.env.VITE_BACKEND_URL + "advices/" + adviceId + "/rate";
}

export function getRandomAdviceUrl() {
  return import.meta.env.VITE_BACKEND_URL + "advices/random";
}

export function getAvailableCategoriesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "categories";
}

export function createSuggestedAdviceUrl() {
  return import.meta.env.VITE_BACKEND_URL + "advices/suggested";
}

export function rateSuggestedAdviceUrl(id, rateType) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "advices/suggested/" +
    id +
    "/rate?rateType=" +
    rateType
  );
}

export function getSuggestedAdviceDetailsUrl(id) {
  return import.meta.env.VITE_BACKEND_URL + "advices/suggested/" + id;
}

export function getUserRatedSuggestedAdviceInfoUrl(id, email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "advices/suggested/" +
    id +
    "/rate/check?userEmail=" +
    email
  );
}

export function getSuggestedAdvicesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "advices/suggested";
}

export function getSuggestedCategoriesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "categories/suggested";
}

export function getCategoriesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "categories/statistics";
}

export function getCategoryDetailsUrl(categoryId) {
  return import.meta.env.VITE_BACKEND_URL + "categories/" + categoryId;
}

export function createSuggestedCategoryUrl() {
  return import.meta.env.VITE_BACKEND_URL + "categories";
}

export function rateSuggestedCategoryUrl(id, rateType) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "categories/suggested/" +
    id +
    "/rate?rateType=" +
    rateType
  );
}

export function getSuggestedCategoryDetailsUrl(id) {
  return import.meta.env.VITE_BACKEND_URL + "categories/suggested/" + id;
}

export function getUserRatedSuggestedCategoryInfoUrl(id, email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "categories/suggested/" +
    id +
    "/rate/check?userEmail=" +
    email
  );
}

export function getAdvicesRankingUrl() {
  return import.meta.env.VITE_BACKEND_URL + "advices/ranking";
}

export function activateUserUrl(token) {
  return import.meta.env.VITE_BACKEND_URL + "auth/activate/" + token;
}

export function loginUrl() {
  return import.meta.env.VITE_BACKEND_URL + "auth/login";
}

export function changePasswordUrl(token) {
  return (
    import.meta.env.VITE_BACKEND_URL + "auth/account/password-change/" + token
  );
}

export function resetPasswordUrl(email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "auth/account/password-reset?email=" +
    email
  );
}

export function getUserRatedAdvicesUrl(email) {
  return (
    import.meta.env.VITE_BACKEND_URL + "users/advices/rated?userEmail=" + email
  );
}

export function getUserRatedSuggestedAdvicesUrl(email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "users/advices/suggested/rated?userEmail=" +
    email
  );
}

export function getUserSuggestedAdvicesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "users/advices/suggested";
}

export function getUserSuggestedCategoriesUrl() {
  return import.meta.env.VITE_BACKEND_URL + "users/categories/suggested";
}

export function getUserRatedSuggestedCategoriesUrl(email) {
  return (
    import.meta.env.VITE_BACKEND_URL +
    "users/categories/suggested/rated?userEmail=" +
    email
  );
}

export function registerUrl() {
  return import.meta.env.VITE_BACKEND_URL + "auth/register";
}

export function resendActivationLinkUrl(link) {
  return import.meta.env.VITE_BACKEND_URL + "auth/resend/" + link;
}
