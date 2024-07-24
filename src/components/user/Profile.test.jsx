import Profile from "./Profile";

describe("Profile", () => {
  test("should display profile", () => {
    render(<Profile />);

    expect(screen.getByTestId("profile-section")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Profil"
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      "Użytkownik jest zalogowany"
    );
  });
});
