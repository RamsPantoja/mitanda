import BatchesContainer from "@/components/Batches/BatchesContainer";
import { getUserSession } from "../actions";

const Batches = async () => {
    const session = await getUserSession();

    return (
        <BatchesContainer
            session={session}
        />
    )
}

export default Batches;