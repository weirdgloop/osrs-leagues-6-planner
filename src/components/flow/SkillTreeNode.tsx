import {
  Handle,
  type Node,
  type NodeProps,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import { clsx } from "clsx";
import { observer } from "mobx-react-lite";
import { debuggingEnabled } from "#/components/debugging.tsx";
import { JSONify } from "#/components/JSONify.tsx";
import { useKeyPressed } from "#/components/useKeyPressed.tsx";
import spriteTiles from "#/skill_tree/icons/sprite_tiles.ts";
import { get_backing_icon, rowIdToTileInfo } from "#/skill_tree/icons.ts";
import {
  NodeSize,
  type SkillTreeNodeInfo,
} from "#/skill_tree/parse_skill_tree_elements.ts";
import { useStore } from "#/stores/StoreContext.tsx";

export type SkillTreeNodeDisplay = Node<
  { id: string; skillTreeNodeInfo: SkillTreeNodeInfo },
  "skillTreeNode"
>;

export const nodeBgColorClass = "bg-[oklch(0.3141_0.0074_31.1)]";
export const nodeBgColor = "oklch(0.3141 0.0074 31.1)";

export const nodeUnreachableBgColorClass = "bg-[oklch(0.37_0.0074_31.1)]";
export const nodeUnreachableBgColor = "oklch(0.37 0.0074 31.1)";

const nodeSizeToPx: { [key in NodeSize]: number } = {
  node_minor: 30,
  node_major: 45,
  node_capstone: 60,
};

export const DisplayEffect = ({
  name,
  effectValue,
    extraNote,
}: {
  name: string;
  effectValue: number;
    extraNote: string | null;
}) => {
    let text = name.replaceAll('#', String(effectValue));

    if (name.includes('+10% accuracy in all combat styles')) {
        text = text.replaceAll('+10% accuracy in all combat styles', `+${effectValue * 10}% accuracy in all combat styles`);
    }

  const parts = text.split(/(<col=[^>]+>.*?<\/col>)/g);

  return (
    <div className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        const match = part.match(/<col=[^>]+>(.*?)<\/col>/);
        if (match) {
          return (
            <div key={i} className="inline font-bold">
              {match[1]}
            </div>
          );
        }
        return part;
      })}
        {extraNote && (
            <div className="text-xs italic text-gray-500 dark:text-gray-300">
                <br />
                {extraNote}
            </div>
        )}
    </div>
  );
};

export const getSpriteTile = (row_id: string, selected: boolean) => {
  const active_inactive = selected ? "active" : "inactive";
  if (row_id in rowIdToTileInfo) {
    const { tileset, index } = rowIdToTileInfo[row_id];
    return spriteTiles[
      `league_6_combat_mastery_${tileset}_${active_inactive}_large,${index}`
    ];
  }
  return spriteTiles[
    `league_6_combat_mastery_generic_${active_inactive}_large,9`
  ];
};

export const SkillTreeNode = observer(
  ({ id, data }: NodeProps<SkillTreeNodeDisplay>) => {
    const store = useStore();
    const isShiftPressed = useKeyPressed("Shift");
    const isHovered = store.hoveredNodeId === id;

    const size = nodeSizeToPx[data.skillTreeNodeInfo.node_size];
    const isMatchingSearch = store.nodesMatchingSearch.has(
      data.skillTreeNodeInfo.row_id,
    );
    const isHoveredInOrder = store.hoveredNodeOrderId === id;

    return (
      <div>
        <NodeToolbar
          isVisible={isHovered}
          position={Position.Top}
          align="center"
          className="bg-[#28221d] border border-[#736559] shadow text-white text-center p-2 rounded flex flex-col gap-1 max-w-96 text-sm"
        >
          <DisplayEffect
            name={data.skillTreeNodeInfo.name}
            effectValue={data.skillTreeNodeInfo.effect.value}
            extraNote={null}
          />

          {debuggingEnabled && (
            <div className="">{data.skillTreeNodeInfo.row_id}</div>
          )}

          {debuggingEnabled && isShiftPressed && (
            <JSONify className="text-sm" value={data.skillTreeNodeInfo} />
          )}
        </NodeToolbar>
        <div
          className={clsx(
            "relative cursor-pointer flex items-center justify-center bg-cover",
          )}
          style={{
            width: size,
            height: size,
            backgroundImage: `url(${get_backing_icon(
              store.isNodeSelected(id),
              store.reachableNodeIds.has(id),
              data.skillTreeNodeInfo.node_size,
            )})`,
          }}
        >
          {(isMatchingSearch || isHoveredInOrder) && (
            <div
              className="absolute inset-0 bg-green-500/50 -z-10 scale-90 rotate-45"
              aria-hidden="true"
            />
          )}
          <img
            className="size-4/6 object-center object-contain"
            src={getSpriteTile(
              data.skillTreeNodeInfo.row_id,
              store.isNodeSelected(id),
            )}
            alt="Pact icon"
          />
          <Handle
            className="invisible top-1/2! size-0! min-w-0! min-h-0! border-0!"
            type="source"
            position={Position.Top}
          />
        </div>
      </div>
    );
  },
);
