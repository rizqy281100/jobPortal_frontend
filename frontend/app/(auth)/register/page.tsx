"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";

import { registerAction } from "./actions";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.success) {
      setSuccess("Registration successful! Redirecting...");
      router.push("/login?fromRegister=true");
    } else {
      setError(result?.error || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        {/* HEADER */}
        <div className="space-y-1 text-center mb-6">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Register to start finding your next job opportunity.
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <p className="mb-4 rounded-md border border-red-300 bg-red-100 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-md border border-emerald-300 bg-emerald-100 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300">
            {success}
          </p>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" name="firstname" placeholder="Tyler" />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" name="lastname" placeholder="Durden" />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" placeholder="TylerDurden" />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" placeholder="projectmayhem@fc.com" />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </LabelInputContainer>

          {/* PRIMARY BUTTON */}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground dark:text-white hover:opacity-90 transition"
          >
            Sign up
          </button>

          {/* DIVIDER */}
          <div className="my-6 h-[1px] w-full bg-muted" />

          {/* SOCIAL BUTTONS */}
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              className="flex h-10 w-full items-center space-x-2 rounded-md border bg-muted px-4 text-sm hover:bg-muted/80 transition"
            >
              <IconBrandGithubFilled className="h-4 w-4" />
              <span>Sign up with GitHub</span>
            </button>

            <button
              type="button"
              className="flex h-10 w-full items-center space-x-2 rounded-md border bg-muted px-4 text-sm hover:bg-muted/80 transition"
            >
              <IconBrandGoogleFilled className="h-4 w-4 text-red-500" />
              <span>Sign up with Google</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
