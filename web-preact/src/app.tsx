import { Suspense } from "preact/compat";
import { ThemeProvider } from "./providers/theme";

const App = ({ Component }: { Component: preact.ComponentType<any> }) => {
	return (
		<ThemeProvider defaultTheme="system">
			<Suspense fallback={null}>
				<Component />
			</Suspense>
		</ThemeProvider>
	);
};

export default App;
