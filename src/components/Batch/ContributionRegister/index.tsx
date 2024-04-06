"use client"

import { Card } from "@/components/ui/card";
import useContributionRegisterLogic from "./useContributionRegisterLogic";
import { Fragment } from "react";
import ContributionRegisterCard from "./ContributionRegisterCard";
import ContributionRegisterSkeleton from "./ContributionRegisterSkeleton";

const ContributionRegister = () => {
    const {
        participantsData,
        participantsIsLoading,
        participantsIsError
    } = useContributionRegisterLogic();

    return (
        <Card className="flex flex-col gap-2 max-h-96">
            <p className="text-whiteMain text-lg font-bold">Registro de contribuciones</p>
            <div className="h-full flex flex-col overflow-auto gap-4">
                
                {
                    participantsIsLoading &&
                    <Fragment>
                        <ContributionRegisterSkeleton />
                        <ContributionRegisterSkeleton />
                    </Fragment>
                }
                {
                    !participantsIsLoading && !participantsIsError && participantsData?.map((item) => {
                        return (
                            <ContributionRegisterCard
                                key={item.userId}
                                user={item.user}
                            />
                        )
                    })
                }
            </div>
        </Card>
    )
}

export default ContributionRegister;