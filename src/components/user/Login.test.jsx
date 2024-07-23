import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login", () => {
  it("should display login form", () => {
    render(<Login />);
  });
});
