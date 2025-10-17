import App from "./app";
import { routes } from "./views.gen";
import "./styles/tailwind.css";
import { createEntry } from "@nvr/preact/client";

createEntry(App, routes);
