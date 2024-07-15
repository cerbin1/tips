import { render, screen } from "@testing-library/react";
import ContainerSection from "./ContainerSection";

describe("ContainerSection", () => {
  test("should display container", () => {
    render(
      <ContainerSection data-testid="container-section">test</ContainerSection>
    );
    expect(screen.getByText("test")).toBeInTheDocument();
    const container = screen.getByTestId("container-section");
    expect(container).toHaveClass(
      "flex flex-col text-center justify-center items-center mx-auto py-12"
    );
  });
});
