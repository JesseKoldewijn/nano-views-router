import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "preact/compat";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme | ((prevTheme: Theme) => Theme)) => void;
};

const initialState: ThemeProviderState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}: Readonly<ThemeProviderProps>) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme | ((prevTheme: Theme) => Theme)) => {
			if (typeof theme === "function") {
				setTheme((prevTheme) => {
					const newTheme = theme(prevTheme);
					localStorage.setItem(storageKey, newTheme);
					return newTheme;
				});
				return;
			}
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	const { theme, setTheme } = context;

	const updateTheme = (newTheme: Theme) => {
		setTheme((prevTheme: Theme) => {
			if (prevTheme === newTheme) return prevTheme;
			return newTheme;
		});
	};

	const memoizedTheme = useMemo(() => theme, [theme]);
	const memoizedSetTheme = useMemo(() => updateTheme, []);

	return { theme: memoizedTheme, setTheme: memoizedSetTheme };
};
