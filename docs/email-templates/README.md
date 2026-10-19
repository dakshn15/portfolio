# Contact form emails

The contact form sends through EmailJS. These two files are the email
templates; they live in the EmailJS dashboard, so changes here have to be
pasted there.

| File | Who gets it |
| --- | --- |
| `contact-notification.html` | You, every time someone sends the form |
| `auto-reply.html` | The sender, as a "thanks, I got it" copy (optional) |

## Values the form sends

`name`, `email`, `message`, `subject` (the topic they picked), plus:

| Value | Example |
| --- | --- |
| `topic` | Hiring for a role |
| `first_name` | Priya |
| `sent_at` | 19 Oct 2026, 9:42 pm IST |
| `page_url` | the page the form was sent from |
| `site_url` | the site's address, for links |
| `reply_link` | a ready-made `mailto:` with "Re: topic" as the subject |

## 1. Update the notification email

In [dashboard.emailjs.com](https://dashboard.emailjs.com), open **Email Templates**
and edit the existing template (`template_718vlpi`), so its ID stays the same.

| Field | Value |
| --- | --- |
| Subject | `New message from {{name}} ({{topic}})` |
| To Email | `dakshnimavat15@gmail.com` |
| From Name | `Portfolio contact form` |
| Reply To | `{{email}}` |

Then **Edit Content**, switch to the **Code** editor, delete what's there, and
paste all of `contact-notification.html`. Save.

With Reply To set to `{{email}}`, pressing Reply in Gmail answers the sender
directly.

## 2. Add the auto-reply (optional)

Create a **new** template, named something like "Portfolio auto-reply":

| Field | Value |
| --- | --- |
| Subject | `Thanks for getting in touch, {{first_name}}` |
| To Email | `{{email}}` |
| From Name | `Daksh Nimavat` |
| Reply To | `dakshnimavat15@gmail.com` |

Paste `auto-reply.html` into its Code editor and save. Then go back to the
notification template, open its **Auto-Reply** tab, pick "Portfolio auto-reply",
and save.

Each auto-reply counts as one more email towards the EmailJS monthly limit.

The auto-reply doesn't repeat the sender's message on purpose. It goes to
whatever address is typed into the form, so if it included the message,
anyone could type someone else's address and use your Gmail to send them
their own text.

## No images

Both templates are plain HTML with no images: the "DN" badge, the dark header
and the colour bar are all table cells and colours. Nothing can show as a
broken image, and nothing waits for "display images" to be clicked.

The soft light in the header and the button shading are gradients. Mail apps
that don't support gradients show solid colours instead.

Archivo and Fragment Mono load in Apple Mail and on iOS. Gmail and Outlook
don't allow web fonts, so they use the system's own sans and mono fonts. The
layout is the same either way.

## Previewing

Open either file in a browser to see the layout. The `{{...}}` placeholders
show as text until EmailJS fills them in.
