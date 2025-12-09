// "use client";

// import { cn } from "@/lib/utils";
// import {
//   IconUsers,
//   IconAdjustmentsBolt,
//   IconHeadset,
//   IconRocket,
// } from "@tabler/icons-react";

// export function FeaturesSection() {
//   const features = [
//     {
//       title: "Built for Job Seekers and Employers",
//       description:
//         "Designed to connect talent and opportunity seamlessly. Whether you’re hiring or job hunting — we’ve got you covered",
//       icon: <IconUsers className="h-6 w-6 text-blue-600" strokeWidth={1.6} />,
//       color: "#2563EB", // blue-600
//     },
//     {
//       title: "Fast & Effortless Search",
//       description:
//         "Powerful filters and smart recommendations make discovery instant.",
//       icon: (
//         <IconAdjustmentsBolt
//           className="h-6 w-6 text-emerald-600"
//           strokeWidth={1.6}
//         />
//       ),
//       color: "#059669", // emerald-600
//     },
//     {
//       title: "24/7 Customer Support",
//       description:
//         "Real humans, real help — anytime you need it. We’re always here to assist, guide, and support your journey.",
//       icon: (
//         <IconHeadset className="h-6 w-6 text-purple-600" strokeWidth={1.6} />
//       ),
//       color: "#9333EA", // purple-600
//     },
//     {
//       title: "Career Growth Made Simple",
//       description:
//         "Track applications, build your resume, and level up your career. Everything you need to grow — in one place.",
//       icon: <IconRocket className="h-6 w-6 text-amber-600" strokeWidth={1.6} />,
//       color: "#D97706", // amber-600
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
//       {features.map((feature, index) => (
//         <Feature key={feature.title} {...feature} index={index} />
//       ))}
//     </div>
//   );
// }

// const Feature = ({
//   title,
//   description,
//   icon,
//   index,
//   color,
// }: {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   index: number;
//   color: string;
// }) => {
//   return (
//     <div
//       className={cn(
//         "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
//         (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800"
//       )}
//     >
//       {/* hover gradient mengikuti warna icon */}
//       <div
//         className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full pointer-events-none"
//         style={{
//           background: `linear-gradient(to top, ${color}15, transparent 80%)`, // 15 = 0.08 opacity hex
//         }}
//       />

//       {/* icon */}
//       <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
//         {icon}
//       </div>

//       {/* garis vertikal kiri ikut warna icon */}
//       <div className="text-lg font-bold mb-2 relative z-10 px-10">
//         <div
//           className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full transition-all duration-300 origin-center"
//           style={{
//             backgroundColor: color,
//           }}
//         />
//         <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
//           {title}
//         </span>
//       </div>

//       <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
//         {description}
//       </p>
//     </div>
//   );
// };

"use client";

import { cn } from "@/lib/utils";
import {
  IconUsers,
  IconAdjustmentsBolt,
  IconHeadset,
  IconRocket,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("Features");

  // Definisi icon + warna tetap di code
  const featureDefs = [
    {
      id: "built",
      icon: <IconUsers className="h-6 w-6 text-blue-600" strokeWidth={1.6} />,
      color: "#2563EB",
    },
    {
      id: "search",
      icon: (
        <IconAdjustmentsBolt
          className="h-6 w-6 text-emerald-600"
          strokeWidth={1.6}
        />
      ),
      color: "#059669",
    },
    {
      id: "support",
      icon: (
        <IconHeadset className="h-6 w-6 text-purple-600" strokeWidth={1.6} />
      ),
      color: "#9333EA",
    },
    {
      id: "growth",
      icon: <IconRocket className="h-6 w-6 text-amber-600" strokeWidth={1.6} />,
      color: "#D97706",
    },
  ];

  const features = featureDefs.map((f) => ({
    ...f,
    title: t(`${f.id}.title`),
    description: t(`${f.id}.description`),
  }));

  return (
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Feature key={feature.id} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  color: string;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 lg:border-r dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800"
      )}
    >
      {/* hover gradient mengikuti warna icon */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition duration-300 group-hover/feature:opacity-100"
        style={{
          background: `linear-gradient(to top, ${color}15, transparent 80%)`,
        }}
      />

      {/* icon */}
      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>

      {/* garis vertikal kiri ikut warna icon */}
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div
          className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full transition-all duration-300 group-hover/feature:h-8"
          style={{
            backgroundColor: color,
          }}
        />
        <span className="inline-block translate-x-0 text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>

      <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
};
