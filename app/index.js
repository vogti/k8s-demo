const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const os = require("os");
const path = require("path");

const USE_DATABASE = process.env.USE_DATABASE === "true";

if (USE_DATABASE) {
  console.log("Running in postgres mode");
} else {
  console.log("Running in memory mode");
}

const persistence = USE_DATABASE ? require("./postgres") : require("./memory");

const app = express();
const port = 8080;
const PASSWORD = process.env.APP_PASSWORD; 

if (!PASSWORD) {
  console.error("ERROR: APP_PASSWORD environment variable is not set.");
  process.exit(1);
}

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1];
  if (token !== PASSWORD) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  next();
}


// Endpoint for authentication
app.post("/api/auth", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.status(200).json({ message: "Authenticated" });
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
});

// Endpoint to retrieve all posts
app.get("/api/posts", authenticate, async (req, res) => {
  const posts = await persistence.getPosts();
  res.json({ posts, nodeInfo: getNodeInfo() });
});

// Endpoint to add a post
app.post("/api/posts", authenticate, async (req, res) => {
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({ message: "Name and content are required" });
  }

  const post = { name, content, timestamp: new Date() };
  await persistence.addPost(post);
  res.json({ message: "Post created", nodeInfo: getNodeInfo() });
  
  broadcast({ post, nodeInfo: getNodeInfo() });
});

function getNodeInfo() {
const hostname = process.env.NODE_NAME | os.hostname();
const pod = os.hostname();
  const ipInterface = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface.family === "IPv4" && !iface.internal);
  const podip = ipInterface ? ipInterface.address : "Unknown IP";
  const ip = process.env.NODE_IP | podip;
  return { hostname, ip, pod, podip };
}

const wss = new WebSocket.Server({ noServer: true });

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const password = url.searchParams.get("password");

  if (password !== PASSWORD) {
    ws.close(1008, "Unauthorized");
    return;
  }

  ws.on("message", (message) => {
    console.log("Received message:", message);
  });

  ws.send(JSON.stringify({ message: "Connected", nodeInfo: getNodeInfo() }));
});

const server = app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
