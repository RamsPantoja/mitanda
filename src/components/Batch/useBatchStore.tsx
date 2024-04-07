import { type Batch } from '@/server/services/batch';
import { type BatchRegister } from '@/server/services/batchRegister';
import { create } from 'zustand';

type BatchWithBatchRegisters = Batch & { batchRegisters: BatchRegister[] };

type BatchState = {
    batch: BatchWithBatchRegisters | null
    setBatch: (batch: BatchWithBatchRegisters) => void
}

const useBatchStore = create<BatchState>()((set) => ({
    batch: null,
    setBatch: (batch) => set(() => ({ batch })),
}))

export default useBatchStore;