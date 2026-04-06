type SidebarProps<T extends string> = {
	items: readonly T[];
	active: T;
	onSelect: (item: T) => void;
};

export const Sidebar = <T extends string>({
	items,
	active,
	onSelect,
}: SidebarProps<T>) => {
	return (
		<nav className="border-b border-bp-border bg-bp-panel md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-r-bp-border">
			<div className="px-4 py-3 text-[10px] tracking-[0.15em] text-bp-dim">
				CIPHERS
			</div>
			<div className="flex overflow-x-auto md:block">
				{items.map((item) => {
					const isActive = item === active;
					return (
						<button
							key={item}
							type="button"
							onClick={() => onSelect(item)}
							className={`min-w-fit border-l-2 px-4 py-3 text-left text-xs tracking-wide transition-colors md:w-full ${
								isActive
									? "border-l-bp-accent bg-bp-glow text-bp-pale"
									: "border-l-transparent text-bp-dim hover:bg-bp-glow/60 hover:text-bp-pale"
							}`}
						>
							{item}
						</button>
					);
				})}
			</div>
		</nav>
	);
};
