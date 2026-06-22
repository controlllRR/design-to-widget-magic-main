import { createFileRoute, Link } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import Widget from "@/components/widget/Widget";
import { WIDGET_SCREENS } from "@/widget/screen-registry";
import { WidgetConfigProvider, useWidgetOverrides } from "@/widget/config";
import type { WidgetRoute } from "@/widget/navigation";

export const Route = createFileRoute("/gallery")({
  validateSearch: (search: Record<string, unknown>) => ({
    screen: (search.screen as WidgetRoute | undefined) ?? undefined,
    phase: (search.phase as "A" | "B" | "C" | "D" | "all" | undefined) ?? "all",
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { screen: screenParam, phase } = useSearch({
    from: "/gallery",
  });
  const [overrides] = useWidgetOverrides();
  const previewScreen = screenParam ?? "start-page";

  const filteredScreens =
    phase === "all" ? WIDGET_SCREENS : WIDGET_SCREENS.filter((e) => e.phase === phase);

  return (
    <div className="min-h-[100dvh] bg-[#e9e9ea] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_375px]">
        <section className="bg-white rounded-xl shadow p-6 min-w-0">
          <div className="flex flex-wrap gap-2 mb-4">
            {(["all", "A", "B", "C", "D"] as const).map((p) => (
              <Link
                key={p}
                to="/gallery"
                search={{ screen: previewScreen, phase: p }}
                replace
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  phase === p
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                {p === "all" ? "Все фазы" : p === "D" ? "Оверлеи" : `Фаза ${p}`}
              </Link>
            ))}
          </div>

          <ul className="space-y-1 max-h-[min(70vh,640px)] overflow-y-auto pr-1">
            {filteredScreens.map((entry) => {
              const active = previewScreen === entry.slug;
              return (
                <li key={entry.slug}>
                  <Link
                    to="/gallery"
                    search={{ screen: entry.slug, phase }}
                    replace
                    className={`w-full flex flex-col gap-0.5 px-3 py-2 rounded-lg text-left border ${
                      active
                        ? "bg-neutral-100 border-neutral-300"
                        : "border-transparent hover:bg-neutral-50 hover:border-neutral-200"
                    }`}
                  >
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span className="text-xs text-neutral-600">{entry.nameRu}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link to="/" className="inline-block mt-4 text-sm text-neutral-600 underline">
            ← Виджет
          </Link>
        </section>

        <div className="flex justify-center lg:justify-start lg:sticky lg:top-8 self-start">
          <div className="w-[375px] shrink-0">
            <WidgetConfigProvider config={overrides}>
              <Widget key={previewScreen} initialScreen={previewScreen} />
            </WidgetConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
