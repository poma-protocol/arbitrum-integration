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

const createActivitySchema = z.object({
    goal: z.number({ required_error: "Goal points must be a number" }).gt(0, { message: "Goal must be greater than 0" }),
    reward: z.number({ required_error: "Reward must be a number" }).gt(0, "Reward must be greater than zero"),
    game_id: z.number({ required_error: "Please choose game" }),
    challenge_id: z.number({ required_error: "Please choose challenge" })
});

const games = [
    { label: "Call of Duty", value: 1 },
    { label: "FIFA", value: 2 },
    { label: "Hell Divers 2", value: 3 },
]

const challenges = [
    { label: "Get X Kills", value: 1 },
    { label: "Score X goals", value: 2 },
    { label: "Kill X terminids", value: 3 },
]

export default function CreateActivity() {
    const form = useForm<z.infer<typeof createActivitySchema>>({
        resolver: zodResolver(createActivitySchema),
    });

    function onSubmit(values: z.infer<typeof createActivitySchema>) {
        console.log(values)
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
                                                                (g) => g.value === field.value
                                                            )?.label
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
                                                                    value={g.label}
                                                                    key={g.value}
                                                                    onSelect={() => {
                                                                        form.setValue("game_id", g.value)
                                                                    }}
                                                                >
                                                                    {g.label}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            g.value === field.value
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
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="mb-4">
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
                                                                (challenge) => challenge.value === field.value
                                                            )?.label
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
                                                                    value={challenge.label}
                                                                    key={challenge.value}
                                                                    onSelect={() => {
                                                                        form.setValue("challenge_id", challenge.value)
                                                                    }}
                                                                >
                                                                    {challenge.label}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            challenge.value === field.value
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
                                    </FormItem>
                                )}
                            />
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
                                        <Input className="bg-slate-50 text-black" {...field} />
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
                                        <Input className="bg-slate-50 text-black" {...field} />
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