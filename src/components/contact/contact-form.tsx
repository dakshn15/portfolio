"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { emailjs, site } from "@/content/site";
import { ArrowRightIcon, CheckIcon, Spinner } from "../icons";

const topics = [
  { value: "Hiring for a role", label: "A role" },
  { value: "A freelance project", label: "A project" },
  { value: "Something else", label: "Something else" },
];

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = { state: "idle" | "sending" } | { state: "sent"; email: string } | { state: "error"; busy?: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (!values.name) errors.name = "Enter your name.";
  if (!values.email) errors.email = "Enter your email so I can reply.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter an email address like name@company.com.";
  if (values.message.length < 10) errors.message = "Add a few more details: at least 10 characters.";
  return errors;
}

const inputClass = "field";

/**
 * Everything the EmailJS templates can use (see docs/email-templates).
 * name, email, subject and message are the original four; the rest add detail.
 */
function emailParams(values: Record<Field, string>, topic: string) {
  const sentAt = new Intl.DateTimeFormat("en-IN", {
    timeZone: site.timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
  return {
    ...values,
    subject: topic,
    topic,
    first_name: values.name.split(/\s+/)[0],
    sent_at: `${sentAt} ${site.timeZoneLabel}`,
    page_url: `${window.location.origin}${window.location.pathname}`,
    site_url: window.location.origin,
    reply_link: `mailto:${values.email}?subject=${encodeURIComponent(`Re: ${topic}`)}`,
  };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "sending") return;

    const data = new FormData(event.currentTarget);
    // Bots fill every field, people never see this one.
    if (String(data.get("company") ?? "")) return;

    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = (Object.keys(nextErrors) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus({ state: "sending" });
    // Give up after 15 seconds rather than leaving the button spinning.
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailjs.serviceId,
          template_id: emailjs.templateId,
          user_id: emailjs.publicKey,
          template_params: emailParams(values, String(data.get("topic") ?? topics[0].value)),
        }),
      });
      if (!response.ok) {
        // EmailJS explains what went wrong in plain text, e.g. an expired Gmail connection.
        const reason = await response.text().catch(() => "");
        console.error(`Contact form: EmailJS answered ${response.status}. ${reason}`);
        setStatus({ state: "error", busy: response.status === 426 || response.status === 429 });
        return;
      }
      formRef.current?.reset();
      setStatus({ state: "sent", email: values.email });
    } catch (error) {
      console.error("Contact form: the request to EmailJS failed.", error);
      setStatus({ state: "error" });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function submitOnModEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  function clearError(field: Field) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  if (status.state === "sent") {
    return (
      <div className="rounded-lg border border-line bg-raised p-6 sm:p-8" role="status">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
          <CheckIcon />
        </span>
        <h3 className="type-title mt-5 text-xl">Message sent</h3>
        <p className="mt-2 text-ink-2">
          Thanks for getting in touch. I’ll reply to <span className="text-ink">{status.email}</span>.
        </p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setStatus({ state: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:gap-5" aria-describedby="form-status">
      <fieldset>
        <legend className="text-sm font-medium text-ink">What’s it about?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-3">
          {topics.map((topic, index) => (
            <label
              key={topic.value}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-line-strong bg-raised px-3.5 text-sm sm:min-h-10 sm:px-4 text-ink-2 transition-[background-color,border-color,color] duration-150 select-none hover:border-ink-3 hover:text-ink has-checked:border-primary has-checked:bg-primary has-checked:text-primary-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
            >
              <input type="radio" name="topic" value={topic.value} defaultChecked={index === 0} className="sr-only" />
              {topic.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label htmlFor="contact-name" className="text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name…"
            className={inputClass}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={() => clearError("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" className="text-sm text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="name@company.com…"
            className={inputClass}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={() => clearError("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" className="text-sm text-danger">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        <label htmlFor="contact-message" className="text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell me about the role or the project…"
          className={`${inputClass} min-h-32 max-sm:h-28 max-sm:min-h-28`}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
          onKeyDown={submitOnModEnter}
          onChange={() => clearError("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-sm text-danger">
            {errors.message}
          </p>
        ) : (
          <p id="contact-message-hint" className="text-xs text-ink-3 [@media(hover:none)]:hidden">
            Press Ctrl+Enter or ⌘+Enter to send.
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary shrink-0 sm:self-start" aria-disabled={sending}>
          {sending ? <Spinner className="size-4" /> : null}
          Send message
          {sending ? null : <ArrowRightIcon className="btn-arrow size-4" />}
        </button>
        <p id="form-status" aria-live="polite" className="text-sm text-ink-2">
          {status.state === "error" ? (
            <span className="text-danger">
              {status.busy ? "The form has reached its sending limit for now. Please email me at" : "Your message didn’t send. Try again, or email me at"}{" "}
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </span>
          ) : sending ? (
            "Sending…"
          ) : null}
        </p>
      </div>
    </form>
  );
}
