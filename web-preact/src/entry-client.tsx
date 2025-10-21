import App from "./app";
import { AppRoutes } from "./routes";
import "./styles/tailwind.css";
import { createEntry } from "@nvr/preact/client";
import PreactCompat from "preact/compat";
import PreactCompatClient from "preact/compat/client";

createEntry(App, AppRoutes, PreactCompat, PreactCompatClient);
