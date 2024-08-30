import Header from "./Header";
import { renderWithRouterAndAuth } from "../../test/test-utils";

describe("Header", () => {
  test("should display header", () => {
    renderWithRouterAndAuth(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
  });

  test("should display logo", () => {
    renderWithRouterAndAuth(<Header />);

    expect(screen.getByText("Afterady")).toBeInTheDocument();
  });

  test("should display header for not logged in user", () => {
    localStorage.setItem("token", "");
    renderWithRouterAndAuth(<Header />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass("py-4");
    const randomAdviceLink = screen.getByText("Losowa porada");
    const categoriesLink = screen.getByText("Kategorie");
    const rankingLink = screen.getByText("Ranking");
    expect(randomAdviceLink).toBeInTheDocument();
    expect(randomAdviceLink).toHaveAttribute("href", "/random");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    expect(screen.getByTitle("User")).toBeInTheDocument();
    const registerUserLink = screen.getByText("Rejestracja");
    expect(registerUserLink).toBeInTheDocument();
    expect(registerUserLink).toHaveAttribute("href", "/user/register");
    const loginUserLink = screen.getByText("Login");
    expect(loginUserLink).toBeInTheDocument();
    expect(loginUserLink).toHaveAttribute("href", "/user/login");
    expect(screen.getAllByRole("link")).toHaveLength(6);
  });

  test("should display header for logged in user", () => {
    localStorage.setItem("token", "token");
    renderWithRouterAndAuth(<Header />);

    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass("py-4");
    const randomAdviceLink = screen.getByText("Losowa porada");
    const categoriesLink = screen.getByText("Kategorie");
    const rankingLink = screen.getByText("Ranking");
    const suggestLink = screen.getByText("Zaproponuj");
    expect(randomAdviceLink).toBeInTheDocument();
    expect(randomAdviceLink).toHaveAttribute("href", "/random");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    expect(suggestLink).toBeInTheDocument();
    expect(suggestLink).toHaveAttribute("href", "/suggest");
    expect(screen.getByTitle("User")).toBeInTheDocument();
    const userProfileLink = screen.getByText("Profil");
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute("href", "/user/profile");
    const logoutButton = screen.getByText("Wyloguj");
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass("px-2");
    expect(screen.getAllByRole("link")).toHaveLength(7);
  });

  test("should change styles to currently clicked link", async () => {
    renderWithRouterAndAuth(<Header />);
    const randomAdviceLink = screen.getByText("Losowa porada");
    expect(randomAdviceLink).toHaveClass(
      "px-12 text-blue-to-light no-underline"
    );

    await userEvent.click(randomAdviceLink);

    expect(randomAdviceLink).toHaveClass("px-12 text-blue-to-light underline");
  });
});
