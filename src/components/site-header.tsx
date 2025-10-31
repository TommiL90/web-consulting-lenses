import { useLocation } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { findRouteConfig } from "@/config/navigation";

export function SiteHeader() {
  const location = useLocation();
  const routeConfig = findRouteConfig(location.pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <h1 className="font-semibold text-base">
            {routeConfig?.title ?? "Panel de la óptica"}
          </h1>
          {routeConfig?.description ? (
            <p className="text-xs text-muted-foreground">
              {routeConfig.description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
