import raw_dbrow_definitions from "./dbrow_definitions.json";

export enum NodeSize {
  Minor = "node_minor", // 2
  Major = "node_major", // 1
  Capstone = "node_capstone", // 3
}

export interface SkillTreeNodeInfo {
  draw_coord: {
    x: number;
    y: number;
  };
  name: string;
  row_id: string;
  node_size: NodeSize;
  effect: {
    name: string;
    value: number;
  };
  node_type?: string;
  linked_nodes: string[];
}

export const getDisplayId = (id: string) => id.replace(/^node/, "");
export const getNodeIdFromDisplay = (displayId: string) =>
  /^\d+$/.test(displayId) ? `node${displayId}` : displayId;

export const dbrow_definitions = raw_dbrow_definitions as {
  [key: string]: SkillTreeNodeInfo;
};
