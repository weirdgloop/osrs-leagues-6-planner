import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";
import { get_backing_icon } from "#/skill_tree/icons.ts";
import {
  DisplayEffect,
  getSpriteTile,
} from "#/components/flow/SkillTreeNode.tsx";
import {dbrow_definitions} from "#/skill_tree/parse_skill_tree_elements.ts";

const combineEffectValues = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const CurrentEffects = observer(() => {
  const store = useStore();

    const numericEffectTotals = new Map<string, number>(
        Array.from(store.currentEffects.values()).map(({ skillTreeNodeInfo, values }) => [
            skillTreeNodeInfo.effect.name,
            combineEffectValues(values),
        ]),
    );

    const magic = numericEffectTotals.get('talent_percentage_magic_damage') ?? 0;
    const ranged = numericEffectTotals.get('talent_percentage_ranged_damage') ?? 0;
    const melee = numericEffectTotals.get('talent_percentage_melee_damage') ?? 0;
    const extraAllStyleAccuracy = 10 * (magic + ranged + melee);

    const currentEffects = Array.from(store.currentEffects.values());

    if (extraAllStyleAccuracy > 0 && !store.currentEffects.has('talent_all_style_accuracy')) {
        currentEffects.push({
            skillTreeNodeInfo: dbrow_definitions['node7'],
            values: [],
        });
    }

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-shadow-md px-4 py-2 bg-[#28221d] rounded-t border-b border-[#806f61] shadow-lg">
        Current Effects
      </h2>
      <div className="flex-1 text-xs overflow-y-scroll">
        {currentEffects.length === 0 ? (
          <div className="px-4 p-2">None selected</div>
        ) : (
          <ul>
            {currentEffects.map(
              ({ skillTreeNodeInfo, values }, ix) => {
                  let effectValue = combineEffectValues(values);

                  let extraNote = null;

                  if (skillTreeNodeInfo.effect.name === 'talent_all_style_accuracy') {
                      effectValue = (effectValue as number) + extraAllStyleAccuracy;
                      extraNote = `This includes +${extraAllStyleAccuracy}% from additional damage nodes.`;
                  }

                  return (
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
                              effectValue={effectValue}
                              extraNote={extraNote}
                          />
                      </li>
                  );
              },
            )}
          </ul>
        )}
      </div>
    </div>
  );
});

export default CurrentEffects;
