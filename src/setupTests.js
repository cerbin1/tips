import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

import "./mocks/localStorageMock";

global.render = render;
global.screen = screen;
