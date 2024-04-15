import { create } from 'zustand';
import { type RouterOutput } from '@/server/root';
type BatchByIdQueryType = RouterOutput["batch"]["batchById"]

type BatchState = {
    batch: BatchByIdQueryType | null
    setBatch: (batch: BatchByIdQueryType) => void
    setParticipantIds: (ids: string[]) => void
    participantIds: string[] | null
}

const useBatchStore = create<BatchState>()((set) => ({
    batch: null,
    setBatch: (batch) => set(() => ({ batch })),
    participantIds: null,
    setParticipantIds: (ids) => set(() => ({ participantIds: ids })),
}))

export default useBatchStore;