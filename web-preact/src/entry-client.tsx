import App from "./app";
import { routes } from "./views.gen";
import "./styles/tailwind.css";
import { createEntry } from "@nvr/preact/client";
import PreactCompat from "preact/compat";
import PreactCompatClient from "preact/compat/client";

createEntry(App, routes, PreactCompat, PreactCompatClient);
