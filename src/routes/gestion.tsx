import { createFileRoute } from "@tanstack/react-router";
import { LensManagementPage } from "@/features/lens-management/components/lens-management-page";

export const Route = createFileRoute("/gestion")({
  component: LensManagementPage,
});
