import type { Route } from 'nano-views-router';

import { lazy } from 'preact/compat';
export const routes = [
{ pathName: "/404", importPath: "./views/404", dynamicComponent: lazy(() => import("./views/404")) },
{ pathName: "/", importPath: "./views/index", dynamicComponent: lazy(() => import("./views/index")) },
] as const satisfies Route[];
