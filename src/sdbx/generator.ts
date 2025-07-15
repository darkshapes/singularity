import { NodeConstructor } from '@/types'
import { useAppStore } from '@/store'
import config from '@/config'

type NodeTriggerSignal = { type: 'nodeTrigger'; payload: { nodeConstructor: NodeConstructor } }

export const handleNodeTrigger = (data: NodeTriggerSignal) => {
  const { nodeConstructor } = data.payload
  const { addNodes, constructNode, screenToFlowPosition } = useAppStore((s) => ({
    addNodes: s.addNodes,
    constructNode: s.constructNode,
    screenToFlowPosition: s.screenToFlowPosition
  }))

  // Assuming the incoming data is in a similar structure as what you're sending from the WebSocket server.
  const nodeData = {
    name: nodeConstructor.name,
    fn: nodeConstructor.fn,
    position: { x: 0, y: 0 }
  }

  const node = constructNode(nodeData)
  addNodes(node)
}

export const subscribeToTask = (taskId: string, callback: (data: any) => void): WebSocket => {
  const ws = new WebSocket(`ws://${config.host}/ws/${taskId}`)

  console.log("subscribed to task")
  console.log(taskId)

  ws.onmessage = (event: MessageEvent) => {
    const data: NodeTriggerSignal = JSON.parse(event.data)
    callback(data) // Invoke the callback with the received data
  }

  ws.onclose = () => {
    console.log("WebSocket connection closed")
  }

  ws.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  return ws // Return the WebSocket instance if needed for further control
}

// export const sendPrompt = async (
//   prompt: Graph
// ): Promise<PromptResult> => {
//   const response = await fetch(config.getBackendUrl("/prompt"), {
//     method: "POST",
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(prompt),
//   })

//   return await response.json()
// }
// ---

