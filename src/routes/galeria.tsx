import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/galeria")({
  component: GaleriaLayout,
});

function GaleriaLayout() {
  return <Outlet />;
}
