import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import "../mocks/localStorageMock";

global.render = render;
global.screen = screen;
global.userEvent = userEvent;
