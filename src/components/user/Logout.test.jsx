import { renderWithRouterAndAuth } from "../../test/test-utils";
import Logout from "./Logout";

const mockedUseNavigate = vi.fn();

describe("Logout", () => {
  test("should render component and navigate to main page", () => {
    localStorage.setItem("token", "token");
    localStorage.setItem("roles", '["ROLE_USER"]');
    localStorage.setItem("userEmail", "test@test");
    expect(localStorage.getItem("token")).toBe("token");
    expect(localStorage.getItem("roles")).toBe('["ROLE_USER"]');
    expect(localStorage.getItem("userEmail")).toBe("test@test");
    vi.mock("react-router", async () => {
      const actual = await vi.importActual("react-router");
      return {
        ...actual,
        useNavigate: () => mockedUseNavigate,
      };
    });
    expect(mockedUseNavigate).not.toBeCalled();

    renderWithRouterAndAuth(<Logout />);

    expect(screen.getByText("Wylogowywanie użytkownika..."));
    expect(mockedUseNavigate).toBeCalledWith("/");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("roles")).toBeNull();
    expect(localStorage.getItem("userEmail")).toBeNull();
  });
});
