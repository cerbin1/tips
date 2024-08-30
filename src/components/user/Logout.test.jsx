import { renderWithRouterAndAuth } from "../../test/test-utils";
import Logout from "./Logout";

const mockedUseNavigate = vi.fn();

describe("Logout", () => {
  test("should navigate to main page after rendering component", () => {
    localStorage.setItem("token", "token");
    vi.mock("react-router", async () => {
      const actual = await vi.importActual("react-router");
      return {
        ...actual,
        useNavigate: () => mockedUseNavigate,
      };
    });
    expect(mockedUseNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("token")).toBe("token");

    renderWithRouterAndAuth(<Logout />);

    expect(mockedUseNavigate).toHaveBeenCalledWith("/");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
