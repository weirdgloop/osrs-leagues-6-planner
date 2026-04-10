import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";
import { clsx } from "clsx";

const PactsSpent = observer(() => {
  const store = useStore();
  return (
    <span className="font-medium">
      <span
        className={clsx("font-bold", {
          "text-orange-300":
            store.selectedNodeIds.size >= 30 && store.selectedNodeIds.size < 40,
          "text-red-300 underline": store.selectedNodeIds.size >= 40,
        })}
      >
        {store.selectedNodeIds.size}
      </span>{" "}
      / 40 pacts spent
    </span>
  );
});

export default PactsSpent;
