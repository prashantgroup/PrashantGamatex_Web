"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLabelProps } from "@/lib/form-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/useAuth";
import { LoginData } from "@/types/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      company: "PrashantGamatex",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const loginData: LoginData = {
        ...data,
        DeviceName: navigator.userAgent || "Web Browser",
      };
      
      await loginMutation.mutateAsync(loginData);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'errorMessage' in error
        ? (error as { errorMessage: string }).errorMessage
        : "Login failed. Please try again.";
      
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials below to login to your account
        </p>
      </div>
      
      {(errors.root || loginMutation.error) && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {errors.root?.message || loginMutation.error?.errorMessage}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username" {...getLabelProps(loginSchema, "username")}>Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register("username")}
            disabled={loginMutation.isPending}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password" {...getLabelProps(loginSchema, "password")}>Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              disabled={loginMutation.isPending}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="company" {...getLabelProps(loginSchema, "company")}>Company</Label>
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={loginMutation.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PrashantGamatex">Prashant Gamatex</SelectItem>
                  <SelectItem value="WestPoint">West Point</SelectItem>
                  <SelectItem value="Ferber">Ferber</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
