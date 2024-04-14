import ContributionCard from "./ContributionCard";
import ContributionSkeletonCard from "./ContributionSkeletonCard";

const ContributionList = () => {
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
            <ContributionSkeletonCard />
            <ContributionCard />
            <ContributionCard />
        </div>
    )
}

export default ContributionList;