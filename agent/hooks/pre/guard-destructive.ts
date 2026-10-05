export default function guardDestructive(pi): void {
  pi.on('tool_call', async (event, ctx) => {
    if (event.toolName !== 'bash') return;

    const cmd = String(event.input.command ?? '');
    
    const dangerous = [
      /rm\s+-rf\s+(\/|~|\$HOME)/,
      /dd\s+.*of=\/dev\/(sd|nvme|hd)/,
      /mkfs\./,
      /:\(\)\{.*:\|:.*\};:/,  // fork bomb
      />\s*\/dev\/(sd|nvme)/,
      /curl.*\|\s*bash/,
      /wget.*\|\s*bash/,
    ];

    for (const pattern of dangerous) {
      if (pattern.test(cmd)) {
        return {
          block: true,
          reason: `Blocked dangerous command matching ${pattern}. If intentional, request explicit user confirmation.`
        };
      }
    }
  });
}
