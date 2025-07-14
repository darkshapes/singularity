import { NodeConstructor, NodeFunction } from '@/types'
import { useAppStore } from '@/store'
import { subscribeToTask } from './prompt'
import config from '@/config'

type NodeTriggerSignal = { type: 'nodeTrigger'; payload: { nodeConstructor: NodeConstructor } }

export const handleNodeTrigger = (data: NodeTriggerSignal) => {
  const { nodeConstructor } = data.payload
  const { addNodes, constructNode, screenToFlowPosition } = useAppStore((s) => ({
    addNodes: s.addNodes,
    constructNode: s.constructNode,
    screenToFlowPosition: s.screenToFlowPosition
  }))
  const node = constructNode({ name: nodeConstructor.name, fn: nodeConstructor.fn, position: screenToFlowPosition({ x: 0, y: 0 }) })
  addNodes(node)
}

export const ws = subscribeToTask('nodeTriggerTask', handleNodeTrigger)

// import { NodePickerComponent, addNodes } from "@/components/node-menu/node-picker"


// const handleNodeTrigger = (data: NodeTriggerSignal) => {
//   const { nodeConstructor } = data.payload
//   const addNodes(constructNode({ name, fn, position: screenToFlowPosition({ x: e.clientX, y: e.clientY }) }))
//   // const newNode = constructNode({ name: nodeConstructor.name, fn: nodeConstructor.fn, position: screenToFlowPosition({ x: 0, y: 0 }) })
//   // addNodes([newNode])
// }

// import config from "@/config"

// export const getNodeLibrary = async (): Promise<any> =>
//     await (await fetch(config.getBackendUrl("/nodes"))).json()


// type TaskSubscriptionResult = { task_id: string }
//     | { results: string; completed?: true; error?: never }
//     | { error: string; results?: never; completed?: never }

// export const subscribeToTask = (taskId: string, callback: (data: any) => void): WebSocket => {
//     const ws = new WebSocket(`ws://${config.host}/ws/${taskId}`)

//     console.log("subscribed to task")
//     console.log(taskId)

//     ws.onmessage = (event: MessageEvent) => {
//         const data: TaskSubscriptionResult = JSON.parse(event.data)
//         callback(data)  // Invoke the callback with the received data
//     }

//     ws.onclose = () => {
//         console.log("WebSocket connection closed")
//     }

//     ws.onerror = (error) => {
//         console.error("WebSocket error:", error)
//     }

//     return ws  // Return the WebSocket instance if needed for further control
// }

// const cb = (e: React.MouseEvent | React.DragEvent) => addNodes(constructNode({ name, fn, position: screenToFlowPosition({ x: e.clientX, y: e.clientY }) }))

// import { ReactFlowInstance, addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react"
// import { useAppStore } from '@/store'
// import { AppInstance, AppNode } from '@/types'

// const addNode = (newNode: AppNode) => {
//     const appStore = useAppStore()
//     appStore.nodes.push(newNode)
//     appStore.onNodesChange(applyNodeChanges(appStore.nodes, [newNode]))
// }

// const removeNode = (nodeToRemove: AppNode) => {
//     const appStore = useAppStore()
//     const index = appStore.nodes.findIndex((node) => node === nodeToRemove)
//     if (index !== -1) {
//         appStore.nodes.splice(index, 1)
//         appStore.onNodesChange(applyNodeChanges(appStore.nodes, [nodeToRemove]))
//     }
// }


// import { sendPrompt, subscribeToTask } from '@/sdbx/prompt'

// async function addNode(nodeName: string) {
//     const response = await sendPrompt({ type: 'addNode', name: nodeName })
//     if (response.error) {
//         console.error(`Failed to add node: ${response.error}`)
//         return
//     }
//     console.log(`Node ${nodeName} added successfully`)
//     // Update your graph state here
// }
// async function deleteNode(nodeId: string) {
//     const response = await sendPrompt({ type: 'deleteNode', id: nodeId })
//     if (response.error) {
//         console.error(`Failed to delete node: ${response.error}`)
//         return
//     }
//     console.log(`Node ${nodeId} deleted successfully`)
//     // Update your graph state here
// }

// const ws = subscribeToTask(taskId, (data) => {
//     if (data.error) {
//         console.error(`Subscription error: ${data.error}`)
//     } else if (data.results) {
//         console.log(`Received results: ${data.results}`)
//         // Handle received results here
//     }
// })

// // Usage
// addNode('New Node')
// deleteNode('Existing Node')