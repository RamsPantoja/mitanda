import { type BatchContributionWithUser } from "@/server/services/batchContribution";
import ContributionCard from "./ContributionCard";
import ContributionSkeletonCard from "./ContributionSkeletonCard";
import { Fragment } from "react";
import { mapSkeletons } from "@/lib/utils";
import FeedbackMessage from "@/components/common/FeedbackMessage";

type ContributionListProps = {
    list: BatchContributionWithUser[] | undefined
    isLoading: boolean
    isError: boolean
}

const ContributionList = ({ list, isLoading, isError }: ContributionListProps) => {
    const skeletons = mapSkeletons({ numberOfSkeletons: 10, skeleton: <ContributionSkeletonCard /> });

    return (
        <div>
            <div className="flex p-4 justify-between">
                <div className="flex items-center w-full min-w-40">
                    <span className="text-grayMain text-xs">Usuario</span>
                </div>
                <div className="flex items-center w-full">
                    <span className="text-grayMain text-xs">Creada en</span>
                </div>
                <div className="flex items-center w-full justify-end">
                    <span className="text-grayMain text-xs">Cantidad</span>
                </div>
            </div>
            {
                isLoading && skeletons.map((skeleton, index) => {
                    return <Fragment key={index}>
                        {skeleton}
                    </Fragment>
                })
            }
            {
                !isLoading && !isError && list?.map((item) => {
                    return (
                        <ContributionCard
                            user={item.user}
                            key={item.id}
                            createdAt={item.createdAt}
                            amount={item.amount}
                        />
                    )
                })
            }
            {
                !isLoading && !isError && list?.length === 0 &&
                <FeedbackMessage status="INFORMATION" message="No hay contribuciones realizadas" />
            }
            {
                !isLoading &&
                isError &&
                <FeedbackMessage status="ERROR" message="Algo salio mal! No se pueden obtener las contribuciones." />
            }
        </div>
    )
}

export default ContributionList;