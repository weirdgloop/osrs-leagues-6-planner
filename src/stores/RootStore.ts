import { makeAutoObservable } from "mobx";
import type { Edge, Node } from "@xyflow/react";
import {
  dbrow_definitions,
  type SkillTreeNodeInfo,
} from "#/skill_tree/parse_skill_tree_elements.ts";

export const initialNodes: Node[] = Array.from(
  Object.entries(dbrow_definitions),
).map(([key, value]) => ({
  id: key,
  type: "skillTreeNode",
  position: { x: value.draw_coord.x, y: value.draw_coord.y },
  data: { label: value.name, id: key, skillTreeNodeInfo: value },
  selectable: false,
}));

const rootNode: Node = initialNodes.find(
  (node) => node.position.x === 0 && node.position.y === 0,
)!;

export const initialEdges: Edge[] = Array.from(
  Object.entries(dbrow_definitions),
).flatMap(([key, value]) =>
  value.linked_nodes
    .filter((linkedNode) => key < linkedNode)
    .map((linkedNode) => ({
      id: `${key}-${linkedNode}`,
      type: "skillTreeEdge",
      source: key,
      target: linkedNode,
      selectable: false,
    })),
);

export class RootStore {
  selectedNodeIds = new Set<string>([rootNode.id]);
  hoveredNodeId: string | null = null;
  loadedFromUrl = false;
  searchQuery = "";

  constructor() {
    makeAutoObservable(this);
  }

  get reachableNodeIds() {
    const reachable = new Set<string>();
    for (const selectedId of this.selectedNodeIds) {
      const node = dbrow_definitions[selectedId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (!this.selectedNodeIds.has(linkedId)) {
            reachable.add(linkedId);
          }
        }
      }
    }
    return reachable;
  }

  setSelectedNodes(ids: string[], fromUrl = false) {
    this.loadedFromUrl = fromUrl;
    this.selectedNodeIds = new Set(ids);
  }

  setHoveredNode(id: string | null) {
    this.hoveredNodeId = id;
  }

  pruneStrandedNodes() {
    if (this.selectedNodeIds.size === 1) {
      return;
    }

    const visited = new Set<string>([rootNode.id]);
    const queue: string[] = [rootNode.id];

    let head = 0;
    while (head < queue.length) {
      const currentId = queue[head++];
      const node = dbrow_definitions[currentId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (this.selectedNodeIds.has(linkedId) && !visited.has(linkedId)) {
            visited.add(linkedId);
            queue.push(linkedId);
          }
        }
      }
    }

    this.selectedNodeIds = visited;
  }

  toggleNodeSelection(id: string) {
    if (id === rootNode.id) {
      this.selectedNodeIds.clear();
      this.selectedNodeIds.add(rootNode.id);
      return;
    }

    if (this.selectedNodeIds.has(id)) {
      this.selectedNodeIds.delete(id);
      this.pruneStrandedNodes();
    } else if (this.reachableNodeIds.has(id)) {
      this.selectedNodeIds.add(id);
    } else {
      this.pathToSelection(id);
    }
  }

  isNodeSelected(id: string) {
    return this.selectedNodeIds.has(id);
  }

  pathToSelection(id: string) {
    const nodesToSelect = this.getNodesToSelect(id);
    for (const nodeId of nodesToSelect) {
      this.selectedNodeIds.add(nodeId);
    }
  }

  getNodesToSelect(id: string): Set<string> {
    const nodesToSelect = new Set<string>();
    if (this.selectedNodeIds.has(id)) {
      return nodesToSelect;
    }

    const queue: string[] = [id];
    const parent = new Map<string, string | null>();
    parent.set(id, null);

    let foundTarget: string | null = null;
    let head = 0;

    const isTarget = (nodeId: string) => {
      return this.selectedNodeIds.has(nodeId);
    };

    while (head < queue.length) {
      const currentId = queue[head++];
      if (isTarget(currentId)) {
        foundTarget = currentId;
        break;
      }

      const node = dbrow_definitions[currentId];
      if (node) {
        for (const linkedId of node.linked_nodes) {
          if (!parent.has(linkedId)) {
            parent.set(linkedId, currentId);
            queue.push(linkedId);
          }
        }
      }
    }

    if (foundTarget) {
      let curr: string | null = foundTarget;
      while (curr !== null) {
        if (!this.selectedNodeIds.has(curr)) {
          nodesToSelect.add(curr);
        }
        curr = parent.get(curr) || null;
      }
    }

    return nodesToSelect;
  }

  get nodesToSelectIfHoveredSelected(): Set<string> {
    if (!this.hoveredNodeId) {
      return new Set();
    }
    return this.getNodesToSelect(this.hoveredNodeId);
  }

  currentEffects(): Map<
    string,
    {
      skillTreeNodeInfo: SkillTreeNodeInfo;
      values: number[];
    }
  > {
    const effects = new Map<
      string,
      {
        skillTreeNodeInfo: SkillTreeNodeInfo;
        values: number[];
      }
    >();
    for (const id of this.selectedNodeIds) {
      const node = dbrow_definitions[id];
      if (node) {
        const existingEffect = effects.get(node.effect.name);
        if (existingEffect) {
          if (
            existingEffect.skillTreeNodeInfo.name?.length < node.name?.length
          ) {
            existingEffect.skillTreeNodeInfo = node;
          }
          existingEffect.values.push(node.effect.value);
        } else {
          effects.set(node.effect.name, {
            skillTreeNodeInfo: node,
            values: [node.effect.value],
          });
        }
      }
    }
    return effects;
  }

  get nodesMatchingSearch(): Set<string> {
    if (!this.searchQuery) {
      return new Set();
    }

    const normalize = (text: string) =>
    text
      .replace(/<col=[^>]+>(.*?)<\/col>/gi, "$1")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    const query = normalize(this.searchQuery);

    return new Set(
      Object.keys(dbrow_definitions).filter((id) =>
        normalize(dbrow_definitions[id].name ?? "").includes(query),
      ),
    );
  }
}

export const rootStore = new RootStore();
