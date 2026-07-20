import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { LucideIcon } from "lucide-react";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

type TextFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: string;
    icon?: LucideIcon;
};

export function TextField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    icon: Icon,
}: TextFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>

                    <FormLabel>{label}</FormLabel>

                    <FormControl>

                        <div className="relative">

                            {Icon && (
                                <Icon
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                />
                            )}

                            <Input
                                {...field}
                                type={type}
                                placeholder={placeholder}
                                className={Icon ? "pl-10" : ""}
                            />

                        </div>

                    </FormControl>

                    <FormMessage />

                </FormItem>
            )}
        />
    );
}