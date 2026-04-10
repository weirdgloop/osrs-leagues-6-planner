import { observer } from "mobx-react-lite";
import { JSONify } from "#/components/JSONify.tsx";
import { dbrow_definitions } from "#/skill_tree/parse_skill_tree_elements.ts";

export const debuggingEnabled = import.meta.env.DEV;

export const DebuggingInfo = observer(() => {
  return debuggingEnabled ? (
    <div>
      Debugging info: <JSONify value={dbrow_definitions} />
    </div>
  ) : null;
});
