import { StartPage, type StartPageProps } from "@/components/widget/screens/StartPage";

/**
 * Start-page alt — Figma `674:4033`.
 * Вариант с акцентом на экспресс-примерку (дефолтный выбор).
 */
export function StartPageAlt(props: Omit<StartPageProps, "defaultVariant">) {
  return <StartPage {...props} defaultVariant="express" />;
}
