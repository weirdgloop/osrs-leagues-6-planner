import { useStore } from "#/stores/StoreContext";
import { observer } from "mobx-react-lite";
import wiki from "./wiki.svg";
import { debuggingEnabled } from "#/components/debugging.tsx";
import PactsSpent from "#/components/PactsSpent.tsx";

const Header = observer(() => {
  const store = useStore();
  const node_scale_slider = (
    <div className="flex items-center gap-2">
      <label htmlFor="scale-slider" className="text-sm font-medium">
        Node scale: {store.scale.toFixed(1)}
      </label>
      <input
        id="scale-slider"
        type="range"
        min="0.20"
        max="4"
        step="0.1"
        value={store.scale}
        onChange={(e) => store.setScale(parseFloat(e.target.value))}
        className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
  return (
    <header className="sticky top-0 z-50 border-b-4 px-4 backdrop-blur-lg bg-[#28221d] border-b-[#736559] text-white">
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1 px-3 justify-between">
        <div className="flex w-full flex-wrap items-center gap-x-2 pb-1 text-sm font-semibold sm:w-auto sm:flex-nowrap sm:pb-0">
          <a href="https://oldschool.runescape.wiki" target="_blank">
            <img src={wiki} alt={"OSRS Wiki logo"} className="w-12" />
          </a>
          <h1 className="font-bold text-[16px] select-none">
            Demonic Pacts Planner
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <PactsSpent />
          {debuggingEnabled ? node_scale_slider : null}
          <a
            href="https://tools.runescape.wiki/osrs-dps/"
            target="_blank"
            className="text-orange-200 flex items-center gap-1 underline hover:text-orange-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-4 inline"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            DPS calculator
          </a>
        </div>
      </nav>
    </header>
  );
});

export default Header;
