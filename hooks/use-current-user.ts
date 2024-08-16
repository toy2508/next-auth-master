"use client"
import {UserRole} from "@prisma/client";
import {getCurrentUser} from "@/actions/user";
import {getAccountByUserId} from "@/data/accounts";
import {usePathname} from "next/navigation";
import {useCallback, useEffect, useState} from "react";

type UserProps = {
    id: string,
    name: string,
    email: string,
    image: string,
    role: UserRole,
    isTwoFactorEnabled: boolean,
    isOAuth: boolean,
}

export const useCurrentUser = (): UserProps | null => {

    const [user, setUser] = useState<UserProps | null>(null);
    const pathname = usePathname()

    const retrieveSession = useCallback(async () => {
        const curUser = await getCurrentUser();

        if (!curUser || !curUser.id) {
            return null
        }

        const account = await getAccountByUserId(curUser.id)

        let isOAuth = false
        if (account) {
            if (account.type) {
                isOAuth = true
            }
        }

        setUser(prevState => {

            const newUser: UserProps = {
                id: curUser.id!,
                name: curUser.name!,
                email: curUser.email!,
                image: curUser.image!,
                role: curUser.role,
                isTwoFactorEnabled: curUser.isTwoFactorEnabled,
                isOAuth: isOAuth,
            }

            if (!prevState) {
                return newUser;
            }

            return {...prevState, ...newUser}
        })

    }, [])

    useEffect(() => {
        if (!user) {
            retrieveSession().then()
        }

    }, [retrieveSession, user, pathname])

    return user;
}