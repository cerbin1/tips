import { render, screen } from "@testing-library/react";
import Header from "./Header";
import "@testing-library/jest-dom";

test("should get logo", () => {
  render(<Header />);

  const logo = screen.getByText("Afterady");
  expect(logo).toBeInTheDocument(true);
  expect(logo).toHaveClass("logo");
});
