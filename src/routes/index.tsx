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
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#e9e9ea] sm:py-10 relative">
      <WidgetConfigProvider config={overrides}>
        <Widget />
      </WidgetConfigProvider>
      <Link
        to="/admin"
        className="fixed bottom-3 right-3 z-50 text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto"
      >
        Админка
      </Link>
      <Link
        to="/gallery"
        className="fixed bottom-3 left-3 z-50 text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto"
      >
        Экраны
      </Link>
    </div>
  );
}
