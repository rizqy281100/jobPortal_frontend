"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const t = useTranslations("Contact");

  const phones = [
    {
      city: "Tashkent",
      label: t("phone.items.tashkent.label"),
      number: t("phone.items.tashkent.number"),
    },
    {
      city: "Samarkand",
      label: t("phone.items.samarkand.label"),
      number: t("phone.items.samarkand.number"),
    },
    {
      city: "Bukhara",
      label: t("phone.items.bukhara.label"),
      number: t("phone.items.bukhara.number"),
    },
    {
      city: "Namangan",
      label: t("phone.items.namangan.label"),
      number: t("phone.items.namangan.number"),
    },
    {
      city: "Andijan",
      label: t("phone.items.andijan.label"),
      number: t("phone.items.andijan.number"),
    },
    {
      city: "Fergana",
      label: t("phone.items.fergana.label"),
      number: t("phone.items.fergana.number"),
    },
  ];

  const emails = [
    {
      label: t("email.support"),
      address: t("email.supportAddress"),
    },
    {
      label: t("email.employers"),
      address: t("email.employersAddress"),
    },
    {
      label: t("email.partners"),
      address: t("email.partnersAddress"),
    },
    {
      label: t("email.press"),
      address: t("email.pressAddress"),
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // di sini nanti bisa kamu sambungkan ke API / form provider
    console.log("Contact form submitted");
  };

  return (
    <section className="container mx-auto max-w-5xl px-4 py-10 md:py-12 lg:py-16">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {t("title")}
      </h1>

      <div className="mt-6 space-y-6 md:space-y-8">
        {/* ===== Phone numbers ===== */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl">
              {t("phone.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-x-10 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {phones.map((item) => (
                <div key={item.city} className="space-y-0.5 text-sm">
                  <p className="text-muted-foreground">{item.label}</p>
                  <Link
                    href={`tel:${item.number.replace(/[^+\d]/g, "")}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {item.number}
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== Emails ===== */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl md:text-2xl">
              {t("email.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {emails.map((item) => (
                <div key={item.label} className="space-y-0.5 text-sm">
                  <p className="text-muted-foreground">{item.label}</p>
                  <Link
                    href={`mailto:${item.address}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {item.address}
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== Form ===== */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 space-y-1.5">
            <CardTitle className="text-xl md:text-2xl">
              {t("form.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("form.description.start")}{" "}
              <Link
                href="./help"
                className="underline underline-offset-2 hover:text-primary"
              >
                {t("form.description.helpLink")}
              </Link>{" "}
              {t("form.description.end")}
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-5 max-w-xl"
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  {t("form.fields.name.label")}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder={t("form.fields.name.placeholder")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact">
                  {t("form.fields.contact.label")}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  required
                  placeholder={t("form.fields.contact.placeholder")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">
                  {t("form.fields.message.label")}
                  <span className="ml-0.5 text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t("form.fields.message.placeholder")}
                  className="resize-y"
                />
              </div>

              <Button type="submit" className="mt-2 w-full sm:w-auto">
                {t("form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
