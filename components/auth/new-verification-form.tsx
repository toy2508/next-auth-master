"use client"

import {CardWrapper} from "@/components/auth/card-wrapper";
import {BeatLoader} from "react-spinners";
import {useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {newVerification} from "@/actions/new-verification";
import {FormSuccess} from "@/components/form-success";
import {FormError} from "@/components/form-error";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();


    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError("Missing token!")
            return;
        }

        await newVerification(token).then((data) => {
            setError(data.error)
            setSuccess(data.success)
        }).catch(() => {
            setError("Something went wrong!");
        })

    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])


    return (
        <CardWrapper
            headerLabel={"Confirming your verification"}
            backButtonLabel={"Back to Login"}
            backButtonHref={"/auth/login"}
        >
            <div className={"flex items-center w-full justify-center"}>
                {!success && !error && (
                    <BeatLoader/>
                )}
                <FormSuccess message={success}/>
                {!success && (
                    <FormError message={error}/>
                )}

            </div>
        </CardWrapper>
    )
}