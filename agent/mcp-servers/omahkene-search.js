#!/usr/bin/env node

const API_KEY = process.env.OMAHKENE_API_KEY;
const BASE_URL = process.env.OMAHKENE_BASE_URL;

if (!API_KEY || !BASE_URL) {
  console.error("Error: OMAHKENE_API_KEY and OMAHKENE_BASE_URL environment variables are required");
  process.exit(1);
}

async function searchWeb(query, maxResults = 5) {
  const response = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "ag",
      query,
      search_type: "web",
      max_results: maxResults,
    }),
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return await response.json();
}

async function fetchUrl(url) {
  const response = await fetch(`${BASE_URL}/web/fetch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "tavily",
      url,
      format: "markdown",
      max_characters: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }

  return await response.json();
}

// MCP Server
const server = {
  async listTools() {
    return {
      tools: [
        {
          name: "omahkene_search",
          description: "Search the web using Omahkene search API",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
              max_results: {
                type: "number",
                description: "Maximum number of results (default: 5)",
                default: 5,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "omahkene_fetch",
          description: "Fetch and convert a URL to markdown",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "URL to fetch",
              },
            },
            required: ["url"],
          },
        },
      ],
    };
  },

  async callTool(name, args) {
    if (name === "omahkene_search") {
      const result = await searchWeb(args.query, args.max_results || 5);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === "omahkene_fetch") {
      const result = await fetchUrl(args.url);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  },
};

// MCP Protocol handler
process.stdin.setEncoding("utf8");
let buffer = "";

process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    let request;

    try {
      request = JSON.parse(line);
      let result;

      if (request.method === "initialize") {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "omahkene-search", version: "1.0.0" }
        };
      } else if (request.method === "tools/list") {
        result = await server.listTools();
      } else if (request.method === "tools/call") {
        result = await server.callTool(request.params.name, request.params.arguments || {});
      } else {
        throw new Error(`Unknown method: ${request.method}`);
      }

      process.stdout.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request.id,
          result,
        }) + "\n"
      );
    } catch (error) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: request?.id || null,
          error: {
            code: -32603,
            message: error.message,
          },
        }) + "\n"
      );
    }
  }
});

process.stdin.on("end", () => {
  process.exit(0);
});
