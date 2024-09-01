import ContainerSection from "./ContainerSection";

describe("ContainerSection", () => {
  test("should render component", () => {
    render(
      <ContainerSection data-testid="container-section">
        Container
      </ContainerSection>
    );
    const container = screen.getByTestId("container-section");
    expect(container).toHaveTextContent("Container");
    expect(container).toHaveClass(
      "flex flex-col text-center justify-center items-center mx-auto py-12"
    );
  });
});
