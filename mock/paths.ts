import embeddings from "./data/embeddings.json";
import extensions from "./data/extensions.json";
import history from "./data/history.json";
import image from "./data/image.png";
import nodes from "./data/nodes.json";
import queue from "./data/queue.json";

export default {
  "GET /nodes": nodes,
  "GET /prompt": { exec_info: { queue_remaining: 0 } },
  "POST /prompt": { result: "true" },
};