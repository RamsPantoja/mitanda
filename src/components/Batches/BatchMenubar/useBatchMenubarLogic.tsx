import { api } from "@/trpc/react";
import useBatchFormLogic, { type BatchValidationSchema } from "../BatchForm/useBatchFormLogic";

const useBatchMenubarLogic = () => {
    const {
        useFormBatch
    } = useBatchFormLogic();

    const { mutate: createBatchMutation, isLoading: createBatchLoading } = api.batch.create.useMutation({
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        }
    })

    const onCreateBatch = (data: BatchValidationSchema) => {
        createBatchMutation({
            batchInput: {
                name: data.name,
                contributionAmount: data.contributionAmount,
                seats: data.seats,
                frequency: data.frequency
            }
        });
    }

    return {
        createBatchLoading,
        onCreateBatch,
        useFormBatch
    }
}

export default useBatchMenubarLogic;