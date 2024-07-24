import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

global.render = render;
global.screen = screen;
