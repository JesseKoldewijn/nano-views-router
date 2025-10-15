import { useSignal } from "@preact/signals";

const useSignalPolyfill = () => {
	let signal = useSignal;
	const fallbackSignal = <T,>(initialValue: T) => ({ value: initialValue });

	if (globalThis.window === undefined) {
		signal = fallbackSignal as typeof useSignal;
	}

	return signal;
};

const LandingPage = () => {
	const signal = useSignalPolyfill();
	const count = signal(0);

	return (
		<div className="min-h-screen bg-background p-8 w-full items-center-safe flex justify-center-safe">
			<div className="container mx-auto max-w-4xl gap-8 flex flex-col justify-center-safe items-center-safe">
				<h1 className="text-4xl font-bold text-foreground text-center">
					Welcome to the Landing Page
				</h1>

				<hr />

				<p className="text-lg text-foreground text-center">
					This is a simple landing page built with Preact and Tailwind
					CSS.
				</p>

				<div className="flex flex-col items-center-safe gap-4">
					<p className="text-2xl text-foreground">Count: {count}</p>
					<button
						className="px-4 py-2 bg-foreground text-background rounded border border-transparent hover:border-foreground hover:bg-background hover:text-foreground transition-colors duration-200 ease-in-out cursor-pointer"
						onClick={() => count.value++}
					>
						Increment
					</button>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
