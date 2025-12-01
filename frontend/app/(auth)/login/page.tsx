// "use client";
// import { redirect, useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// // import { createSession } from "@/lib/session";
// // import { findUserByEmail } from "@/lib/dummy-users";
// import { loginAction } from "./actions";
// import { useEffect, useState, useTransition } from "react";
// import { Eye, EyeOff } from "lucide-react"; // pastikan sudah install lucide-react
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { useAppDispatch } from "@/store/hooks";
// import { loginRequest, loginSuccess, loginFailed } from "@/store/authSlice";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const searchParams = useSearchParams();
//   const fromRegister = searchParams.get("fromRegister");
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [register, setRegister] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const dispatch = useAppDispatch();

//   const redirectTo = searchParams.get("redirect") || "/";

//   useEffect(() => {
//     if (fromRegister === "true") {
//       setRegister("Registration successful!");
//     }
//   }, [fromRegister]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     const formData = new FormData(e.currentTarget);

//     // Dispatch loading state
//     dispatch(loginRequest());

//     startTransition(async () => {
//       try {
//         const result = await loginAction(formData);

//         if (result.success && result.token && result.user) {
//           // Simpan ke Redux
//           dispatch(
//             loginSuccess({
//               accessToken: result.token,
//               user: result.user,
//             })
//           );

//           toast.success("Login berhasil!");

//           // Redirect
//           router.push(redirectTo);
//           router.refresh();
//         } else {
//           // Login gagal
//           const errorMessage = result.message || "Login gagal";
//           setError(errorMessage);
//           dispatch(loginFailed(errorMessage));
//           toast.error(errorMessage);
//         }
//       } catch (err) {
//         const errorMessage = "Terjadi kesalahan";
//         setError(errorMessage);
//         dispatch(loginFailed(errorMessage));
//         toast.error(errorMessage);
//       }
//     });
//   };
//   return (
//     <main className="container mx-auto max-w-md px-4 py-10">
//       <div className="rounded-xl border bg-card p-6 shadow-sm">
//         <h1 className="mb-1 text-2xl font-bold">Log in</h1>
//         <p className="mb-6 text-sm text-muted-foreground">
//           Gunakan akun demo:&nbsp;
//           <b>aisha@example.com</b> / <b>password</b>
//         </p>

//         {error && (
//           <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
//             {error}
//           </p>
//         )}
//         {success && (
//           <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
//             {success}
//           </p>
//         )}
//         {register && (
//           <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
//             {register}
//           </p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <LabelInputContainer className="mb-4">
//             <Label htmlFor="username">Username/Email</Label>
//             <Input
//               id="username"
//               name="username"
//               placeholder="Username or Email"
//               type="text"
//             />
//           </LabelInputContainer>
//           <LabelInputContainer className="mb-4">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 placeholder="Password"
//                 type={showPassword ? "text" : "password"}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </LabelInputContainer>
//           <button
//             type="submit"
//             className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
//           >
//             Log In
//           </button>
//         </form>

//         <div className="mt-6 flex items-center justify-between text-sm">
//           <Link
//             href="/reset-password"
//             className="text-primary underline-offset-4 hover:underline"
//           >
//             Forgot password?
//           </Link>
//           <Link
//             href="/register"
//             className="text-primary underline-offset-4 hover:underline"
//           >
//             Create account
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

// const BottomGradient = () => {
//   return (
//     <>
//       <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
//       <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
//     </>
//   );
// };

// const LabelInputContainer = ({
//   children,
//   className,
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <div className={cn("flex w-full flex-col space-y-2", className)}>
//       {children}
//     </div>
//   );
// };

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Eye, EyeOff, Github } from "lucide-react";

import { loginAction } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { loginRequest, loginSuccess, loginFailed } from "@/store/authSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const fromRegister = searchParams.get("fromRegister");
  const redirectTo = searchParams.get("redirect") || "/";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [register, setRegister] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (fromRegister === "true") {
      setRegister("Registration successful!");
    }
  }, [fromRegister]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    dispatch(loginRequest());

    startTransition(async () => {
      try {
        const result = await loginAction(formData);

        if (result.success && result.token && result.user) {
          dispatch(
            loginSuccess({
              accessToken: result.token,
              user: result.user,
            })
          );

          toast.success("Login berhasil!");
          router.push(redirectTo);
          router.refresh();
        } else {
          const errorMessage = result.message || "Login gagal";
          setError(errorMessage);
          dispatch(loginFailed(errorMessage));
          toast.error(errorMessage);
        }
      } catch (err) {
        const errorMessage = "Terjadi kesalahan";
        setError(errorMessage);
        dispatch(loginFailed(errorMessage));
        toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-background/80">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card/95 p-6 shadow-lg sm:p-8">
          {/* HEADER */}
          <div className="mb-6 text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to JobPortal
            </h1>
            <p className="text-sm text-muted-foreground">
              Use your account to manage applications and jobs.
            </p>
          </div>

          {/* demo info */}
          <p className="mb-4 rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Demo account:&nbsp;
            <b>aisha@example.com</b> / <b>password</b>
          </p>

          {/* ALERTS */}
          {error && (
            <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {success}
            </p>
          )}
          {register && (
            <p className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
              {register}
            </p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabelInputContainer className="mb-1">
              <Label htmlFor="username">Email or Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="name@example.com"
                type="text"
                autoComplete="username"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </LabelInputContainer>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                {/* kalau nanti mau tambahin remember me, taruh di sini */}
              </div>
              <Link
                href="/reset-password"
                className="text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="group relative inline-flex w-full items-center justify-center gap-1 rounded-md px-4 py-2.5 text-sm font-medium dark:text-white"
            >
              {isPending ? "Signing in..." : "Sign in"}
              <BottomGradient />
            </Button>
          </form>

          {/* OR + SOCIAL */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Separator className="flex-1" />
              <span>Or continue with</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center justify-center gap-2 text-sm"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* FOOTER LINKS */}
          <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ===== Helper components (masih sama konsepnya dengan sebelumnya) ===== */

const BottomGradient = () => {
  return (
    <>
      <span className="pointer-events-none absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1.5", className)}>
    {children}
  </div>
);
