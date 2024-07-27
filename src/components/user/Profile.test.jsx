import Profile from "./Profile";

describe("Profile", () => {
  test("should display profile", () => {
    localStorage.setItem("roles", "ROLE_USER");
    render(<Profile />);

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getByText("Użytkownik jest zalogowany")).toBeInTheDocument();
    expect(screen.getByText("Role użytkownika: ROLE_USER")).toBeInTheDocument();
  });
});
TriggerSendingPasswordResetLink;
Sender;
