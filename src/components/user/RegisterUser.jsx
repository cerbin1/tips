import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";

export default function RegisterUser() {
  return (
    <ContainerSection data-testid="register-user-section">
      <h1>Rejestracja</h1>
      <form className="flex flex-col gap-4 w-1/3" aria-label="RegisterUser">
        <FormInput label="Adres e-mail" id="email" type="email" />
        <FormInput label="Nazwa użytkownika" id="username" />
        <FormInput label="Hasło" id="password" type="password" />
        <FormInput label="Powtórz hasło" id="password-repeat" type="password" />
        <div className="flex justify-between">
          <button
            className="px-6 py-3 bg-slate-400 text-white text-lg rounded hover:bg-slate-500 transition-colors duration-300"
            type="reset"
          >
            Wyczyść formularz
          </button>
          <Button type="submit">Wyślij</Button>
        </div>
      </form>
    </ContainerSection>
  );
}
