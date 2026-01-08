
import { jest } from '@jest/globals'
import { handleNodeTrigger } from '@/sdbx/generator'
import { useAppStore } from '@/store'


// Jest replaces the real module with our stub
jest.mock('@/store', () => ({ useAppStore: jest.fn() }))

describe('handleNodeTrigger', () => {
    it('calls addNodes with constructed node', () => {
        const mockAddNodes = jest.fn()
        const mockConstructNode = jest.fn().mockReturnValue({ name: 'testNode', fn: jest.fn(), position: { x: 10, y: 20 }, })
        const mockScreenToFlowPosition = jest.fn().mockReturnValue({ x: 10, y: 20 })

        // cast once, then use
        const mockedUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>

        mockedUseAppStore.mockImplementation(selector =>
            selector({
                addNodes: mockAddNodes,
                constructNode: mockConstructNode,
                screenToFlowPosition: mockScreenToFlowPosition,
            }),
        )

        const nodeConstructor = { name: 'testNode', fn: jest.fn() }
        handleNodeTrigger({ type: 'nodeTrigger', payload: { nodeConstructor } })

        expect(mockAddNodes).toHaveBeenCalledTimes(1)
        const calledWith = mockAddNodes.mock.calls[0][0]

        expect(calledWith).toMatchObject({
            name: 'testNode',
            fn: expect.any(Function),
            position: { x: 10, y: 20 },
        })

    })
})