import { create } from 'zustand';
import { type RouterOutput } from '@/server/root';
type BatchByIdQueryType = RouterOutput["batch"]["batchById"]

type BatchState = {
    batch: BatchByIdQueryType | null
    setBatch: (batch: BatchByIdQueryType) => void
    setParticipantIds: (ids: string[]) => void
    participantIds: string[] | null
    currentBatchRegisterId: string | null
    setCurrentBatchRegisterId: (id: string) => void
}

const useBatchStore = create<BatchState>()((set) => ({
    batch: null,
    setBatch: (batch) => set(() => ({ batch })),
    participantIds: null,
    setParticipantIds: (ids) => set(() => ({ participantIds: ids })),
    currentBatchRegisterId: null,
    setCurrentBatchRegisterId: (id) => set(() => ({ currentBatchRegisterId: id }))
}))

export default useBatchStore;