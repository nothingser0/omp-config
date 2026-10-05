const MAX_SIZE = 50_000; // 50KB

export default function truncateOutput(pi): void {
  pi.on('tool_result', async (event) => {
    if (event.isError) return;

    const truncated = event.content.map(chunk => {
      if (chunk.type !== 'text' || chunk.text.length <= MAX_SIZE) return chunk;
      
      const head = chunk.text.slice(0, MAX_SIZE / 2);
      const tail = chunk.text.slice(-MAX_SIZE / 2);
      const omitted = chunk.text.length - MAX_SIZE;
      
      return {
        ...chunk,
        text: head + `\n\n[... ${omitted} chars truncated ...]\n\n` + tail
      };
    });

    const hasChanges = truncated.some((chunk, i) => chunk !== event.content[i]);
    if (hasChanges) return { content: truncated };
  });
}
