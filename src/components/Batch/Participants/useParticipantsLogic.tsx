import { useState } from "react"
import { api } from "@/trpc/server"
import { toast } from "sonner"

const useParticipantsLogic = () => {
  const [displayDeleteReuquestDialog, setDisplayDeleteRequestDialog] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)
  const utils = api.useUtils()

  const { mutate: deleteUser, isPending: deleteUserIsPeding } = api.batch.deleteUserFromBatch.useMutation({
    onSuccess: async () => {
      toast.success('Usuario eliminado correctamente!')
      setDisplayDeleteRequestDialog(false)
      setUserId(null)
      await utils.userToBatch.getParticipantsFromBatch.invalidate()
    },
    onError: (error) => {
      toast.error("Algo salió mal!", {
        description: error.message,
        action: {
          label: 'Enviar reporte',
          onClick: () => console.log("R")
        },
      })
    }
  });

  return {
    displayDeleteReuquestDialog,
    setDisplayDeleteRequestDialog,
    userId,
    setUserId,
    deleteUser,
    deleteUserIsPeding
  }
}

export default useParticipantsLogic