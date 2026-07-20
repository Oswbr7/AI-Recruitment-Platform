import { useState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

type PasswordFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
};

export function PasswordField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
}: PasswordFieldProps<T>) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (

                <FormItem>

                    <FormLabel>{label}</FormLabel>

                    <FormControl>

                        <div className="relative">

                            <Lock
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            />

                            <Input
                                {...field}
                                placeholder={placeholder}
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>

                        </div>

                    </FormControl>

                    <FormMessage />

                </FormItem>

            )}
        />
    );
}