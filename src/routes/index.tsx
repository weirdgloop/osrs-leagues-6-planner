import { createFileRoute } from "@tanstack/react-router";
import "@xyflow/react/dist/style.css";
import SkillTreeDisplay from "#/components/flow/SkillTreeDisplay.tsx";
import { DebuggingInfo } from "#/components/debugging.tsx";
import CurrentEffects from "#/components/CurrentEffects.tsx";

type SkillTreeSearchParams = {
  n?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): SkillTreeSearchParams => {
    return {
      n: (search.n as string) || undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col h-[calc(100vh-60px)]">
        <SkillTreeDisplay />
        <div className="md:absolute md:right-0 flex md:mr-2 md:mt-2 h-72 md:h-auto md:max-h-8/12 md:w-87.5 md:rounded bg-[#1b1612] text-white border border-[#736559] shadow-xl">
          <CurrentEffects />
        </div>
      </div>
      <DebuggingInfo />
    </>
  );
}
