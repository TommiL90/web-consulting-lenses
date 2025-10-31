import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

export const Route = createFileRoute("/example")({
  component: Page,
});

type ProductsResponse = {
  products: unknown[];
};

function Page() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["products", "example"],
    queryFn: async () => {
      const response = await apiFetch<ProductsResponse>("/lenses/products", {
        method: "GET",
      });
      return response;
    },
    staleTime: 1000 * 60,
  });

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (error)
    return (
      <div className="p-6">
        Error: {error instanceof Error ? error.message : "Error desconocido"}
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Productos</h2>
      <pre className="text-sm bg-muted p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}


