type ThemeOption<T extends string> = {
	id: T;
	label: string;
};

type SidebarProps<T extends string, ThemeId extends string> = {
	items: readonly T[];
	active: T;
	onSelect: (item: T) => void;
	themes: readonly ThemeOption<ThemeId>[];
	activeTheme: ThemeId;
	onThemeChange: (theme: ThemeId) => void;
};

export const Sidebar = <T extends string, ThemeId extends string>({
	items,
	active,
	onSelect,
	themes,
	activeTheme,
	onThemeChange,
}: SidebarProps<T, ThemeId>) => {
	return (
		<nav className="border-b border-bp-border bg-bp-panel md:min-h-screen md:w-64 md:border-b-0 md:border-r md:border-r-bp-border">
			<div className="border-b border-bp-border px-4 py-4">
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					THEME
				</p>
				<select
					className="w-full border border-bp-border bg-bp-bg px-3 py-2 text-[11px] tracking-[0.12em] text-bp-pale outline-none focus:border-bp-accent"
					value={activeTheme}
					onChange={(event) =>
						onThemeChange(event.target.value as ThemeId)
					}
					aria-label="Select theme"
				>
					{themes.map((theme) => (
						<option key={theme.id} value={theme.id}>
							{theme.label}
						</option>
					))}
				</select>
			</div>
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
									: "border-l-transparent text-bp-dim hover:bg-bp-glow hover:text-bp-pale"
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
