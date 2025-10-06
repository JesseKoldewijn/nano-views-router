import { ThemeProvider } from "./providers/theme";

const App = ({ Component }: { Component: preact.ComponentType<any> }) => {
	return (
		<ThemeProvider>
			<Component />
		</ThemeProvider>
	);
};

export default App;
