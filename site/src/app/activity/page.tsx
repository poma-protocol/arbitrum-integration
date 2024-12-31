"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
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

const createActivitySchema = z.object({
    goal: z.number({ required_error: "Goal points must be a number" }).gt(0, { message: "Goal must be greater than 0" }),
    reward: z.number({ required_error: "Reward must be a number" }).gt(0, "Reward must be greater than zero"),
    game_id: z.number({ required_error: "Please choose game" }),
    challenge_id: z.number({ required_error: "Please choose challenge" })
});

export default function CreateActivity() {
    const [games, setGames] = useState<{ id: number, name: string }[]>([]);
    const [challenges, setChallenges] = useState<{ id: number, name: string }[]>([]);
    const [gameSelected, setGameSelected] = useState<boolean>(false);
    const form = useForm<z.infer<typeof createActivitySchema>>({
        resolver: zodResolver(createActivitySchema),
    });

    async function onSubmit(values: z.infer<typeof createActivitySchema>) {
        try {
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
                        "reward": values.reward
                    })
                }
            );

            if (resp.status === 201) {
                console.log("Activity Created");
            } else {
                const error = await resp.json()
                console.log(error);
                throw new Error("Could Not Create Activity");
            }
        } catch (err) {
            console.log("Erorr Creating Activity =>", err);
        }
    }

    useEffect(() => {
        getGames()
    }, []);

    async function getGames() {
        try {
            let resp = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/game`
            );

            if (resp.status === 200) {
                setGames(await resp.json());
            } else {
                throw new Error("Could Not Get Games")
            }
        } catch (err) {
            console.log("Error Getting Games =>", err);
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
            console.log("Error Getting Challenges =>", err);
        }
    }

    return (
        <div className="bg-poma_grey w-2/3 p-4 m-auto rounded-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-row gap-4">
                        <div className="mb-4">
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
                                                            "bg-slate-50 text-black"
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
                        </div>

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
                                                                "bg-slate-50 text-black"
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

                    <div className="mb-4">
                        <FormField
                            control={form.control}
                            name="goal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Goal</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="bg-slate-50 text-black"
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
                    </div>

                    <div className="mb-4">
                        <FormField
                            control={form.control}
                            name="reward"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reward</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="bg-slate-50 text-black"
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
                    </div>

                    <Button type="submit">Create</Button>
                </form>
            </Form>
        </div>
    );
}