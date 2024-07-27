import Button from "../common/Button";
import ContainerSection from "../common/ContainerSection";
import FormInput from "../common/FormInput";
import { useActionData, useNavigation } from "react-router";
import { Form, redirect } from "react-router-dom";

export default function Login() {
  const data = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state !== "idle";

  return (
    <ContainerSection data-testid="login-section">
      <h1>Login</h1>
      <Form
        method="post"
        className="flex flex-col gap-4 w-1/3"
        aria-label="Login"
      >
        <FormInput label="Adres e-mail" id="email" type="email" required />
        <FormInput label="Hasło" id="password" type="password" required />
        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logowanie..." : "Zaloguj"}
          </Button>
        </div>

        {data && data.errors && (
          <div>
            {Object.values(data.errors).map((error) => (
              <p className="py-6 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </Form>
    </ContainerSection>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

  const response = await fetch(
    import.meta.env.VITE_BACKEND_URL + "auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    }
  );

  if (!response.ok) {
    throw json(
      { message: "Nie udało się zautentykować użytkownika" },
      { status: 500 }
    );
  }

  const responseData = await response.json();
  const token = responseData.jwt;
  const roles = responseData.roles;

  localStorage.setItem("token", token);
  localStorage.setItem("roles", roles);

  return redirect("/random");
}
