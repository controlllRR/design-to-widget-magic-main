import { createFileRoute, Link } from "@tanstack/react-router";
import Widget from "@/components/widget/Widget";
import { WidgetConfigProvider, useWidgetOverrides } from "@/widget/config";

export const Route = createFileRoute("/")({
  component: Index,
});

const devLinkClass =
  "text-xs px-3 py-1.5 rounded-full bg-white/90 text-neutral-700 shadow hover:bg-white pointer-events-auto";

/**
 * Виджет VirtuFit.
 * Ждём hydrated overrides из localStorage — иначе SSR отдаёт splash.enabled=true
 * и заставка мелькает при обновлении, даже если в админке выключена.
 */
function Index() {
  const [overrides, , , hydrated] = useWidgetOverrides();

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-[#e9e9ea] sm:items-center sm:justify-center sm:py-10 relative">
      <div className="sm:hidden shrink-0 flex justify-between items-center px-3 pb-2 vf-pt-safe z-50">
        <Link to="/gallery" className={devLinkClass}>
          Экраны
        </Link>
        <Link to="/admin" className={devLinkClass}>
          Админка
        </Link>
      </div>

      <WidgetConfigProvider config={overrides}>
        {hydrated ? (
          <Widget />
        ) : (
          <div
            aria-hidden
            className="relative flex flex-col overflow-hidden w-full flex-1 min-h-0 sm:flex-none sm:w-[375px] sm:h-[812px] sm:rounded-[36px] bg-white"
          />
        )}
      </WidgetConfigProvider>

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
