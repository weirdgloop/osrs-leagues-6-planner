import {
  Background,
  ConnectionMode,
  Controls,
  type CoordinateExtent,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import {
  getDisplayId,
  getNodeIdFromDisplay,
} from "#/skill_tree/parse_skill_tree_elements.ts";
import { SkillTreeNode } from "#/components/flow/SkillTreeNode.tsx";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "#/stores/StoreContext.tsx";
import SkillTreeEdge from "#/components/flow/SkillTreeEdge.tsx";
import { useKeyPressed } from "#/components/useKeyPressed.tsx";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { initialEdges, initialNodes } from "#/stores/RootStore.ts";
import localforage from "localforage";

const nodeTypes = { skillTreeNode: SkillTreeNode };
const edgeTypes = { skillTreeEdge: SkillTreeEdge };

const SkillTreeDisplay = observer(() => {
  const store = useStore();
  const { n } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const isShiftPressed = useKeyPressed("Shift");

  // Sync URL to Store (initial load and browser navigation)
  useEffect(() => {
    const storeNodeIds = Array.from(store.selectedNodeIds).sort();

    if (n) {
      // load from url
      const urlNodeIds = (n?.split("-").filter(Boolean) || [])
        .map(getNodeIdFromDisplay)
        .sort();

      if (urlNodeIds.length === 0) {
        return; // no-op, use default from store
      }

      if (JSON.stringify(storeNodeIds) !== JSON.stringify(urlNodeIds)) {
        store.setSelectedNodes(urlNodeIds);
      }
    } else {
      // load from localstorage
      localforage
        .getItem("demonicpacts-nodes")
        .then((selectedNodes: unknown) => {
          if (selectedNodes) {
            const nodeIds = ((selectedNodes as string[]).filter(Boolean) || [])
              .map(getNodeIdFromDisplay)
              .sort();

            if (JSON.stringify(storeNodeIds) !== JSON.stringify(nodeIds)) {
              store.setSelectedNodes(nodeIds);
            }
          }
        });
    }
  }, [n]);

  // Sync Store to URL using MobX reaction
  useEffect(
    () =>
      reaction(
        () => Array.from(store.selectedNodeIds).sort(),
        async (storeNodeIds) => {
          if (!store.loadedFromUrl) {
            await localforage.setItem("demonicpacts-nodes", storeNodeIds);
          }

          const urlNodeIds = (n?.split("-").filter(Boolean) || [])
            .map(getNodeIdFromDisplay)
            .sort();

          if (JSON.stringify(storeNodeIds) !== JSON.stringify(urlNodeIds)) {
            const displayIds = storeNodeIds.map(getDisplayId);
            navigate({
              search: (old) => ({
                ...old,
                n: displayIds.length > 0 ? displayIds.join("-") : undefined,
              }),
              replace: true,
            });
          }
        },
        { fireImmediately: false },
      ),
    [navigate, n],
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const translateExtent: CoordinateExtent = useMemo(() => {
    const maxX = Math.max(...nodes.map((node) => node.position.x));
    const maxY = Math.max(...nodes.map((node) => node.position.y));
    const minX = Math.min(...nodes.map((node) => node.position.x));
    const minY = Math.min(...nodes.map((node) => node.position.y));
    const padding = 1000;
    return [
      [minX - padding, minY - padding],
      [maxX + padding, maxY + padding],
    ];
  }, []);

  const onNodeClick = useCallback(
    (_event: unknown, node: { id: string }) => {
      if (node) {
        if (isShiftPressed) {
          store.pathToSelection(node.id);
        } else {
          store.toggleNodeSelection(node.id);
        }
      }
    },
    [isShiftPressed, store],
  );
  const onNodeMouseEnter = useCallback(
    (_event: unknown, node: { id: string | null }) =>
      store.setHoveredNode(node.id),
    [store],
  );
  const onNodeMouseLeave = useCallback(
    () => store.setHoveredNode(null),
    [store],
  );
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      store.setHoveredNode(node.id);
    },
    [store],
  );
  const onPaneClick = useCallback(() => store.setHoveredNode(null), [store]);

  return (
    <div className="flex-1 w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
        translateExtent={translateExtent}
        nodesDraggable={false}
        nodesConnectable={false}
        nodeOrigin={[0.5, 0.5]}
        edgesFocusable={false}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        elementsSelectable={false}
        connectionMode={ConnectionMode.Loose}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background bgColor={"#4A4034"} />
        <Controls showInteractive={false} showFitView={false} />
      </ReactFlow>
    </div>
  );
});

export default SkillTreeDisplay;
