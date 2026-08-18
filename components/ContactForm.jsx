"use client";

import * as React from "react";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
  FileText,
} from "lucide-react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import { db } from "@/lib/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* =========================================================
   VALIDATION
========================================================= */

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(100, "Email is too long."),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(100, "Subject must be at most 100 characters."),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(500, "Message must be at most 500 characters."),
});

/* =========================================================
   CONTACT FORM
========================================================= */

export default function ContactForm() {
  const [success, setSuccess] = React.useState(false);
  const successTimeoutRef = React.useRef(null);

  const form = useForm({
    resolver: zodResolver(contactSchema),

    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },

    mode: "onTouched",
  });

  // clear any pending "success" reset timer on unmount so we never call
  // setState on an unmounted component
  React.useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function onSubmit(data) {
    try {
      setSuccess(false);

      await addDoc(collection(db, "contactMessages"), {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        message: data.message.trim(),

        status: "new",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);

      toast.success("Message sent successfully!", {
        description: "Thanks for reaching out. We'll get back to you soon.",
      });

      form.reset();

      // clear any previous pending timer before scheduling a new one, so
      // rapid consecutive submissions don't race each other
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);

      toast.error("Something went wrong.", {
        description: "Your message could not be sent. Please try again.",
      });
    }
  }

  const messageValue = form.watch("message") || "";

  return (
    <section className="relative overflow-hidden border-y bg-muted/30 py-16 sm:py-20">
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute bottom-20 left-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="mb-10 text-center">
          <Badge variant="secondary" className=" shadow-sm">
            <MessageSquare className="mr-2 h-3.5 w-3.5" />
            Contact Skills Hub
          </Badge>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Let&apos;s Start a Conversation
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-md leading-6 text-muted-foreground sm:text-base">
            Have a question about our courses, learning paths, certificates, or
            anything else? Send us a message and our team will get back to you.
          </p>
        </div>

        {/* ===================================================
            CARD
        =================================================== */}

        <Card className="overflow-hidden rounded-2xl border bg-background/95 shadow-xl backdrop-blur transition-all duration-300 hover:shadow-2xl">
          {/* =================================================
              HEADER
          ================================================= */}

          <CardHeader className="border-b bg-muted/20 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>

                <CardDescription className="mt-2">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </CardDescription>
              </div>

              <Badge variant="outline" className="w-fit ">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Usually replies within 24h
              </Badge>
            </div>
          </CardHeader>

          {/* =================================================
              FORM CONTENT
          ================================================= */}

          <CardContent className="p-6 sm:p-8">
            <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* =================================================
                    NAME + EMAIL
                ================================================= */}

                <div className="grid gap-6 md:grid-cols-2">
                  {/* NAME */}

                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-2"
                      >
                        <FieldLabel
                          htmlFor="contact-name"
                          className="text-base font-semibold"
                        >
                          Full Name
                        </FieldLabel>

                        <InputGroup
                          className={`
                            h-12 overflow-hidden rounded-xl
                            border bg-muted/20
                            shadow-sm
                            transition-all duration-300
                            hover:border-primary/40
                            focus-within:border-primary
                            focus-within:ring-4
                            focus-within:ring-primary/10
                            ${
                              fieldState.invalid
                                ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/10"
                                : ""
                            }
                          `}
                        >
                          <InputGroupAddon className="border-r bg-muted/30 px-3">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </InputGroupAddon>

                          <Input
                            {...field}
                            id="contact-name"
                            placeholder="John Doe"
                            autoComplete="name"
                            aria-invalid={fieldState.invalid}
                            className="h-full border-0 bg-transparent px-4 text-base shadow-none outline-none focus-visible:ring-0"
                          />
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* EMAIL */}

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-2"
                      >
                        <FieldLabel
                          htmlFor="contact-email"
                          className="text-base font-semibold"
                        >
                          Email Address
                        </FieldLabel>

                        <InputGroup
                          className={`
                            h-12 overflow-hidden rounded-xl
                            border bg-muted/20
                            shadow-sm
                            transition-all duration-300
                            hover:border-primary/40
                            focus-within:border-primary
                            focus-within:ring-4
                            focus-within:ring-primary/10
                            ${
                              fieldState.invalid
                                ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/10"
                                : ""
                            }
                          `}
                        >
                          <InputGroupAddon className="border-r bg-muted/30 px-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </InputGroupAddon>

                          <Input
                            {...field}
                            id="contact-email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            aria-invalid={fieldState.invalid}
                            className="h-full border-0 bg-transparent px-4 text-base shadow-none outline-none focus-visible:ring-0"
                          />
                        </InputGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* =================================================
                    SUBJECT
                ================================================= */}

                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor="contact-subject"
                        className="text-base font-semibold"
                      >
                        Subject
                      </FieldLabel>

                      <InputGroup
                        className={`
                          h-12 overflow-hidden rounded-xl
                          border bg-muted/20
                          shadow-sm
                          transition-all duration-300
                          hover:border-primary/40
                          focus-within:border-primary
                          focus-within:ring-4
                          focus-within:ring-primary/10
                          ${
                            fieldState.invalid
                              ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/10"
                              : ""
                          }
                        `}
                      >
                        <InputGroupAddon className="border-r bg-muted/30 px-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>

                        <Input
                          {...field}
                          id="contact-subject"
                          placeholder="How can we help you?"
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          className="h-full border-0 bg-transparent px-4 text-base shadow-none outline-none focus-visible:ring-0"
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <Controller
                  name="message"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor="contact-message"
                        className="text-base font-semibold"
                      >
                        Message
                      </FieldLabel>

                      <InputGroup
                        className={`
                          overflow-hidden rounded-xl
                          border bg-muted/20
                          shadow-sm
                          transition-all duration-300
                          hover:border-primary/40
                          focus-within:border-primary
                          focus-within:ring-4
                          focus-within:ring-primary/10
                          ${
                            fieldState.invalid
                              ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/10"
                              : ""
                          }
                        `}
                      >
                        <InputGroupTextarea
                          {...field}
                          id="contact-message"
                          placeholder="Tell us about your question, project, or how we can help..."
                          rows={7}
                          maxLength={500}
                          aria-invalid={fieldState.invalid}
                          className="min-h-40 resize-none border-0 bg-transparent px-4 py-4 text-base shadow-none focus-visible:ring-0"
                        />

                        <InputGroupAddon
                          align="block-end"
                          className="border-t bg-muted/30 px-4 py-2"
                        >
                          <InputGroupText className="ml-auto text-sm tabular-nums text-muted-foreground">
                            {messageValue.length}/500
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <Separator />

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <CardFooter className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <CheckCircle2 className="h-4 w-4 text-primary" />

                <p className="text-base font-medium">
                  Your information is safe with us.
                </p>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                We never share your contact information.
              </p>
            </div>

            <Button
              type="submit"
              form="contact-form"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer rounded-xl px-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Sent Successfully
                </>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
