import { createFileRoute, Link } from "@tanstack/react-router";
import Widget from "@/components/widget/Widget";
import { WidgetConfigProvider, useWidgetOverrides } from "@/widget/config";

export const Route = createFileRoute("/")({
  component: Index,
});

/** Виджет VirtuFit — 19 экранов MVP. */
function Index() {
  const [overrides] = useWidgetOverrides();

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-stretch sm:items-center sm:justify-center bg-[#e9e9ea] sm:py-10 relative">
      <WidgetConfigProvider config={overrides}>
        <Widget />
      </WidgetConfigProvider>
      <Link
        to="/admin"
        className="fixed right-3 z-50 text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto"
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        Админка
      </Link>
      <Link
        to="/gallery"
        className="fixed left-3 z-50 text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto"
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        Экраны
      </Link>
    </div>
  );
}
