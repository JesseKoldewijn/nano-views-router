const randomList = Array.from({ length: 100 }, () =>
	Math.floor(Math.random() * 1000)
);

const ListPage = () => {
	return (
		<div className="min-h-screen bg-background p-8 w-full items-center-safe flex justify-center-safe">
			<div className="container mx-auto max-w-4xl gap-8 flex flex-col justify-center-safe items-center-safe">
				<h1>Random Number List</h1>
				<div className="flex flex-col gap-2 max-h-96 overflow-y-auto max-w-max px-10">
					{randomList.map((num, index) => (
						<span key={`${index}-${num}`}>{num}</span>
					))}
				</div>
				<a href="/">Go to Landing Page</a>
			</div>
		</div>
	);
};

export default ListPage;
