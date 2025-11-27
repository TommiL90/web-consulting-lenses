import type { Icon } from "@tabler/icons-react";
import { IconCalculator, IconPackages } from "@tabler/icons-react";

export type AppRouteConfig = {
	title: string;
	url: string;
	icon: Icon;
	description: string;
};

export const APP_ROUTES: AppRouteConfig[] = [
	{
		title: "Cotizador de lentes",
		url: "/cotizador",
		icon: IconCalculator,
		description:
			"Genera cotizaciones precisas con filtros y características destacadas.",
	},
	{
		title: "Gestión de productos",
		url: "/gestion",
		icon: IconPackages,
		description:
			"Administra el catálogo, actualiza precios y controla la disponibilidad.",
	},
];

export function findRouteConfig(pathname: string) {
	return APP_ROUTES.find((route) => route.url === pathname);
}
