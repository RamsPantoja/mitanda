import { useState } from "react";


const useSidebarLogic = () => {
    const [displaySignOutAlert, setDisplaySignOutAlert] = useState<boolean>(false);
    

    return {
        displaySignOutAlert,
        setDisplaySignOutAlert
    }
}

export default useSidebarLogic;