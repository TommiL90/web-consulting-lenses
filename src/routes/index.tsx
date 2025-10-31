import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/navigation";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <section className="rounded-lg border bg-card">
        <div className="border-b px-6 py-6">
          <Badge className="mb-2 w-fit" variant="secondary">
            Óptica
          </Badge>
          <h1 className="mb-2 font-semibold text-2xl">
            Bienvenido al panel de cotización y gestión
          </h1>
          <p className="text-muted-foreground">
            Accede rápidamente a las herramientas principales para atender a
            tus clientes y mantener el catálogo actualizado.
          </p>
        </div>
        <div className="grid gap-4 px-6 py-6 lg:grid-cols-2">
          {APP_ROUTES.map((route) => (
            <Card key={route.url} className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <route.icon className="size-5 text-primary" />
                  {route.title}
                </CardTitle>
                <CardDescription>{route.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={route.url}>Abrir {route.title.toLowerCase()}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
