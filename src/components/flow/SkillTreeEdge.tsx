import {
  BaseEdge,
  type Edge,
  type EdgeProps,
  getStraightPath,
} from "@xyflow/react";
import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";

type SkillTreeEdgeProps = Edge<{ value: number }, "skillTreeEdge">;

const SkillTreeEdge = observer((props: EdgeProps<SkillTreeEdgeProps>) => {
  const { id, source, sourceX, sourceY, target, targetX, targetY } = props;
  const store = useStore();

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const sourceSelected = store.isNodeSelected(source);
  const targetSelected = store.isNodeSelected(target);
  const isSelected = Number(sourceSelected) + Number(targetSelected);

  const toBeSelected = store.nodesToSelectIfHoveredSelected;
  const isPathHighlighted =
    (toBeSelected.has(source) || sourceSelected) &&
    (toBeSelected.has(target) || targetSelected) &&
    (toBeSelected.has(source) || toBeSelected.has(target));

  let strokeWidth: number;
  if (isSelected === 0) {
    strokeWidth = 1;
  } else if (isSelected === 1) {
    strokeWidth = 2;
  } else {
    strokeWidth = 3;
  }

  let stroke: string;
  if (isPathHighlighted) {
    stroke = "#22c55e";
  } else if (isSelected === 0) {
    stroke = "#000000";
  } else if (isSelected === 1) {
    stroke = "#bd000b";
  } else {
    stroke = "#fae17d";
  }

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        strokeWidth,
        stroke,
      }}
    />
  );
});

export default SkillTreeEdge;
