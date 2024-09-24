import { renderWithRouterAndAuth } from "../../test/test-utils";
import Header from "./Header";

afterEach(() => {
  localStorage.clear();
});

describe("Header", () => {
  test("should render component and display header for not logged in user", () => {
    localStorage.setItem("token", "");

    renderWithRouterAndAuth(<Header />);

    expect(screen.getByRole("banner")).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
    expect(screen.getByText("Afterady")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("py-4");
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByText("Losowa porada")).toHaveAttribute(
      "href",
      "/random"
    );
    expect(screen.getByText("Kategorie")).toHaveAttribute(
      "href",
      "/categories"
    );
    expect(screen.getByText("Ranking")).toHaveAttribute("href", "/ranking");
    expect(screen.getByText("Login")).toHaveAttribute("href", "/user/login");
    expect(screen.getByText("Rejestracja")).toHaveAttribute(
      "href",
      "/user/register"
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByTitle("User")).toBeInTheDocument();
  });

  test("should display header for logged in user", () => {
    localStorage.setItem("token", "token");

    renderWithRouterAndAuth(<Header />);

    expect(screen.getByRole("banner")).toHaveClass(
      "flex justify-between items-center px-4 border-b border-cyan-100"
    );
    expect(screen.getByText("Afterady")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveClass("py-4");
    expect(screen.getAllByRole("link")).toHaveLength(8);

    expect(screen.getByText("Losowa porada")).toHaveAttribute(
      "href",
      "/random"
    );
    expect(screen.getByText("Kategorie")).toHaveAttribute(
      "href",
      "/categories"
    );
    expect(screen.getByText("Ranking")).toHaveAttribute("href", "/ranking");
    expect(screen.getByText("Zaproponuj")).toHaveAttribute("href", "/suggest");
    expect(screen.getByText("Propozycje")).toHaveAttribute(
      "href",
      "/suggestions"
    );
    expect(screen.getByText("Profil")).toHaveAttribute("href", "/user/profile");
    expect(screen.getByText("Wyloguj")).toHaveClass("px-2");
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByTitle("User")).toBeInTheDocument();
  });

  test("should change styles to currently clicked link", async () => {
    renderWithRouterAndAuth(<Header />);
    const randomAdviceLink = screen.getByText("Losowa porada");
    expect(randomAdviceLink).toHaveClass(
      "px-8 text-blue-to-light no-underline"
    );

    await userEvent.click(randomAdviceLink);

    expect(randomAdviceLink).toHaveClass("px-8 text-blue-to-light underline");
  });
});
