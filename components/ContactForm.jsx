"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

/* =========================
   Validation Schema
========================= */

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),

  email: z
    .string()
    .email("Please enter a valid email address."),

  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters.")
    .max(100, "Subject must be at most 100 characters."),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(500, "Message must be at most 500 characters."),
});

/* =========================
   Contact Form
========================= */

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactSchema),

    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data) {
    console.log("Contact form:", data);

    toast.success("Message sent successfully!", {
      description:
        "Thank you for contacting us. We will get back to you soon.",
    });

    form.reset();
  }

  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 py-20">

        <Card className="shadow-sm">

          {/* =========================
              Card Header
          ========================= */}

          <CardHeader>
            <CardTitle className="text-2xl">
              Send Us a Message
            </CardTitle>

            <CardDescription>
              Fill out the form and we&apos;ll get back to you.
            </CardDescription>
          </CardHeader>

          {/* =========================
              Card Content
          ========================= */}

          <CardContent>
            <form
              id="contact-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>

                {/* =========================
                    Name + Email
                ========================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                  {/* Name */}
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="contact-name">
                          Name
                        </FieldLabel>

                        <Input
                          {...field}
                          id="contact-name"
                          placeholder="Your name"
                          autoComplete="name"
                          aria-invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                  {/* Email */}
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="contact-email">
                          Email
                        </FieldLabel>

                        <Input
                          {...field}
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                        />

                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                          />
                        )}
                      </Field>
                    )}
                  />

                </div>

                {/* =========================
                    Subject
                ========================= */}

                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="contact-subject">
                        Subject
                      </FieldLabel>

                      <Input
                        {...field}
                        id="contact-subject"
                        placeholder="How can we help?"
                        autoComplete="off"
                        aria-invalid={fieldState.invalid}
                      />

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                {/* =========================
                    Message
                ========================= */}

                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="contact-message">
                        Message
                      </FieldLabel>

                      <InputGroup>

                        <InputGroupTextarea
                          {...field}
                          id="contact-message"
                          placeholder="Write your message..."
                          rows={6}
                          className="min-h-32 resize-none"
                          aria-invalid={fieldState.invalid}
                        />

                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/500 characters
                          </InputGroupText>
                        </InputGroupAddon>

                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

              </FieldGroup>
            </form>
          </CardContent>

          {/* =========================
              Card Footer
          ========================= */}

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              form="contact-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Sending..."
                : "Send Message"}

              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>

        </Card>

      </div>
    </section>
  );
}

