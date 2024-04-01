import { getUserSession } from "../../actions";

const InviteLink = async () => {
    const session = await getUserSession();
    
    console.log(session);
    
    return (
        <div>
            <p>Link de invitacion</p>
        </div>
    )
}

export default InviteLink;