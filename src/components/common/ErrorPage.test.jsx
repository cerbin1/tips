import { screen } from "@testing-library/react";
import ErrorPage from "./ErrorPage";
import { beforeEach, vi } from "vitest";
import { renderWithRouter } from "../../test-utils";
import { useRouteError } from "react-router";

beforeEach(() => {
  vi.clearAllMocks();
  // https://github.com/vitest-dev/vitest/issues/3228 TODO CHECK
  //   vi.mock("react-router", {
  // useRouteError: () => ({ status: 200 }),
  /* () => {
    return {
      // ...vi.importActual("react-router"),
      useRouteError: () => {
        return { status: 200 };
      },
    };
  } */
  //   });
});

test("should display default error message", () => {
  // vi.clearAllMocks();
  //   vi.mocked(useRouteError).mockReturnValue({ status: 200 });
  vi.mock("react-router", () => {
    return {
      ...vi.importActual("react-router"),
      useRouteError: () => {
        return { status: 200 };
      },
    };
  });
  renderWithRouter(<ErrorPage />);
  expect(screen.getByText("Wystąpił błąd!")).toBeInTheDocument();
  expect(screen.getByText("Coś poszło nie tak.")).toBeInTheDocument();
});

describe("ErrorPage", () => {
  test("should display 404 error", () => {
    vi.mock("react-router", () => {
      return {
        ...vi.importActual("react-router"),
        useRouteError: () => {
          return { status: 404 };
        },
      };
    });
    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("Nie znaleziono!")).toBeInTheDocument();
    expect(screen.getByText("Nie ma takiej strony.")).toBeInTheDocument();
  });
});
