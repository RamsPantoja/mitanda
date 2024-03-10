import { api } from "@/trpc/react";


const useBatchMenubarLogic = ({ }) => {
    const { mutate: createBatchMutation, isLoading: createBatchLoading } = api.batch.create.useMutation({
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error.message);
        }
    })

    const onCreateBatch = (data: number) => {
        createBatchMutation({
            name: "Hola mundo"
        });
    }

    return {
        createBatchLoading,
        onCreateBatch
    }
}

export default useBatchMenubarLogic;