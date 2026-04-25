import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { get_backing_icon } from "#/skill_tree/icons";
import { dbrow_definitions } from "#/skill_tree/parse_skill_tree_elements";
import { useStore } from "#/stores/StoreContext.tsx";
import { getSpriteTile } from "./flow/SkillTreeNode";

const SearchBox = observer(() => {
  const store = useStore();

  const onOrderMouseEnter = useCallback(
    (id: string) =>
      store.setHoveredOrderId(id),
    [store],
  );
  const onOrderMouseLeave = useCallback(
    () => store.setHoveredOrderId(null),
    [store],
  );

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md px-4 py-2 bg-[#28221d] rounded-t border-b border-[#806f61] shadow-lg">
        Search Demonic Pacts
      </h2>
      <div className="w-full px-4 p-2 flex items-center gap-2">
        <input
          type="text"
          className="form-control rounded flex-3"
          value={store.searchQuery}
          placeholder="Search pact descriptions..."
          onChange={(e) => (store.searchQuery = e.target.value)}
        />
        <div className="flex-2 text-right text-sm">
          {store.searchQuery &&
            (store.nodesMatchingSearch.size > 0
              ? `${store.nodesMatchingSearch.size} highlighted`
              : "No matches")}
        </div>
      </div>
      <h2 className="text-shadow-md px-4 py-2 bg-[#28221d] rounded-t border-b border-[#806f61] shadow-lg">
        Pact Order
      </h2>
      <div className="flex-1 text-xs overflow-y-scroll">
        {store.selectedNodeIds.size === 0 ? (
          <div className="px-4 p-2">None selected</div>
        ) : (
          <ul>
            {Array.from(store.selectedNodeIds.values()).map((id, idx) => {
              const node = dbrow_definitions[id];
              if (node) {
                return (
                  <li
                    key={id}
                    className="p-2 border-b border-[#806f61] flex gap-2 items-center"
                    onMouseEnter={() => onOrderMouseEnter(id)}
                    onMouseLeave={onOrderMouseLeave}
                  >
                    <div
                      className="bg-cover size-8 square min-size-12 aspect-square flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${get_backing_icon(
                          true,
                          true,
                          node.node_size,
                        )})`,
                      }}
                    >
                      <img
                        className="size-4/6 object-center object-contain aspect-square"
                        src={getSpriteTile(node.row_id, true)}
                        alt="Pact icon"
                      />
                    </div>
                    {idx + 1}
                  </li>
                );
              }
              return undefined;
            })}
          </ul>
        )}
      </div>
    </div>
  );
});

export default SearchBox;
