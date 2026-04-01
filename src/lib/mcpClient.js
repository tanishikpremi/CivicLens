import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

let _client = null;
let _connectionPromise = null;

export const mcpClient = {
  connect: async () => {
    if (_client) return _client;
    if (_connectionPromise) return _connectionPromise;

    _connectionPromise = (async () => {
      try {
        const transport = new SSEClientTransport(new URL("http://localhost:3001/sse"));
        const client = new Client({ name: "civiclens-frontend", version: "1.0.0" }, { capabilities: {} });
        
        await client.connect(transport);
        _client = client;
        console.log("Connected to MCP Backend");
        return client;
      } catch (err) {
        console.error("MCP Backend Connection Failed", err);
        throw err;
      }
    })();
    
    return _connectionPromise;
  },

  getPosts: async (filters = {}) => {
    try {
      const client = await mcpClient.connect();
      const result = await client.callTool({
        name: "get_posts",
        arguments: filters
      });
      const posts = JSON.parse(result.content[0].text);
      return posts.map(p => ({
        ...p,
        lat: p.latitude,
        lng: p.longitude,
        author: p.reporter_name,
        category: p.issue_type,
        timestamp: p.created_at
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  createPost: async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      issue_type: data.category || data.issue_type,
      severity: data.severity,
      latitude: data.lat || data.latitude,
      longitude: data.lng || data.longitude,
      reporter_name: data.author || data.reporter_name
    };
    const client = await mcpClient.connect();
    const result = await client.callTool({
      name: "create_post",
      arguments: payload
    });
    return JSON.parse(result.content[0].text);
  },

  updateStatus: async (post_id, status) => {
    const client = await mcpClient.connect();
    const result = await client.callTool({
      name: "update_status",
      arguments: { post_id, status }
    });
    return JSON.parse(result.content[0].text);
  },

  upvotePost: async (post_id) => {
    const client = await mcpClient.connect();
    const result = await client.callTool({
      name: "upvote_post",
      arguments: { post_id }
    });
    return JSON.parse(result.content[0].text);
  }
};
