import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { db, initDB } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());

// Initialize SQLite DB
await initDB();

// Setup MCP Server
const mcpServer = new Server({
  name: "civiclens-mcp-backend",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_posts",
        description: "Retrieve all civic issue posts",
        inputSchema: {
          type: "object",
          properties: {
            status: { type: "string" },
            severity: { type: "string" }
          }
        }
      },
      {
        name: "create_post",
        description: "Create a new civic issue post",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            image_url: { type: "string" },
            issue_type: { type: "string" },
            severity: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            reporter_name: { type: "string" }
          },
          required: ["title", "description", "issue_type", "severity", "latitude", "longitude", "reporter_name"]
        }
      },
      {
        name: "update_status",
        description: "Admin feature: update status of a post",
        inputSchema: {
          type: "object",
          properties: {
            post_id: { type: "string" },
            status: { type: "string", enum: ["Pending", "In Progress", "Resolved"] }
          },
          required: ["post_id", "status"]
        }
      },
      {
        name: "upvote_post",
        description: "Upvote a post",
        inputSchema: {
          type: "object",
          properties: {
            post_id: { type: "string" }
          },
          required: ["post_id"]
        }
      }
    ]
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_posts") {
    let query = "SELECT * FROM Posts";
    const conditions = [];
    const params = [];
    
    if (request.params.arguments?.status) {
      conditions.push("status = ?");
      params.push(request.params.arguments.status);
    }
    if (request.params.arguments?.severity) {
      conditions.push("severity = ?");
      params.push(request.params.arguments.severity);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY created_at DESC";

    const posts = await db.allAsync(query, params);
    return {
      content: [{ type: "text", text: JSON.stringify(posts) }]
    };
  }
  
  if (request.params.name === "create_post") {
    const { title, description, image_url, issue_type, severity, latitude, longitude, reporter_name } = request.params.arguments;
    const id = uuidv4();
    await db.runAsync(
      `INSERT INTO Posts (id, title, description, image_url, issue_type, severity, status, latitude, longitude, reporter_name) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)`,
      [id, title, description, image_url || 'https://picsum.photos/400/300', issue_type, severity, latitude, longitude, reporter_name]
    );
    return {
      content: [{ type: "text", text: JSON.stringify({ success: true, id }) }]
    };
  }

  if (request.params.name === "update_status") {
    const { post_id, status } = request.params.arguments;
    await db.runAsync(`UPDATE Posts SET status = ? WHERE id = ?`, [status, post_id]);
    await db.runAsync(
      `INSERT INTO AdminActions (post_id, action_taken, updated_status) VALUES (?, 'Status Updated', ?)`,
      [post_id, status]
    );
    return {
      content: [{ type: "text", text: JSON.stringify({ success: true, post_id, status }) }]
    };
  }

  if (request.params.name === "upvote_post") {
    const { post_id } = request.params.arguments;
    await db.runAsync(`UPDATE Posts SET upvotes = upvotes + 1 WHERE id = ?`, [post_id]);
    const updated = await db.getAsync(`SELECT upvotes FROM Posts WHERE id = ?`, [post_id]);
    return {
      content: [{ type: "text", text: JSON.stringify({ success: true, upvotes: updated.upvotes }) }]
    };
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

// SSE Transport setup
let transport;
app.get('/sse', async (req, res) => {
  console.log("New SSE Connection");
  transport = new SSEServerTransport('/message', res);
  await mcpServer.connect(transport);
});

app.post('/message', async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(503).send("No strict SSE connection active");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP SSE Server listening on http://localhost:${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
  console.log(`Message endpoint: http://localhost:${PORT}/message`);
});
