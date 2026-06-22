import { createFileRoute, Link } from "@tanstack/react-router";
import Widget from "@/components/widget/Widget";
import { WidgetConfigProvider, useWidgetOverrides } from "@/widget/config";

export const Route = createFileRoute("/")({
  component: Index,
});

const devLinkClass =
  "text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto";

/** Виджет VirtuFit — 19 экранов MVP. */
function Index() {
  const [overrides] = useWidgetOverrides();

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#e9e9ea] sm:items-center sm:justify-center sm:py-10 relative">
      {/* Dev-ссылки сверху на мобиле — не перекрывают футер виджета */}
      <div className="sm:hidden shrink-0 flex justify-between items-center px-3 pb-2 vf-pt-safe z-50">
        <Link to="/gallery" className={devLinkClass}>
          Экраны
        </Link>
        <Link to="/admin" className={devLinkClass}>
          Админка
        </Link>
      </div>

      <WidgetConfigProvider config={overrides}>
        <Widget />
      </WidgetConfigProvider>

      {/* Dev-ссылки снизу только на desktop-превью */}
      <Link
        to="/admin"
        className={`hidden sm:inline-flex fixed right-3 z-50 ${devLinkClass}`}
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        Админка
      </Link>
      <Link
        to="/gallery"
        className={`hidden sm:inline-flex fixed left-3 z-50 ${devLinkClass}`}
        style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        Экраны
      </Link>
    </div>
  );
}
