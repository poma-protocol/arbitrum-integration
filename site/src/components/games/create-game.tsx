"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoIosAddCircleOutline, IoMdAddCircle, IoMdRemoveCircleOutline } from "react-icons/io";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios"
const challengeSchema = z.object({
    name: z.string().nonempty("Challenge name is required"),
    function_name: z.string().nonempty("Function name is required"),
    player_address_variable: z
        .string()
        .nonempty("Player address variable is required"),
});
const formSchema = z.object({
    gameName: z.string(),
    contractAddress: z.string(),
    contractAbi: z.string(),
    image: z.instanceof(File),
    challenges: z.array(challengeSchema),
    category: z.string(),
});

export default function CreateGame() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gameName: "",
            contractAddress: "",
            contractAbi: "",
            image: undefined,
            challenges: [{ name: "", function_name: "", player_address_variable: "" }],
        },
    });
    const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
    const categories = [
        "Arcade",
        "Adventure",
        "Strategy",
        "Sports",
        "Puzzle",
        "Simulation",
        "Racing",
        "Fighting",
    ];
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("values", values);
        try {
            //Start by uploading the image
            const formData = new FormData();
            formData.append('image', values.image);
            const imagePath = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/game/upload`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },

                }
            )
            if (imagePath.status === 200 || imagePath.status === 201) {
                console.log("Sending the rest of the game");
                const response = await axios.post(`${NEXT_PUBLIC_BACKEND_URL}/game/register`, {

                    name: values.gameName,
                    contract_address: values.contractAddress,
                    abi: values.contractAbi,
                    category: values.category,
                    image: imagePath.data,
                    challenges: values.challenges

                })
                if (response.status === 200 || response.status === 201) {
                    toast.success("Game Created Successfully")

                    return
                }
                else {
                    toast.error("Could Not Create Game")

                }
            }

        }
        catch (error) {
            console.log(error);
            toast.error("Could Not Create Game")
        }
    }
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "challenges",
    });

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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {

                                                field.onChange(value);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    categories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Game Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                    </FormControl>
                                    <FormDescription>
                                        The image of the game
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
                                        <Textarea placeholder="contract json." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The contract ABI of the game
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Dynamic Challenges Section */}
                        <div className="flex flex-col space-y-4">
                            <h2>Challenges</h2>
                            {fields.map((item, index) => (
                                <div key={item.id}>
                                    <FormField
                                        control={form.control}
                                        name={`challenges.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Challenge Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter challenge name" />
                                                </FormControl>
                                                <FormDescription>
                                                    The challenge name
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`challenges.${index}.function_name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Function Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Enter function name" />
                                                </FormControl>
                                                <FormDescription>
                                                    The function name of the challenge
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`challenges.${index}.player_address_variable`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Player Address Variable</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter player address variable"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The name of the variable that holds the player address
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button onClick={() => remove(index)}>
                                        <IoMdRemoveCircleOutline /> Remove challenge
                                    </Button>
                                </div>
                            ))}
                            <Button
                                size="sm"
                                onClick={() =>
                                    append({ name: "", function_name: "", player_address_variable: "" })
                                }
                            >
                                <IoMdAddCircle /> Add challenge
                            </Button>
                        </div>
                        <Button type="submit">Create Game</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}