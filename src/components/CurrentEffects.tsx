import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";
import { get_backing_icon } from "#/skill_tree/icons.ts";
import {
  DisplayEffect,
  getSpriteTile,
} from "#/components/flow/SkillTreeNode.tsx";

const combineEffectValues = (values: number[]) => {
  return values.reduce((acc, value) => acc + value, 0);
};

const CurrentEffects = observer(() => {
  const store = useStore();
  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md px-4 py-2 bg-[#28221d] rounded-t border-b border-[#806f61] shadow-lg">
        Current Effects
      </h2>
      <div className="flex-1 text-xs overflow-y-scroll">
        {store.currentEffects().size === 0 ? (
          <div className="px-4 p-2">None selected</div>
        ) : (
          <ul>
            {Array.from(store.currentEffects().values()).map(
              ({ skillTreeNodeInfo, values }, ix) => (
                <li
                  key={ix}
                  className="effect-container p-2 border-b border-[#806f61] flex gap-2 items-center"
                >
                  <div
                    className="bg-cover size-8 square min-size-12 aspect-square flex items-center justify-center"
                    style={{
                      backgroundImage: `url(${get_backing_icon(
                        true,
                        true,
                        skillTreeNodeInfo.node_size,
                      )})`,
                    }}
                  >
                    <img
                      className="size-4/6 object-center object-contain aspect-square"
                      src={getSpriteTile(skillTreeNodeInfo.row_id, true)}
                      alt="Pact icon"
                    />
                  </div>
                  <DisplayEffect
                    name={skillTreeNodeInfo.name}
                    effect_value={combineEffectValues(values)}
                  />
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CurrentEffects;
