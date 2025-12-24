'use client';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonButtons, IonButton, useIonActionSheet, IonBackButton, IonModal, IonItem, IonLabel, IonInput, IonTextarea, useIonAlert } from '@ionic/react';
import { add, trash, arrowBack, saveOutline, closeOutline } from 'ionicons/icons';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge as flowAddEdge, Connection, Edge, Node as FlowNode, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import MindMapNode from '@/components/MindMapNode';
import { useSearchParams, useRouter } from 'next/navigation';

const nodeTypes = {
  mindMap: MindMapNode,
};

export default function MindMapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mapId = searchParams.get('id');
  
  const { nodes, edges, addNode, updateNode, deleteNode, addEdge, deleteEdge, maps, addMap } = useStore();
  const [present] = useIonActionSheet();
  const [presentAlert] = useIonAlert();
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const currentMap = maps.find(m => m.id === mapId);

  // Filter nodes and edges for this map
  const mapNodes = useMemo(() => nodes.filter(n => n.mapId === mapId), [nodes, mapId]);
  const mapEdges = useMemo(() => edges.filter(e => e.mapId === mapId), [edges, mapId]);

  // Local state for React Flow (for smooth dragging)
  const [rfNodes, setRfNodes] = useNodesState<FlowNode>([]);
  const [rfEdges, setRfEdges] = useEdgesState<Edge>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync store -> local state
  useEffect(() => {
    if (!mapId) return;

    const flowNodes: FlowNode[] = mapNodes.map(n => ({
      id: n.id,
      position: n.position,
      data: { label: n.title },
      type: 'mindMap',
    }));

    const flowEdges: Edge[] = mapEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'default',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }));

    // We only update if the count changes or if it's the first load to avoid jitter during drag
    // But we need to be careful about position updates from other sources.
    // For now, we'll trust local state for position during drag, and store for structure.
    setRfNodes(flowNodes);
    setRfEdges(flowEdges);
  }, [mapNodes.length, mapEdges.length, mapId]); // Only sync on structural changes or map switch

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setRfNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
        updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setRfEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && mapId) {
        addEdge({
          source: params.source,
          target: params.target,
          mapId: mapId,
        });
      }
    },
    [addEdge, mapId],
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
        edgesToDelete.forEach(e => {
            deleteEdge(e.id);
        });
    },
    [deleteEdge]
  );

  const onNodesDelete = useCallback(
    (nodesToDelete: FlowNode[]) => {
        nodesToDelete.forEach(n => {
            deleteNode(n.id);
        });
    },
    [deleteNode]
  );

  const handleAddNode = () => {
      if (!mapId) {
          // First time adding a node -> Create Map
          presentAlert({
              header: 'Create New Mind Map',
              message: 'Enter a name for your new mind map to get started.',
              inputs: [
                  {
                      name: 'name',
                      type: 'text',
                      placeholder: 'My Awesome Map',
                  },
              ],
              buttons: [
                  {
                      text: 'Cancel',
                      role: 'cancel',
                  },
                  {
                      text: 'Create',
                      handler: (data) => {
                          if (data.name) {
                              const newMapId = addMap(data.name);
                              
                              // Add first node
                              addNode({
                                  mapId: newMapId,
                                  title: 'Central Idea',
                                  content: '',
                                  tags: [],
                                  position: { x: 0, y: 0 }, // Center
                                  isMarkdown: false,
                              });

                              // Update URL to include the new ID
                              router.replace(`/mindmap?id=${newMapId}`);
                          }
                      },
                  },
              ],
          });
          return;
      }

      // Smart placement: Place below the last added node or slightly offset from center
      // We use rfNodes to find a good spot
      let position = { x: 0, y: 0 };
      if (rfNodes.length > 0) {
          // Find the node with the highest Y value (lowest on screen)
          const lowestNode = rfNodes.reduce((prev, current) => (prev.position.y > current.position.y) ? prev : current);
          position = {
              x: lowestNode.position.x + (Math.random() * 50 - 25), // Slight X jitter
              y: lowestNode.position.y + 100, // 100px below
          };
      } else {
          // Center-ish
          position = { x: 0, y: 0 };
      }

      addNode({
          title: 'New Idea',
          content: '',
          tags: [],
          position: position,
          isMarkdown: false,
          mapId: mapId,
      });
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
      const storeNode = nodes.find(n => n.id === node.id);
      if (storeNode) {
          setSelectedNodeId(node.id);
          setEditTitle(storeNode.title);
          setEditContent(storeNode.content || '');
          setIsModalOpen(true);
      }
  }, [nodes]);

  const handleSaveNode = () => {
      if (selectedNodeId) {
          updateNode(selectedNodeId, {
              title: editTitle,
              content: editContent
          });
          setIsModalOpen(false);
      }
  };

  const handleDeleteNode = () => {
      if (selectedNodeId) {
          deleteNode(selectedNodeId);
          setIsModalOpen(false);
      }
  };

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      event.preventDefault();
      
      // Find connected edges
      const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
      
      const buttons = [
        {
            text: 'Delete Node',
            role: 'destructive',
            icon: trash,
            handler: () => {
                deleteNode(node.id);
            },
        },
        ...connectedEdges.map(edge => ({
            text: `Delete Connection to ${nodes.find(n => n.id === (edge.source === node.id ? edge.target : edge.source))?.title || 'Unknown'}`,
            icon: closeOutline,
            handler: () => {
                deleteEdge(edge.id);
            }
        })),
        {
            text: 'Cancel',
            role: 'cancel',
            icon: closeOutline
        }
      ];

      present({
        header: 'Node Actions',
        subHeader: node.data.label as string,
        buttons: buttons,
        cssClass: 'custom-action-sheet'
      });
    },
    [present, deleteNode, deleteEdge, edges, nodes]
  );

  if (!mounted) return null;

  // Removed the early return for !mapId to allow empty state

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/maps" />
          </IonButtons>
          <IonTitle>{currentMap?.title || 'New Mind Map'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <div style={{ width: '100%', height: '100%', touchAction: 'none' }}>
            <ReactFlow
                nodes={rfNodes}
                edges={rfEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgesDelete={onEdgesDelete}
                onNodesDelete={onNodesDelete}
                onNodeClick={onNodeClick}
                onNodeDragStop={onNodeDragStop}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                fitView
                defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
                minZoom={0.1}
                className="bg-background touch-none"
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls className="bg-card text-foreground border-border" />
                <MiniMap className="bg-card border-border" maskColor="#020617" nodeColor="#3b82f6" />
            </ReactFlow>
        </div>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="mb-24 mr-4 z-50">
          <IonFabButton onClick={handleAddNode} color="primary" className="shadow-xl">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit Node</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsModalOpen(false)}>
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="flex flex-col gap-4 h-full">
                    <div className="bg-card p-4 rounded-xl border border-border">
                        <IonLabel className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Title</IonLabel>
                        <IonInput
                            value={editTitle}
                            onIonInput={e => setEditTitle(e.detail.value!)}
                            placeholder="Node Title"
                            className="font-bold text-lg"
                        />
                    </div>
                    
                    <div className="bg-card p-4 rounded-xl border border-border flex-1 flex flex-col">
                        <IonLabel className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Details</IonLabel>
                        <IonTextarea
                            value={editContent}
                            onIonInput={e => setEditContent(e.detail.value!)}
                            placeholder="Add detailed notes..."
                            className="flex-1 h-full font-mono text-sm"
                            style={{ height: '100%' }}
                        />
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <IonButton expand="block" color="danger" fill="outline" className="flex-1" onClick={handleDeleteNode}>
                            <IonIcon slot="start" icon={trash} />
                            Delete
                        </IonButton>
                        <IonButton expand="block" color="primary" className="flex-1" onClick={handleSaveNode}>
                            <IonIcon slot="start" icon={saveOutline} />
                            Save
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

