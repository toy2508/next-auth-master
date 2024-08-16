"use client"

import {auth} from "@/auth";
import {currentUser} from "@/lib/auth";
import {UserInfo} from "@/components/user-info";
import {useCurrentUser} from "@/hooks/use-current-user";

const ClientPage = () => {
    const user = useCurrentUser();

    return (
        <div>
            <UserInfo label={"Client component"} user={user!} />
        </div>
    )
}

export default ClientPage;