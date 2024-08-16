"use client"

import {signOut} from "next-auth/react";
import {on} from "next/dist/client/components/react-dev-overlay/pages/bus";

interface LogoutButtonProps {
    children?: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
    const onClick = () => {
        signOut()
    }

    return (
        <span onClick={onClick} className={"cursor-pointer"}>
            {children}
        </span>
    )
}