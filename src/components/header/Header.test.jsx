import { renderWithRouterAndAuth } from "../../test/test-utils";
import Header from "./Header";

afterEach(() => {
  localStorage.clear();
});

describe("Header", () => {
  test("should render component and display header for not logged in user", () => {
    localStorage.setItem("token", "");

    renderWithRouterAndAuth(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
    expect(screen.getByText("Afterady")).toBeInTheDocument();
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass("py-4");
    expect(screen.getAllByRole("link")).toHaveLength(6);
    const randomAdviceLink = screen.getByText("Losowa porada");
    expect(randomAdviceLink).toBeInTheDocument();
    expect(randomAdviceLink).toHaveAttribute("href", "/random");
    const categoriesLink = screen.getByText("Kategorie");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    const rankingLink = screen.getByText("Ranking");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    const loginUserLink = screen.getByText("Login");
    expect(loginUserLink).toBeInTheDocument();
    expect(loginUserLink).toHaveAttribute("href", "/user/login");
    const registerUserLink = screen.getByText("Rejestracja");
    expect(registerUserLink).toBeInTheDocument();
    expect(registerUserLink).toHaveAttribute("href", "/user/register");
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByTitle("User")).toBeInTheDocument();
  });

  test("should display header for logged in user", () => {
    localStorage.setItem("token", "token");

    renderWithRouterAndAuth(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
    expect(screen.getByText("Afterady")).toBeInTheDocument();
    const navbar = screen.getByRole("navigation");
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass("py-4");
    expect(screen.getAllByRole("link")).toHaveLength(7);

    const randomAdviceLink = screen.getByText("Losowa porada");
    expect(randomAdviceLink).toBeInTheDocument();
    expect(randomAdviceLink).toHaveAttribute("href", "/random");
    const categoriesLink = screen.getByText("Kategorie");
    expect(categoriesLink).toBeInTheDocument();
    expect(categoriesLink).toHaveAttribute("href", "/categories");
    const rankingLink = screen.getByText("Ranking");
    expect(rankingLink).toBeInTheDocument();
    expect(rankingLink).toHaveAttribute("href", "/ranking");
    const suggestLink = screen.getByText("Zaproponuj");
    expect(suggestLink).toBeInTheDocument();
    expect(suggestLink).toHaveAttribute("href", "/suggest");
    const userProfileLink = screen.getByText("Profil");
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute("href", "/user/profile");
    const logoutButton = screen.getByText("Wyloguj");
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass("px-2");
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByTitle("User")).toBeInTheDocument();
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
