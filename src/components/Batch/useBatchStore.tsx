import { create } from 'zustand';
import { type RouterOutput } from '@/server/root';
type BatchByIdQueryType = RouterOutput["batch"]["batchById"]

type BatchState = {
    batch: BatchByIdQueryType | null
    setBatch: (batch: BatchByIdQueryType) => void
}

const useBatchStore = create<BatchState>()((set) => ({
    batch: null,
    setBatch: (batch) => set(() => ({ batch })),
}))

export default useBatchStore;