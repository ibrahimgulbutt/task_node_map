import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from '@/store/useStore';
import { IonIcon } from '@ionic/react';
import { move } from 'ionicons/icons';

const MindMapNode = ({ id, selected }: NodeProps) => {
  const node = useStore((state) => state.nodes.find((n) => n.id === id));

  if (!node) return null;

  return (
    <div className={`group px-4 py-3 shadow-lg rounded-lg bg-card border-2 min-w-[160px] transition-all duration-200 ${selected ? 'border-primary shadow-primary/40 scale-105' : 'border-border hover:border-primary/50'}`}>
      {/* Drag Handle */}
      <div className="drag-handle absolute -top-3 left-1/2 transform -translate-x-1/2 bg-muted text-muted-foreground rounded-full p-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
        <IonIcon icon={move} className="w-3 h-3" />
      </div>

      <Handle type="target" position={Position.Top} className="!w-5 !h-5 !bg-primary border-2 border-background" />
      
      <div className="flex flex-col items-center justify-center min-h-[2rem]">
        <span className="text-center font-bold text-lg text-foreground w-full break-words select-none">
          {node.title || 'New Node'}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-5 !h-5 !bg-primary border-2 border-background" />
    </div>
  );
};

export default memo(MindMapNode);
