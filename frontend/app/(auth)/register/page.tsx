// "use client";

// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { createUser, emailExists } from "@/lib/dummy-users";
// import { createSession } from "@/lib/session";
// import { BodyRegister } from "@/lib/services/auth/types";
// import { AuthState } from "../../../lib/services/auth/state";

// export default function RegisterPage({
//   searchParams,
// }: {
//   searchParams?: { error?: string };
// }) {
//   const { registerUser } = AuthState();
//   // const error = searchParams?.error;

//   async function registerAction(formData: FormData) {
//     const name = String(formData.get("name") || "").trim();
//     const username = String(formData.get("username") || "");
//     const email = String(formData.get("email") || "")
//       .trim()
//       .toLowerCase();
//     const password = String(formData.get("password") || "");

//     if (!name || !email || !password || !username)
//       redirect("/register?error=Please fill all fields");
//     if (emailExists(email))
//       redirect("/register?error=Email already registered");

//     try {
//       await registerHandler(name, email, password, username);
//     } catch (error) {
//       console.log(error);
//     }

//     // const user = createUser({ name, email, password, username });
//     // await createSession({
//     //   id: user.id,
//     //   name: user.name,
//     //   email: user.email,
//     //   role: user.role,
//     // });
//   }

//   const registerHandler = (
//     name: string,
//     email: string,
//     password: string,
//     username: string
//   ) => {
//     const payload: BodyRegister = {
//       name: name,
//       username: username,
//       password: password,
//       email: email,
//     };

//     registerUser(payload);
//   };

//   return (
//     <main className="container mx-auto max-w-md px-4 py-10">
//       <div className="rounded-xl border bg-card p-6 shadow-sm">
//         <h1 className="mb-1 text-2xl font-bold">Create account</h1>
//         <p className="mb-6 text-sm text-muted-foreground">
//           Registrasi dummy (non-persisten).
//         </p>

//         {/* {error && (
//           <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
//             {error}
//           </p>
//         )} */}

//         <form action={registerAction} className="space-y-4">
//           <div>
//             <label className="mb-1 block text-sm">Full name</label>
//             <input
//               name="name"
//               required
//               className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm">Username</label>
//             <input
//               name="username"
//               required
//               className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm">Email</label>
//             <input
//               name="email"
//               type="email"
//               required
//               className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm">Password</label>
//             <input
//               name="password"
//               type="password"
//               required
//               className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
//             />
//           </div>
//           <button
//             type="submit"
//             className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
//           >
//             Create account
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="text-primary underline-offset-4 hover:underline"
//           >
//             Log in
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

export default function SignupFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      {/* <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to JobPortal
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Please register your account here
      </p> */}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGithubFilled className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandGoogleFilled className="h-4 w-4 text-red-500  dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            type="submit"
          >
            <IconBrandOnlyfans className="h-4 w-4 text-blue-500 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
