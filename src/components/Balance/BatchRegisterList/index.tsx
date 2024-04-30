import FeedbackMessage from "@/components/common/FeedbackMessage";
import useBatchRegisterLogic from "./useBatchRegisterLogic"
import BatchRegisterCardSkeleton from "./BatchRegisterCardSkeleton";
import { mapSkeletons } from "@/lib/utils";
import { Fragment } from "react";
import BatchRegisterCard from "./BatchRegisterCard";
import { Card } from "@/components/ui/card";

const BatchRegisterList = () => {
  const {
    batchRegistersData,
    batchRegistersError,
    batchRegistersIsLoading,
  } = useBatchRegisterLogic();

  const skeletons = mapSkeletons({ numberOfSkeletons: 10, skeleton: <BatchRegisterCardSkeleton /> });
//TODO revisar el problema con el query y que no llegan los datos al front, revisar si se hace en el back
  return (
    <Card className="w-full h-full gap-2 flex flex-col">
      <p className="text-whiteMain text-lg font-bold">Ganancias por tanda</p>
      <div className="flex flex-row flex-wrap w-full gap-4 content-start justify-start">
        {
          batchRegistersIsLoading && skeletons.map((skeleton, index) => {
            return <Fragment key={index}>
              {skeleton}
            </Fragment>
          })
        }
        {
          !batchRegistersIsLoading && !batchRegistersError && batchRegistersData?.map((item) => {
            return (
              <BatchRegisterCard
                key={item.id}
                batchName={item.batch.name}
                amount={parseInt(item.contributionAmount)}
              />
            )
          })
        }
        {
          !batchRegistersIsLoading && !batchRegistersError && batchRegistersData?.length === 0 &&
          <FeedbackMessage status="INFORMATION" message="Actualmente, no hay tandas activas en las que estés inscrito." />
        }
        {
          !batchRegistersIsLoading &&
          batchRegistersError &&
          <FeedbackMessage status="ERROR" message="Algo salio mal! No se pueden obtener las ganancias." />
        }
      </div>
    </Card>
  )
}

export default BatchRegisterList;
