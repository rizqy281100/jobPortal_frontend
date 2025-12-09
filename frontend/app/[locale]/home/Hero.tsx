// "use client";

// import * as React from "react";

// import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
// import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

// export default function Hero() {
//   const placeholders = [
//     "Find the best jobs in Uzbekistan",
//     "Software Engineer",
//     "UI/UX Designer",
//     "Copywriter",
//     "Data Analyst",
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     console.log(e.target.value);
//   };
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("submitted");
//   };

//   return (
//     <section className="relative flex min-h-150 w-full flex-col items-start justify-start overflow-hidden">
//       <BackgroundRippleEffect />
//       <div className="mt-50 w-full">
//         <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
//           Find jobs in Uzbekistan
//         </h2>
//         <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
//           Search thousands of vacancies from verified companies. Simple, fast,
//           and free.
//         </p>
//       </div>

//       <div className="flex w-full justify-center mt-12 px-4">
//         <div className="relative w-full max-w-xl">
//           <PlaceholdersAndVanishInput
//             placeholders={placeholders}
//             onChange={handleChange}
//             onSubmit={onSubmit}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import * as React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  // placeholders diambil dari messages (array per bahasa)
  const placeholders = t.raw("placeholders") as string[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <section className="relative flex min-h-150 w-full flex-col items-start justify-start overflow-hidden">
      <BackgroundRippleEffect />
      <div className="mt-50 w-full">
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          {t("title")}
        </h2>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-12 flex w-full justify-center px-4">
        <div className="relative w-full max-w-xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
}
