import type { ReactNode } from "react";

type CipherLayoutProps = {
	title: string;
	description: string;
	children: ReactNode;
};

export const CipherLayout = ({
	title,
	description,
	children,
}: CipherLayoutProps) => {
	return (
		<section className="animate-fade-in space-y-4 p-4 md:p-6">
			<header className="border border-bp-border bg-bp-panel p-4">
				<p className="mb-2 text-[10px] tracking-[0.15em] text-bp-dim">
					CIPHER VIEW
				</p>
				<h1 className="font-mono text-xl text-bp-accent md:text-2xl">
					{title}
				</h1>
				<p className="mt-2 max-w-3xl text-sm text-bp-pale">
					{description}
				</p>
			</header>
			{children}
		</section>
	);
};
