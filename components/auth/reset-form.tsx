"use client"
import {CardWrapper} from "@/components/auth/card-wrapper";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {LoginSchema, ResetSchema} from "@/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {login} from "@/actions/login";
import {useState, useTransition} from "react";
import Link from "next/link";
import {reset} from "@/actions/reset";

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition(async () => {
            await reset(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        })
    }


    return (
        <CardWrapper
            headerLabel={"Forgot your password?"}
            backButtonLabel={"Back to login"}
            backButtonHref={"/auth/login"}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={"space-y-6"}
                >
                    <div className={"space-y-4"}>
                        <FormField
                            control={form.control}
                            name={"email"}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder={"john.doe@example.com"}
                                            type={"email"}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button
                        type={"submit"}
                        className={"w-full"}
                        disabled={isPending}
                    >
                       Send reset email
                    </Button>
                </form>
            </Form>

        </CardWrapper>
    )
}
