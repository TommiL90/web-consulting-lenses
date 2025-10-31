import { createFileRoute } from "@tanstack/react-router";
import { LensQuotePage } from "@/features/lens-quoting/components/lens-quote-page";

export const Route = createFileRoute("/cotizador")({
  component: LensQuotePage,
});
