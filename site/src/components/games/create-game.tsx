"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
const formSchema = z.object({
    gameName: z.string(),
    contractAddress: z.string(),
    functionName: z.string(),
    contractAbi: z.string(),
});
export default function CreateGame() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gameName: "",
            contractAddress: "",
            functionName: "",
            contractAbi: "",
        },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {

    }
    return (
        <>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="gameName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Game name e.g Fifa" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The name of the game you want to create
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contractAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The contract address of the game
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="contractAbi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract ABI</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contract ABI" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The contract ABI of the game
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="functionName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Function Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="function name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The function name of the game
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                       
                    </form>
                </Form>
            </div>
        </>
    )
}