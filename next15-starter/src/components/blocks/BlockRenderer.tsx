import type { WpPageBlock } from "@/types/wp";
import { parseFlexibleBlock } from "@/components/blocks/registry";

export interface BlockRendererProps {
  blocks: WpPageBlock[];
}

function UnknownBlockFallback({
  blockId,
  originalType,
  fieldGroupName,
}: {
  blockId: string;
  originalType: string;
  fieldGroupName: string | null;
}) {
  return (
    <section id={blockId} className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Unknown flexible block skipped.</p>
        <p className="mt-1 text-xs text-amber-700">Type: {originalType || "unknown"} | Field group: {fieldGroupName ?? "n/a"}</p>
      </div>
    </section>
  );
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks.length) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const parsed = parseFlexibleBlock(block, index);

        if (parsed.kind === "unknown") {
          return (
            <UnknownBlockFallback
              key={parsed.blockId}
              blockId={parsed.blockId}
              originalType={block.type}
              fieldGroupName={block.fieldGroupName}
            />
          );
        }

        const Component = parsed.component;
        return <Component key={parsed.blockId} blockId={parsed.blockId} data={parsed.data} />;
      })}
    </>
  );
}
