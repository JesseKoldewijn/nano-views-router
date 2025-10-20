import { lazy, type JSX } from 'preact/compat';

export interface RouteBase {
  pathName: string;
  importPath: string;
  dynamicComponent: (() => Promise<() => JSX.Element>) | (() => JSX.Element);
}

export const routes = [
{ pathName: "/404", importPath: "./views/404", dynamicComponent: lazy(() => import("./views/404").then(module => ({ default: module.default }))) },
{ pathName: "/", importPath: "./views/index", dynamicComponent: lazy(() => import("./views/index").then(module => ({ default: module.default }))) },
{ pathName: "/list", importPath: "./views/list", dynamicComponent: lazy(() => import("./views/list").then(module => ({ default: module.default }))) },
] as const;

export type Route = (typeof routes)[number];
