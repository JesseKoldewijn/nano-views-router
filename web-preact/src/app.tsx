import { ThemeProvider } from "./providers/theme";

const App = ({ Component }: { Component: preact.ComponentType<any> }) => {
	return (
		<main>
			<ThemeProvider>
				<Component />
			</ThemeProvider>
		</main>
	);
};

export default App;
