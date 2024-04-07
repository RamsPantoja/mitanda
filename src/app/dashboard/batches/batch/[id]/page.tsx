import { getUserSession } from "@/app/dashboard/actions";
import BatchContainer from "@/components/Batch/BatchContainer";

const Batch = async () => {
    const session = await getUserSession();
    
    return (
        <BatchContainer session={session} />
    )
}

export default Batch;