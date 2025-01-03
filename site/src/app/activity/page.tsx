"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import axios from "axios";
import {
    Input
} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PopoverTrigger, Popover, } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const createActivitySchema = z.object({
    goal: z.number({ required_error: "Goal points must be a number" }).gt(0, { message: "Goal must be greater than 0" }),
    reward: z.number({ required_error: "Reward must be a number" }).gt(0, "Reward must be greater than zero"),
    game_id: z.number({ required_error: "Please choose game" }),
    challenge_id: z.number({ required_error: "Please choose challenge" }),
    name: z.string(),
    image: z.instanceof(File),
    startDate: z.date().refine(date => date > new Date(), {
        message: "Start date must be in the future"
    }),
    endDate: z.date().refine(date => date > new Date(), {
        message: "End date must be in the future"
    }),
});

export default function CreateActivity() {
    const [games, setGames] = useState<{ id: number, name: string }[]>([]);
    const [challenges, setChallenges] = useState<{ id: number, name: string }[]>([]);
    const [gameSelected, setGameSelected] = useState<boolean>(false);
    const form = useForm<z.infer<typeof createActivitySchema>>({
        resolver: zodResolver(createActivitySchema),
    });
    const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

    async function onSubmit(values: z.infer<typeof createActivitySchema>) {
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
                const resp = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/activity/create/`,
                    {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "challenge_id": values.challenge_id,
                            "goal": values.goal,
                            "reward": values.reward,
                            "name": values.name,
                            "image": imagePath.data,
                            "startDate": values.startDate.toISOString(),
                            "endDate": values.endDate.toISOString(),

                        })
                    }
                );

                if (resp.status === 201) {
                    toast.success("Activity Craeted")
                } else {
                    const error = await resp.json()
                    console.log(error);
                    toast.error("Could Not Create Activity")
                }
            }


        } catch (err) {
            toast.error("Could Not Create Activity");
        }
    }

    useEffect(() => {
        getGames()
    }, []);

    async function getGames() {
        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/game`
            );

            if (resp.status === 200) {
                setGames(await resp.json());
            } else {
                throw new Error("Could Not Get Games")
            }
        } catch (err) {
            toast.error("Could Not Get Games");
        }
    }

    async function getChallenges(gameID: number) {
        try {
            const resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/challenges/${gameID}`
            );

            if (resp.status === 200) {
                setChallenges(await resp.json());
            } else {
                throw Error("Could Not Get Game Challenges")
            }
        } catch (err) {
            toast.error("Could Not Get Game Challenges");
        }
    }

    return (
        <div className=" w-2/3 p-4 m-auto rounded-2xl min-h-screen">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-row gap-4">

                        <FormField
                            control={form.control}
                            name="game_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Game</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-[200px] justify-between",
                                                        !field.value && "text-muted-foreground",

                                                    )}
                                                >
                                                    {field.value
                                                        ? games.find(
                                                            (g) => g.id === field.value
                                                        )?.name
                                                        : "Select Game"}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search game..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>No game found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {games.map((g) => (
                                                            <CommandItem
                                                                value={g.id.toString()}
                                                                key={g.id}
                                                                onSelect={() => {
                                                                    form.setValue("game_id", g.id);
                                                                    getChallenges(g.id);
                                                                    setGameSelected(true);
                                                                }}
                                                            >
                                                                {g.name}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        g.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div>
                            {gameSelected ? <div className="mb-4">
                                <FormField
                                    control={form.control}
                                    name="challenge_id"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Challenge</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-[200px] justify-between",
                                                                !field.value && "text-muted-foreground",

                                                            )}
                                                        >
                                                            {field.value
                                                                ? challenges.find(
                                                                    (challenge) => challenge.id === field.value
                                                                )?.name
                                                                : "Select challenge"}
                                                            <ChevronsUpDown className="opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search challenge..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>No challenge found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {challenges.map((challenge) => (
                                                                    <CommandItem
                                                                        value={challenge.name}
                                                                        key={challenge.id}
                                                                        onSelect={() => {
                                                                            form.setValue("challenge_id", challenge.id)
                                                                        }}
                                                                    >
                                                                        {challenge.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                challenge.id === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> : <div></div>}
                        </div>
                    </div>


                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Activity Name</FormLabel>
                                <FormControl>
                                    <Input

                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The name of the activity
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                </FormControl>
                                <FormDescription>
                                    The image of the activity
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Goal</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"

                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The amount of points needed to pass the activity
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <FormField
                        control={form.control}
                        name="reward"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reward</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"

                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The prize for completing the activity
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Activity start date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 " align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            className="bg-black"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    The date that the acivity should start
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Activity end date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            className="bg-black"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    The date that the acivity should end
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create</Button>
                </form>
            </Form>
        </div>
    );
}
