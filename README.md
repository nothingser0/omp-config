# OMP Config

My [OhMyPi](https://github.com/can1357/oh-my-pi) setup with hooks, agents, skills, and MCP servers.

## Setup

```bash
git clone https://github.com/nothingser0/omp-config ~/.omp
cd ~/.omp

# Copy and edit configs
cp mcp.json.example mcp.json
cp agent/config.yml.example agent/config.yml
cp agent/models.yml.example agent/models.yml

# Add your API keys to the files above
```

## What's Here

**Hooks** - Security guards for destructive commands and secret leaks

**Agents** - Task runners, reviewers, explorers for different work

**Skills** - Debugging recipes, TDD patterns, git workflows, UI work

**MCP Servers** - 15 servers including memory, filesystem, github, linear, figma, supabase

## Config Files

Real config files (with actual keys) are gitignored. The `.example` files show structure with placeholders.

Replace these in your actual configs:
- `mcp.json` - API keys for MCP servers
- `agent/config.yml` - Provider URL and API key
- `agent/models.yml` - Model definitions

## Structure

```
.omp/
├── agent/
│   ├── hooks/pre/          # Pre-execution guards
│   ├── hooks/post/         # Post-execution filters
│   ├── agents/             # Custom subagents
│   ├── skills/             # Reusable patterns
│   └── mcp-servers/        # Custom MCP implementations
├── mcp.json.example        # MCP server template
└── .gitignore              # Keeps secrets out
```

## MCP Servers

Some work immediately (memory, filesystem, time). Others need keys in `mcp.json`:

- figma, github, linear - Personal access tokens
- google-stitch - Google API key
- supabase - Project ref + token
- omahkene-search - Custom search endpoint

Check the example file for exact env var names.
