import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";

const SearchBox = observer(() => {
  const store = useStore();

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md px-4 py-2 bg-[#28221d] rounded-t border-b border-[#806f61] shadow-lg">
        Search Demonic Pacts
      </h2>
      <div className="w-full px-4 p-2 flex items-center gap-2">
        <input
          type="text"
          className="form-control rounded flex-2"
          value={store.searchQuery}
          placeholder="Search pact descriptions..."
          onChange={(e) => (store.searchQuery = e.target.value)}
        />
        <div className="flex-1 text-right text-sm">
          {store.searchQuery &&
            (store.nodesMatchingSearch.size > 0
              ? `${store.nodesMatchingSearch.size} highlighted`
              : "No matches")}
        </div>
      </div>
    </div>
  );
});

export default SearchBox;
