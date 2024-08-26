import { BrowserRouter } from "react-router-dom";
import Logout from "./Logout";
import AuthProvider from "../../store/auth-context";

const mockedUseNavigate = vi.fn();

const RouterAndAuthProvider = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

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

    render(<Logout />, { wrapper: RouterAndAuthProvider });

    expect(mockedUseNavigate).toHaveBeenCalledWith("/");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
