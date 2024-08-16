import {auth} from "@/auth";
import {currentUser} from "@/lib/auth";
import {UserInfo} from "@/components/user-info";

const ServerPage = async () => {
    const user = await currentUser();

    return (
        <div>
            <UserInfo label={"Server component"} user={user} />
        </div>
    )
}

export default ServerPage;