export default function redactSecrets(pi): void {
  pi.on('tool_result', async (event) => {
    if (event.isError) return;
  
    const patterns = [
      /sk-[a-zA-Z0-9]{32,}/g,
      /AIza[a-zA-Z0-9_-]{35}/g,
      /ghp_[a-zA-Z0-9]{36}/g,
      /gho_[a-zA-Z0-9]{36}/g,
      /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/g,
      /AKIA[0-9A-Z]{16}/g,
      /(?:token|key|secret|password|passwd|pwd)["']?\s*[:=]\s*["']?([a-zA-Z0-9+\/]{32,}={0,2})["']?/gi,
    ];

    let changed = false;
    const redacted = event.content.map(chunk => {
      if (chunk.type !== 'text') return chunk;
      let text = chunk.text;
      for (const pattern of patterns) {
        const next = text.replace(pattern, '[REDACTED]');
        if (next !== text) {
          changed = true;
          text = next;
        }
      }
      return { ...chunk, text };
    });

    if (changed) return { content: redacted };
  });
}
