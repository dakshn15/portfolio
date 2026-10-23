import type { StaticImageData } from "next/image";
import type { LayerId } from "./layers";

import waypointCover from "@/assets/projects/waypoint/cover.webp";
import waypointTripBuilder from "@/assets/projects/waypoint/trip-builder.webp";
import waypointOperations from "@/assets/projects/waypoint/operations.webp";
import waypointMobile from "@/assets/projects/waypoint/mobile.webp";
import waypointPackage from "@/assets/projects/waypoint/package.webp";
import petcareCover from "@/assets/projects/petcare/cover.webp";
import petcareAdoption from "@/assets/projects/petcare/adoption.webp";
import petcareServices from "@/assets/projects/petcare/services.webp";
import petcareMobile from "@/assets/projects/petcare/mobile.webp";
import rezumelyCover from "@/assets/projects/rezumely/cover.webp";
import rezumelyEditor from "@/assets/projects/rezumely/editor.webp";
import rezumelyAiTools from "@/assets/projects/rezumely/ai-tools.webp";
import techzonixCover from "@/assets/projects/techzonix/cover.webp";
import techzonixCatalog from "@/assets/projects/techzonix/catalog.webp";
import techzonixProduct from "@/assets/projects/techzonix/product.webp";

export type ProjectImage = {
  src: StaticImageData;
  alt: string;
};

export type CodeExcerpt = {
  file: string;
  language: "ts" | "js";
  code: string;
};

/** A kind of user and what the product lets them do. */
export type UserRole = {
  name: string;
  summary: string;
  can: string[];
};

/** One area of the product and everything it does there. */
export type FeatureGroup = {
  title: string;
  summary?: string;
  items: string[];
  image?: ProjectImage;
};

export type CaseStudy = {
  /** URL segment: /work/<slug> */
  slug: string;
  name: string;
  /** What it is, in one line. Used as the case study headline. */
  tagline: string;
  /** One or two sentences for cards and the page description. */
  summary: string;
  type: string;
  year: string;
  role: string;
  /** Layers of the product built. Drives the layer strip and the architecture diagram. */
  layers: LayerId[];
  cover: ProjectImage;
  /** Facts counted from the codebase, not marketing numbers. */
  scope: { value: string; label: string }[];
  /** The problem and what was built, in plain words. */
  overview: string[];
  /** Who uses the product and what each of them can do. */
  users: UserRole[];
  /** Everything the product does, grouped by area. */
  featureGroups: FeatureGroup[];
  /** The flows that matter most, followed step by step through the layers. */
  walkthroughs: Walkthrough[];
  /** How it is put together. */
  approach: string[];
  /** What lives at each layer, for the architecture diagram. */
  architecture: Partial<Record<LayerId, string[]>>;
  stack: { group: string; items: string[] }[];
  /** Tables, collections, or stores, grouped. */
  dataModel: { group: string; items: string[] }[];
  decisions: { title: string; body: string; excerpt?: CodeExcerpt }[];
  /** Honest limits and what would come next. */
  nextSteps: string[];
  repo?: string;
  /** Period the product was built, from its git history. */
  timeline: string;
};

export type WalkthroughStep = {
  layer: LayerId;
  title: string;
  detail: string;
  /** The call or route at this step, shown in code type. */
  code?: string;
};

export type Walkthrough = {
  title: string;
  summary: string;
  image?: ProjectImage;
  steps: WalkthroughStep[];
};

/**
 * Case studies in display order. Every fact here was checked against the
 * project's source code. To add one: render visuals into src/assets/projects/<slug>,
 * import them above, and add an entry.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "waypoint",
    name: "WayPoint",
    tagline: "A multi-tenant travel platform with an AI trip planner.",
    summary:
      "Travelers book packages from verified agencies or let Gemini plan a trip for them. Each agency runs its packages, staff, bookings and payouts from its own console.",
    type: "Multi-tenant SaaS platform",
    year: "2026",
    role: "Solo full-stack developer",
    layers: ["interface", "api", "auth", "data", "ai"],
    cover: {
      src: waypointCover,
      alt: "WayPoint’s agency dashboard with revenue totals and the monthly revenue chart, beside the Kashmir Valley & Gulmarg package page on a phone.",
    },
    scope: [
      { value: "4", label: "user roles, each with its own dashboard" },
      { value: "25", label: "Prisma data models" },
      { value: "18", label: "dashboard screens" },
      { value: "13", label: "server action modules" },
    ],
    overview: [
      "Small travel agencies usually manage packages, staff, vendors and payments in separate tools, and travelers have no easy way to compare one agency with another.",
      "WayPoint is my attempt at putting both sides in one product. Travelers browse packages from verified agencies, or describe a trip and let Gemini plan it day by day. Every agency gets its own console to run the business, and a platform admin looks after agencies, commission and payouts.",
    ],
    users: [
      {
        name: "Traveler",
        summary: "Plans, books and pays for trips.",
        can: [
          "Search packages and filter by difficulty, length and price",
          "Save favourites and review packages they’ve tried",
          "Book a departure for a group, with details for every traveler",
          "Pay through Razorpay and cancel while the booking still allows it",
          "Plan a custom trip in the AI Trip Studio, then save or book it",
          "Keep passport, nationality and an emergency contact on file",
        ],
      },
      {
        name: "Agency owner",
        summary: "Runs a travel business on the platform.",
        can: [
          "Build packages with day-by-day itineraries, stays and transport",
          "Move packages between draft, published and archived",
          "Confirm bookings and see every traveler who has booked",
          "Add staff as managers, agents or support, and switch them off",
          "Keep a list of hotels, transport, guides and other vendors",
          "Request payouts to a bank account or UPI ID",
        ],
      },
      {
        name: "Staff member",
        summary: "Works inside one agency.",
        can: [
          "Handle the agency’s bookings",
          "Work through the tasks assigned to them",
          "See only their own agency’s data",
        ],
      },
      {
        name: "Platform admin",
        summary: "Looks after the whole marketplace.",
        can: [
          "Create users and change their roles",
          "Verify, suspend or remove agencies",
          "Set commission, with a different rate for any agency",
          "Approve payouts and record the bank’s UTR number",
          "See every booking and payment on the platform",
          "Read an audit log of every admin change",
        ],
      },
    ],
    featureGroups: [
      {
        title: "Finding a trip",
        summary: "The public side, before anyone signs in.",
        items: [
          "Package catalog with search by destination or name",
          "Filters for difficulty, trip length and maximum price",
          "Six sort orders, from newest to shortest trip",
          "Package pages with the full itinerary, inclusions, exclusions and reviews",
          "Favourites saved to the traveler’s account",
          "One review per traveler per package, editable later",
        ],
      },
      {
        title: "AI Trip Studio",
        summary: "Describe a trip and get a complete plan back.",
        items: [
          "Six steps: destinations, dates and guests, budget and style, interests, preferences, generate",
          "Travel styles from Budget to Luxury",
          "Every day comes back with activities, a stay, transport and costs",
          "Trips are kept in My Trips and can be booked like a package",
          "Saved trips can be opened again or deleted from My Trips",
          "If Gemini fails or returns bad data, a local planner fills in",
        ],
        image: {
          src: waypointTripBuilder,
          alt: "The AI Trip Studio on a phone and a desktop screen: a six-step progress bar, a trip passport summary, and featured destinations to add.",
        },
      },
      {
        title: "Booking and payments",
        items: [
          "Group bookings with a name and age for each traveler",
          "Seats are counted per departure date, so a full date shows as sold out",
          "Prices are always calculated on the server",
          "Razorpay checkout with UPI, cards, net banking and wallets",
          "Signature checks on every payment response and webhook",
          "Booking statuses can only change in ways the rules allow",
          "A confirmation email once the payment goes through",
        ],
      },
      {
        title: "Agency console",
        summary: "Everything an agency needs to run day to day.",
        items: [
          "Dashboard with revenue and booking charts and the top packages",
          "Package editor for itineraries, pricing, group size, availability and photos",
          "Bookings table with status updates",
          "A list of every traveler who has booked with the agency",
          "Staff accounts with manager, agent and support roles",
          "Vendor directory for hotels, transport, guides, activities and restaurants",
          "Task board with priority, category, due date and reassignment",
          "Earnings view and payout requests",
        ],
        image: {
          src: waypointOperations,
          alt: "The agency bookings table with revenue totals, overlapped by the platform audit log listing admin actions.",
        },
      },
      {
        title: "Running the platform",
        items: [
          "Platform dashboard with bookings, users, agencies and monthly revenue",
          "User directory with search, role changes and admin-created accounts",
          "Unverified or suspended agencies can’t take bookings",
          "A platform commission rate, with overrides per agency",
          "Payout queue: approve, settle with a UTR number, or cancel with a reason",
          "Minimum payout amount and a holding period, both configurable",
          "Audit log with who did what, and the values before and after",
        ],
      },
      {
        title: "Accounts and notifications",
        items: [
          "Sign in with email and password, or with Google",
          "Password reset by email",
          "Four roles, each with its own dashboard and menu",
          "In-app notifications when a booking or an agency’s status changes",
          "Mark one or all notifications as read",
        ],
      },
      {
        title: "On a phone",
        summary: "The traveler side is laid out for small screens, not squeezed onto them.",
        items: [
          "Catalog, trip studio and dashboard designed for phone widths",
          "The dashboard sidebar turns into a slide-out menu",
        ],
        image: {
          src: waypointMobile,
          alt: "Three phone screens: the package catalog, the AI Trip Studio, and the traveler dashboard.",
        },
      },
    ],
    walkthroughs: [
      {
        title: "Generating a trip with AI",
        summary: "From a six-step form to a checked, saved, day-by-day itinerary.",
        steps: [
          {"layer":"interface","title":"The traveler describes the trip","detail":"Six steps in the AI Trip Studio collect destinations, dates and guests, budget and travel style, interests and preferences, then send them in one request.","code":"POST /api/trips/generate"},
          {"layer":"auth","title":"No session, no trip","detail":"The route handler reads the Better Auth session from the request headers and answers 401 before doing any work for a signed-out visitor.","code":"auth.api.getSession({ headers })"},
          {"layer":"api","title":"The request is checked on the server","detail":"Dates have to be valid and in order, a trip can’t be longer than 30 days, and the budget has to be at least ₹500 per traveler per day. Each failure says exactly what to fix.","code":"if (days > 30) return 400"},
          {"layer":"ai","title":"Gemini drafts, the schema decides","detail":"Gemini 2.0 Flash is asked for JSON. The answer is parsed with a Zod schema and must have exactly one entry per day. If it doesn’t, a local generator builds the itinerary instead.","code":"validateGeneratedTrip(json, days)"},
          {"layer":"data","title":"The itinerary is stored","detail":"The plan is saved as a Trip with status GENERATED, owned by the traveler, along with the budget, style and preferences that produced it.","code":"prisma.trip.create({ data })"},
          {"layer":"interface","title":"Ready to edit or book","detail":"The traveler lands on the itinerary, where they can save it, change it, or turn it into a booking."},
        ],
      },
      {
        title: "Booking and paying for a package",
        summary: "Seats, price and payment are all decided on the server, and money moves exactly once.",
        image: {
          src: waypointPackage,
          alt: "A WayPoint package page for Kashmir Valley and Gulmarg showing duration, difficulty, rating, and the price per person.",
        },
        steps: [
          {"layer":"interface","title":"The traveler picks a date","detail":"On the package page they choose a departure date, add a name and age for each traveler, and write any special requests.","code":"createBooking({ packageId, travelDate, travelers })"},
          {"layer":"auth","title":"Only travelers book","detail":"Agency, staff and admin accounts can’t create bookings. The server checks the role before anything else.","code":"session.user.role !== \"TRAVELER\""},
          {"layer":"api","title":"Is the package bookable?","detail":"It has to be published, its agency has to be active and verified, the date can’t be in the past or past the package’s availability, and the group can’t be bigger than the package allows."},
          {"layer":"data","title":"Seats are counted in a transaction","detail":"Inside a serializable transaction the server adds up the travelers already holding that date. A full date comes back as sold out, otherwise the traveler is told how many places are left.","code":"{ isolationLevel: \"Serializable\" }"},
          {"layer":"api","title":"The price comes from the server","detail":"The total is the package’s base price times the number of travelers. Any amount the browser sends is ignored. The booking is saved as PENDING with a WP- booking number.","code":"Number(pkg.basePrice) * travelers.length"},
          {"layer":"auth","title":"Only the owner pays, once","detail":"Opening a payment needs a session, a booking that belongs to the caller and is still PENDING, and no other payment already in progress. Otherwise the answer is 403 or 409.","code":"POST /api/payments"},
          {"layer":"ai","title":"Razorpay takes the payment","detail":"A Razorpay order is created for the amount in paise, and checkout runs in the browser with UPI, cards, net banking or wallets.","code":"createRazorpayOrder({ amount })"},
          {"layer":"api","title":"The signature is verified","detail":"The payment response comes back to the server, where Razorpay’s HMAC signature is checked with a timing-safe comparison before anything is trusted.","code":"POST /api/payments/verify"},
          {"layer":"data","title":"Booking and payment update together","detail":"In one transaction the booking becomes CONFIRMED and the payment COMPLETED, and a confirmation email goes out. Signed, deduplicated webhooks cover the case where the browser never comes back.","code":"prisma.$transaction([...])"},
        ],
      },
      {
        title: "Getting paid as an agency",
        summary: "How an agency’s earnings turn into a payout, with the commission taken off along the way.",
        steps: [
          {"layer":"interface","title":"The agency asks for a payout","detail":"On Earnings & Payouts the owner enters an amount. The money goes to the bank account or UPI ID saved in the agency’s settings, and the request is refused if neither is set.","code":"createPayoutRequestAction({ grossAmount })"},
          {"layer":"auth","title":"Members only","detail":"The caller has to belong to an agency, as its owner or as staff. A suspended agency can’t request payouts at all.","code":"getUserAgencyAccess(userId, role)"},
          {"layer":"api","title":"The balance is worked out again","detail":"Only confirmed or completed bookings older than the holding period count, which is 7 days by default. The commission comes off, and anything already requested or paid is subtracted.","code":"grossAvailable * (1 - commissionRate)"},
          {"layer":"api","title":"Limits apply","detail":"The amount has to clear the minimum, ₹1,000 by default, and an agency can only have one pending request at a time."},
          {"layer":"data","title":"The request is recorded","detail":"The payout is saved as PENDING with the gross amount, the commission and the net amount, and the audit log gets an entry.","code":"writeAuditLog({ action: \"payout.created\" })"},
          {"layer":"auth","title":"An admin pays it out","detail":"Approving and settling both check for the admin role. Settling needs the bank’s UTR number, so every payout can be traced to a real transfer.","code":"settlePayoutAction(payoutId, utrNumber)"},
        ],
      },
    ],
    approach: [
      "It’s one Next.js 16 app. Pages render on the server, and every change goes through a Server Action that checks the caller’s role and agency before it touches any data. Prisma models the whole domain in PostgreSQL: packages, itineraries, bookings, payments, payouts and the audit trail.",
      "Gemini, Razorpay and email each live behind a small server-side module, so the rest of the app never talks to a third party directly.",
    ],
    architecture: {
      interface: ["Traveler site and AI trip builder", "Agency console", "Admin console", "Revenue and booking charts"],
      api: ["Server Actions for every change", "Route handlers for payments, trips, notifications", "Booking state machine", "Commission and payout rules"],
      auth: ["Better Auth sessions", "Email and Google sign-in", "Four roles checked on the server", "Agency-scoped data access"],
      data: ["PostgreSQL through Prisma", "25 models, 18 enums", "Audit log with before and after snapshots"],
      ai: ["Gemini itinerary generation", "Razorpay orders and signed webhooks", "Transactional email over SMTP"],
    },
    stack: [
      { group: "Interface", items: ["Next.js 16 App Router", "React", "TypeScript", "Tailwind CSS 4", "Recharts"] },
      { group: "Server", items: ["Server Actions", "Route Handlers", "Zod"] },
      { group: "Auth", items: ["Better Auth", "Google OAuth", "Role-based access"] },
      { group: "Data", items: ["PostgreSQL", "Prisma ORM"] },
      { group: "Integrations", items: ["Google Gemini", "Razorpay", "Nodemailer"] },
    ],
    dataModel: [
      { group: "People", items: ["User", "TravelerProfile", "Agency", "AgencyStaff"] },
      { group: "Catalog", items: ["Package", "Itinerary", "Activity", "ItineraryHotel", "ItineraryTransport", "Review", "Favorite"] },
      { group: "Trips and bookings", items: ["Trip", "Booking", "Payment", "PaymentEvent"] },
      { group: "Operations", items: ["Vendor", "Task", "Document", "Notification"] },
      { group: "Money and platform", items: ["AgencyPayout", "PlatformSettings", "AuditLog"] },
      { group: "Sign-in", items: ["Session", "Account", "Verification"] },
    ],
    decisions: [
      {
        title: "Payment webhooks that can’t confirm a booking twice",
        body: "Payment providers retry webhooks, so the same event can arrive more than once. The handler checks Razorpay’s HMAC signature with a timing-safe comparison, then reserves the event ID in a table with a unique constraint. A repeat delivery hits the constraint and stops early, and the payment and booking are updated together in one transaction.",
        excerpt: {
          file: "app/api/payments/webhook/[gateway]/route.ts",
          language: "ts",
          code: `async function reserveEvent(gateway: string, providerEventId: string, eventType: string) {
  try {
    await prisma.paymentEvent.create({ data: { gateway, providerEventId, eventType } });
    return true;
  } catch (error: unknown) {
    // Unique constraint: this event was already processed.
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return false;
    throw error;
  }
}

// …inside POST, after the signature check
if (!(await reserveEvent("razorpay", eventId, event.event))) {
  return NextResponse.json({ received: true });
}`,
        },
      },
      {
        title: "Treating AI output like user input",
        body: "Gemini is asked for JSON, but I still parse the answer with a Zod schema and check there’s exactly one entry per day before saving anything. If it doesn’t pass, the traveler gets a locally generated itinerary instead of an error.",
        excerpt: {
          file: "lib/ai.ts",
          language: "ts",
          code: `function validateGeneratedTrip(candidate: unknown, expectedDays: number): GeneratedTrip | null {
  const parsed = generatedTripSchema.safeParse(candidate);
  if (!parsed.success) return null;
  const days = parsed.data.itinerary.map((day) => day.dayNumber).sort((a, b) => a - b);
  if (days.length !== expectedDays || days.some((day, index) => day !== index + 1)) return null;
  return parsed.data;
}`,
        },
      },
      {
        title: "All the booking rules in one place",
        body: "Every allowed booking status change lives in a single transition map. Server actions check it before updating a booking, and it has unit tests that run on Node’s built-in test runner.",
        excerpt: {
          file: "lib/booking-rules.ts",
          language: "ts",
          code: `const bookingTransitions: Record<BookingStatus, readonly BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "COMPLETED", "PENDING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["CONFIRMED", "COMPLETED", "CANCELLED", "REFUNDED"],
  COMPLETED: ["CONFIRMED", "PROCESSING", "REFUNDED"],
  CANCELLED: ["CONFIRMED", "PENDING", "REFUNDED"],
  REFUNDED: [],
};

export function canTransitionBooking(from: BookingStatus, to: BookingStatus) {
  return bookingTransitions[from]?.includes(to) ?? false;
}`,
        },
      },
      {
        title: "Checking the agency on every write",
        body: "Agency data is never fetched by an ID from the request alone. Each action first works out which agency the caller belongs to, as owner or as active staff, and every create, update and delete confirms the record belongs to that agency before it runs.",
      },
    ],
    nextSteps: [
      "Currency conversion uses fixed exchange rates. A live rates API should replace them.",
      "Destinations already have latitude and longitude fields, but nothing fills them yet, so there’s no map on the package page.",
      "Tests cover the booking rules and currency helpers so far. Payments and payouts need integration tests next.",
    ],
    repo: "https://github.com/dakshn15/waypoint",
    timeline: "Jun – Oct 2026",
  },
  {
    slug: "petcare",
    name: "PetCare",
    tagline: "A grooming and adoption site with a full admin back office.",
    summary:
      "Customers book grooming and apply to adopt pets. The business runs bookings, adoptions, reviews, users and site content from an admin panel on the same API.",
    type: "Full-stack web app",
    year: "2025–26",
    role: "Solo full-stack developer",
    layers: ["interface", "api", "auth", "data"],
    cover: {
      src: petcareCover,
      alt: "PetCare’s home page on a desktop screen beside the mobile version, both showing the headline “Provide Attention and Care for all the Pets.”",
    },
    scope: [
      { value: "11", label: "REST resource routers" },
      { value: "10", label: "Mongoose data models" },
      { value: "10", label: "admin panel sections" },
      { value: "5", label: "kinds of email sent" },
    ],
    overview: [
      "A pet grooming and adoption business needs two things online: a simple way for customers to book or apply, and a place where staff can deal with those requests.",
      "PetCare does both. The public site and the admin panel use the same REST API, so a booking shows up for staff the moment a customer makes it, and the content on the site is edited from the panel instead of the code.",
    ],
    users: [
      {
        name: "Visitor",
        summary: "Anyone browsing the site.",
        can: [
          "Browse grooming services, add-ons and pricing packages",
          "Search adoptable pets and filter by type, gender and size",
          "Read FAQs and published reviews",
          "Send a message through the contact form",
          "Install the site on their phone",
        ],
      },
      {
        name: "Customer",
        summary: "Signed in with an account.",
        can: [
          "Book grooming with a date, a time slot and add-ons",
          "Apply to adopt a pet",
          "Follow their bookings and applications from one account page",
          "Cancel their own bookings",
          "Write reviews, which go live after approval",
          "Change their details, password and photo",
        ],
      },
      {
        name: "Admin",
        summary: "Runs the business from the panel.",
        can: [
          "Confirm, complete or cancel bookings",
          "Approve or reject adoption applications",
          "Add pets with photos and keep the list current",
          "Moderate reviews and read contact messages",
          "Create users and change their roles",
          "Edit services, pricing, site details and SEO text",
        ],
      },
    ],
    featureGroups: [
      {
        title: "Booking grooming",
        items: [
          "Services with their steps, what’s included and optional add-ons",
          "Pet type and size, a date, and a morning, afternoon or flexible slot",
          "The total is recalculated on the server from the service’s own prices",
          "A booking ID the customer can quote",
          "Emails when a booking is received and whenever its status changes",
        ],
      },
      {
        title: "Adoption",
        items: [
          "Adoptable pets with search and type, gender and size filters",
          "A page for every pet",
          "Applications with the preferred breed, age range, size and the reason for adopting",
          "Applications go from Under Review to Approved or Rejected, with an email either way",
        ],
        image: {
          src: petcareAdoption,
          alt: "The adoptable pets page on a phone and a desktop screen, with search, gender and size filters, and pet type buttons.",
        },
      },
      {
        title: "Services and content",
        summary: "Nothing on the public site needs a code change to update.",
        items: [
          "Services, add-ons and pricing packages are edited in the panel",
          "Services can be switched off or soft-deleted without breaking old bookings",
          "FAQs, the hero and about text, contact details and opening hours come from the database",
          "Meta title, description and keywords are editable for SEO",
        ],
        image: {
          src: petcareServices,
          alt: "The services page overlapped by the pricing page with basic, premium, and deluxe packages.",
        },
      },
      {
        title: "Admin panel",
        items: [
          "Ten sections: dashboard, users, services, bookings, adoptions, pets, pricing, reviews, messages and settings",
          "A chart of bookings over the last twelve months",
          "Recent users, bookings, adoptions and an activity feed",
          "Search and pagination on the larger tables",
          "Pet photos uploaded straight from the form",
        ],
      },
      {
        title: "Accounts and security",
        items: [
          "Access tokens for 15 minutes and refresh tokens for 7 days, both in HTTP-only cookies",
          "Expired sessions refresh in the background and retry the request",
          "Sign-in is limited to 10 failed attempts every 10 minutes",
          "Helmet headers, CORS rules and express-validator on inputs",
          "Welcome and password reset emails",
          "Every admin action written to an activity log",
        ],
      },
      {
        title: "On a phone",
        items: ["Layouts start from phone sizes and grow from there", "Installable as a PWA, with an install button"],
        image: {
          src: petcareMobile,
          alt: "Two phone screens: the PetCare home page and the adoptable pets search.",
        },
      },
    ],
    walkthroughs: [
      {
        title: "Booking a grooming appointment",
        summary: "From the booking form to an appointment staff can act on, with the price decided by the server.",
        steps: [
          {"layer":"interface","title":"The customer books","detail":"They choose a service, describe their pet, pick a date and time, and add any extras. The form submits through a shared Axios client.","code":"POST /api/bookings"},
          {"layer":"auth","title":"The session is checked, quietly","detail":"The protect middleware reads the JWT from an HTTP-only cookie. If it has expired, the API answers TOKEN_EXPIRED, and the client refreshes the token and retries without the customer noticing.","code":"router.post('/', protect, createBooking)"},
          {"layer":"api","title":"The server prices the booking","detail":"The service is looked up by its slug, skipping soft-deleted ones, and the total is recalculated from that service’s own add-on prices. Numbers sent by the browser are never trusted.","code":"totalPrice += addon.price"},
          {"layer":"data","title":"The booking is saved","detail":"A Booking document is created as Pending, linked to the customer and the service, with a readable label of what was booked.","code":"Booking.create({ status: 'Pending' })"},
          {"layer":"ai","title":"Email and audit trail","detail":"A confirmation email goes out through Nodemailer, and the action is logged with the user, the resource and the IP address.","code":"sendBookingConfirmation(user, booking)"},
          {"layer":"interface","title":"Staff take it from there","detail":"In the admin panel, staff confirm, complete or cancel the booking. Those routes only answer to the admin role.","code":"authorize('admin')"},
        ],
      },
      {
        title: "Applying to adopt",
        summary: "An application goes from the customer to the admin and back, with an email at the end.",
        steps: [
          {"layer":"interface","title":"The customer applies","detail":"They describe the pet they’re looking for, give their address and say why they want to adopt, then send the form.","code":"POST /api/adoptions"},
          {"layer":"auth","title":"Signed-in customers only","detail":"The route sits behind protect, so only a signed-in customer can apply, and the application is tied to their account.","code":"router.post('/', protect, submitApplication)"},
          {"layer":"data","title":"Saved as Under Review","detail":"The application gets its own readable ID and starts as Under Review. The customer can see it on their account page."},
          {"layer":"interface","title":"An admin decides","detail":"In the Adoptions section the admin approves or rejects it. Both routes check for the admin role.","code":"PUT /api/adoptions/:id/approve"},
          {"layer":"ai","title":"The customer hears back","detail":"An email with the decision goes out through Nodemailer, and the action is logged with the admin’s ID and IP address.","code":"sendAdoptionStatusEmail(user, application)"},
        ],
      },
    ],
    approach: [
      "The React single-page app talks to an Express API split by resource: auth, services, bookings, pets, adoptions, reviews, FAQs, contact, users, settings and the dashboard.",
      "Mongoose models carry the validation, indexes and soft-delete flags. Inputs are checked with express-validator, every admin route sits behind authentication and a role check, and admin actions go into an activity log.",
    ],
    architecture: {
      interface: ["Customer site: services, booking, adoption, reviews", "Admin panel at /admin", "Installable PWA"],
      api: ["Express REST API with 11 resource routers", "express-validator on inputs", "Rate limiting and Helmet headers", "Activity logging"],
      auth: ["JWT access and refresh tokens", "HTTP-only cookies", "Silent refresh in the client", "authorize(\"admin\") route guards"],
      data: ["MongoDB with Mongoose", "10 models with indexes", "Soft deletes", "Aggregations for dashboard charts"],
    },
    stack: [
      { group: "Interface", items: ["React 19", "Vite", "Tailwind CSS", "React Router 7", "PWA"] },
      { group: "Server", items: ["Node.js", "Express", "express-validator", "Helmet", "Multer"] },
      { group: "Auth", items: ["JWT access and refresh tokens", "HTTP-only cookies", "Role middleware"] },
      { group: "Data", items: ["MongoDB", "Mongoose"] },
      { group: "Integrations", items: ["Nodemailer"] },
    ],
    dataModel: [
      { group: "People", items: ["User"] },
      { group: "Grooming", items: ["Service", "Booking"] },
      { group: "Adoption", items: ["Pet", "AdoptionApplication"] },
      { group: "Content", items: ["Review", "FAQ", "WebsiteSettings"] },
      { group: "Back office", items: ["ContactMessage", "ActivityLog"] },
    ],
    decisions: [
      {
        title: "Short-lived tokens without constant sign-outs",
        body: "Access tokens expire after 15 minutes and refresh tokens after 7 days, and both live in HTTP-only cookies that scripts can’t read. When the API answers TOKEN_EXPIRED, an Axios interceptor refreshes once and replays the original request.",
        excerpt: {
          file: "frontend/src/api/axios.js",
          language: "js",
          code: `instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshRes = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
      if (refreshRes.data?.success) return instance(originalRequest);
    }
    // …normalise and reject
  },
);`,
        },
      },
      {
        title: "Role checks as small middleware",
        body: "Authentication and authorisation are separate middleware, so each route says exactly who may call it and the controller never has to check.",
        excerpt: {
          file: "backend/middleware/auth.js",
          language: "js",
          code: `export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: \`Role '\${req.user.role}' is not authorized to access this resource\`,
      });
    }
    next();
  };
};`,
        },
      },
      {
        title: "Brute-force protection where it matters",
        body: "Sign-in routes get a strict limiter that only counts failed attempts, ten every ten minutes. The rest of the API has a looser global limit.",
        excerpt: {
          file: "backend/middleware/rateLimiter.js",
          language: "js",
          code: `export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});`,
        },
      },
      {
        title: "Dashboard numbers straight from the database",
        body: "The booking chart comes from a MongoDB aggregation that groups the last twelve months by year and month and skips soft-deleted records. Empty months are filled in on the server, so the chart never has gaps.",
      },
    ],
    nextSteps: [
      "Approving an adoption doesn’t mark the pet as adopted yet. That should happen in the same request.",
      "Uploaded photos are saved to the server’s disk. Object storage would make deploying much simpler.",
      "There are no automated tests yet. Booking prices and the auth middleware are where I’d start.",
    ],
    repo: "https://github.com/dakshn15/petcare",
    timeline: "Jul 2025 – Jul 2026",
  },
  {
    slug: "rezumely",
    name: "Rezumely",
    tagline: "An AI resume builder with job matching and print-ready PDFs.",
    summary:
      "Pick one of eight templates, fill it in section by section, and let Gemini help with the writing, the ATS check, job matching and the cover letter.",
    type: "AI-powered web app",
    year: "2025–26",
    role: "Full-stack developer",
    layers: ["interface", "api", "auth", "data", "ai"],
    cover: {
      src: rezumelyCover,
      alt: "Rezumely’s customize step with eight resume templates and a live preview, beside the templates page on a phone.",
    },
    scope: [
      { value: "8", label: "resume templates" },
      { value: "6", label: "AI endpoints" },
      { value: "8", label: "resume sections" },
      { value: "4", label: "editor steps with live preview" },
    ],
    overview: [
      "Most of the time spent on a resume goes into staring at an empty box, and then wondering whether an applicant tracking system will even read the result.",
      "Rezumely puts the help inside the editor. Gemini can write a summary or bullet points, compare the resume with a job description and draft a cover letter, and you see every change in the template as you go. You don’t need an account to use any of it.",
    ],
    users: [
      {
        name: "Guest",
        summary: "No account needed.",
        can: [
          "Use the full editor and all eight templates",
          "Try every AI tool",
          "Pick up where they left off, saved in the browser",
          "Export a PDF through the browser’s print dialog",
        ],
      },
      {
        name: "Signed-in user",
        summary: "Has an account.",
        can: [
          "Save resumes to the server and open them anywhere",
          "Keep versions and restore an older one",
          "Publish a public link to a resume",
          "Download an A4 PDF rendered on the server",
        ],
      },
    ],
    featureGroups: [
      {
        title: "The editor",
        items: [
          "Four steps: content, AI tools, customize and finalize",
          "Eight sections, from personal details to certifications and extras",
          "A live preview of the chosen template, scaled to fit the screen",
          "Work is kept in the browser between visits",
        ],
        image: {
          src: rezumelyEditor,
          alt: "The Rezumely editor: section navigation, the personal information form, and a live preview of a two-column resume, shown enlarged.",
        },
      },
      {
        title: "AI help",
        summary: "Every tool runs through Gemini on the server, with a fallback if it fails.",
        items: [
          "Summary options written for a target job title",
          "Achievement bullet points for a job entry",
          "Rewrites for weak or wordy text",
          "An ATS check of the whole resume",
          "A match score and missing keywords against a pasted job description",
          "A cover letter based on the resume and the job",
        ],
        image: {
          src: rezumelyAiTools,
          alt: "The AI-Powered Tools step with the job matcher and the cover letter generator, and its ATS score of 95 shown enlarged.",
        },
      },
      {
        title: "Templates and styling",
        items: [
          "Eight templates: Modern, Classic, Creative, Developer, Executive, Minimal, Academic and Professional",
          "Eight colour presets, or any colour you pick",
          "Six fonts and five text sizes",
        ],
      },
      {
        title: "Checking a resume",
        items: [
          "A score that runs in the browser, no AI needed",
          "Flags missing contact details, thin summaries and overused buzzwords",
          "Each tip is tied to the section it’s about",
        ],
      },
      {
        title: "Sharing and export",
        items: [
          "Public links by ID or a custom slug",
          "Version history with restore and delete",
          "PDF from the browser’s print engine, with text you can select",
          "A4 PDF rendered on the server with Puppeteer",
        ],
      },
      {
        title: "Pages for search",
        items: ["A gallery of every template", "Five landing pages for specific roles, like software engineer and designer", "A blog with five articles"],
      },
    ],
    walkthroughs: [
      {
        title: "Writing a summary with AI",
        summary: "One click in the editor, through a single AI service built to keep working when the model doesn’t.",
        steps: [
          {"layer":"interface","title":"The user asks for help","detail":"In the AI tools step they enter a target job title and ask for summary options.","code":"POST /ai/summary"},
          {"layer":"auth","title":"Guests welcome, users recognised","detail":"AI routes use optional authentication. Anyone can try them, and signed-in users are identified from their JWT.","code":"router.use(optionalAuthToken)"},
          {"layer":"api","title":"A thin controller","detail":"The controller insists on a job title, answering 400 without one, and passes everything else to the shared AI service.","code":"aiService.generateSummary(jobTitle, …)"},
          {"layer":"ai","title":"Cache, retry, fall back","detail":"The service checks a one-hour in-memory cache first, then calls Gemini 2.0 Flash with a system instruction, retrying rate limits with exponential backoff. If Gemini still fails, a template answers instead of an error.","code":"withRetry(() => model.generateContent(prompt))"},
          {"layer":"data","title":"Into the resume","detail":"The chosen summary goes into the Zustand store and the preview updates. Signed-in users save the resume to PostgreSQL and can keep versions to restore later.","code":"PUT /resumes/:id"},
        ],
      },
      {
        title: "Matching a job description",
        summary: "Paste a job post and see how well the resume fits it, even when the AI is unavailable.",
        steps: [
          {"layer":"interface","title":"The user pastes a job post","detail":"The job matcher sends the resume as plain text along with the job description.","code":"POST /job/analyze"},
          {"layer":"api","title":"Both halves are required","detail":"Without the resume text or the job description the controller answers 400 and says which one is missing."},
          {"layer":"ai","title":"Gemini compares them","detail":"Both are trimmed to 4,000 characters and Gemini is asked for JSON with a match score, matching keywords, missing keywords and a short gap analysis.","code":"askGeminiJSON(prompt, …)"},
          {"layer":"ai","title":"A keyword fallback","detail":"If Gemini fails, the server compares keywords from the job post with the resume and builds the same shape of answer, so the screen never comes back empty."},
          {"layer":"interface","title":"The result","detail":"The score, the keywords to add and the gap analysis appear next to the resume, ready to act on in the editor."},
        ],
      },
    ],
    approach: [
      "The editor is a React and TypeScript app with Zustand for state. Guests work entirely in browser storage. Signed-in users save to PostgreSQL through an Express API with Prisma, including version history and public share links.",
      "Every Gemini call goes through one server-side service. API keys never reach the browser, and every AI feature shares the same caching, retry and fallback behaviour.",
    ],
    architecture: {
      interface: ["Four-step editor with live preview", "8 templates with colour, font and size controls", "Guest mode on a persisted Zustand store"],
      api: ["Express REST API in TypeScript", "Resumes, versions, public links, PDFs", "Server-side PDF rendering with Puppeteer"],
      auth: ["JWT authentication", "bcrypt password hashing", "Public or private resume links"],
      data: ["PostgreSQL through Prisma", "Resume versions with restore", "Job match and cover letter tables, not used yet"],
      ai: ["Gemini summaries, bullet points, rewrites", "ATS check and job match", "Cover letters", "Cache, retry and fallbacks"],
    },
    stack: [
      { group: "Interface", items: ["React", "TypeScript", "Vite", "Tailwind CSS", "Radix UI", "Zustand"] },
      { group: "Server", items: ["Node.js", "Express", "TypeScript", "Puppeteer"] },
      { group: "Auth", items: ["JWT", "bcrypt"] },
      { group: "Data", items: ["PostgreSQL", "Prisma ORM"] },
      { group: "AI", items: ["Google Gemini"] },
    ],
    dataModel: [
      { group: "In use", items: ["User", "Resume", "ResumeVersion"] },
      { group: "Defined, not wired up yet", items: ["JobMatch", "CoverLetter", "Portfolio"] },
      { group: "In the browser", items: ["resumeStore", "authStore", "settingsStore"] },
    ],
    decisions: [
      {
        title: "PDFs that match the preview",
        body: "The first export captured the on-screen preview with html2canvas. That tied the PDF to the size of the window and flattened everything into one big image. I replaced it with a print pipeline: an isolated, paper-sized copy of the resume printed through the browser’s own layout engine, so text stays selectable and the layout matches the template exactly.",
        excerpt: {
          file: "src/utils/pdfExport.ts",
          language: "ts",
          code: `/**
 * Opens the browser's native PDF print flow for an unscaled copy of the resume.
 *
 * The editor preview is deliberately scaled with CSS transforms. Capturing that
 * node with html2canvas made the exported layout depend on the current viewport
 * and converted all content into one oversized image. Printing an isolated,
 * paper-sized document uses the browser's layout engine instead, which preserves
 * the same flex/grid structure, SVG icons, backgrounds and page-break rules.
 */
export const exportToPDF = async (element, filename, settings, onProgress) => {`,
        },
      },
      {
        title: "AI that fails politely",
        body: "Rate limits are retried with exponential backoff, and if Gemini still fails, every feature has a fallback. Job matching, for example, drops back to a keyword comparison, so the user always gets an answer.",
        excerpt: {
          file: "server/src/services/ai.service.ts",
          language: "ts",
          code: `const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 2, baseDelay = 800): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status || error?.code || error?.response?.status;
      const isRateLimit = status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED");
      if (isRateLimit && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(1.5, attempt)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
};`,
        },
      },
      {
        title: "Not paying twice for the same answer",
        body: "Responses are cached in memory for an hour, keyed by the prompt and the system instruction. Reopening a tool or clicking twice doesn’t cost another API call.",
      },
    ],
    nextSteps: [
      "Job matches and cover letters aren’t saved yet, even though their tables exist.",
      "The AI cache lives in memory, so a restart clears it and two servers wouldn’t share it. Redis would fix both.",
      "The keyword fallback for job matching is rough. It only compares words, and its score is kept between 40 and 95.",
    ],
    repo: "https://github.com/dakshn15/rezumely",
    timeline: "Jan 2025 – Jul 2026",
  },
  {
    slug: "techzonix",
    name: "Techzonix",
    tagline: "An installable electronics storefront that keeps working offline.",
    summary:
      "An online shop that runs entirely in the browser, from catalog filters and product comparison to a guarded checkout. It installs like an app and works offline.",
    type: "Frontend app (PWA)",
    year: "2025–26",
    role: "Frontend developer",
    layers: ["interface"],
    cover: {
      src: techzonixCover,
      alt: "The Techzonix home page with its earbuds banner on a desktop screen, beside the same page on a phone.",
    },
    scope: [
      { value: "23", label: "routes" },
      { value: "5", label: "catalog filters" },
      { value: "4", label: "persisted state stores" },
      { value: "1", label: "service worker with offline page" },
    ],
    overview: [
      "Techzonix is a frontend project. I wanted the whole shopping flow in one app: browsing, comparing, buying and coming back later to a cart that is still there.",
      "It runs entirely in the browser, with no backend, which let me spend the time on state, routing and how the app behaves offline.",
    ],
    users: [
      {
        name: "Shopper",
        summary: "Browsing without an account.",
        can: [
          "Browse and filter the catalog",
          "Search from any page with the keyboard",
          "Fill a cart, a wishlist and a compare list that survive a refresh",
          "Read the blog and the store’s info pages",
        ],
      },
      {
        name: "Signed-in shopper",
        summary: "Using a demo account kept in the browser.",
        can: [
          "Check out with standard or express delivery",
          "Save delivery addresses",
          "See their past orders",
          "Reset a demo password",
        ],
      },
    ],
    featureGroups: [
      {
        title: "Catalog",
        items: [
          "Filters for category, brand, price, rating and stock",
          "Sort by price or newest",
          "Grid and list views",
          "A collections page",
        ],
        image: {
          src: techzonixCatalog,
          alt: "The Techzonix products page with category and brand filters beside a grid of products.",
        },
      },
      {
        title: "Product pages",
        items: ["Image gallery, rating, specs and stock status", "Related products underneath", "Add to cart only when the item is in stock"],
        image: {
          src: techzonixProduct,
          alt: "A Techzonix product page for a smartwatch with an image gallery, rating, price, stock status, and add to cart.",
        },
      },
      {
        title: "Search",
        items: ["A search dialog you can open from any page", "Arrow keys to move through results", "Recent searches, which you can clear"],
      },
      {
        title: "Cart, wishlist and compare",
        items: ["Quantities in the cart, with 8% tax shown", "A wishlist and a side-by-side compare list", "All of it saved to localStorage"],
      },
      {
        title: "Checkout and account",
        items: [
          "Sign-in guard that sends you back to where you were",
          "Standard delivery, or express for $5.99",
          "Card number and form validation",
          "Saved addresses and order history",
        ],
      },
      {
        title: "Works offline",
        items: [
          "Installable as a PWA",
          "The app shell is precached, and fonts and images are cached as you browse",
          "An offline page when there’s no connection",
          "Asks before switching to a new version",
        ],
      },
    ],
    walkthroughs: [
      {
        title: "From cart to order",
        summary: "A full checkout that lives in the browser and survives a refresh at every step.",
        steps: [
          {"layer":"interface","title":"Add to cart","detail":"The cart is a reducer in React context. Every change is written to localStorage, so the cart is still there tomorrow.","code":"localStorage.setItem(\"cart\", …)"},
          {"layer":"interface","title":"A guard at the door","detail":"Checkout sits behind RequireAuth. A signed-out shopper is sent to sign in with the original location saved, and comes back to checkout afterwards.","code":"<Navigate to=\"/login\" state={{ from }} />"},
          {"layer":"interface","title":"Totals and validation","detail":"Checkout works out the subtotal, 8% tax and $5.99 express delivery, and validates every field, including a 16-digit card number, before allowing the order.","code":"const tax = subtotal * TAX_RATE"},
          {"layer":"interface","title":"The order is placed","detail":"The order is saved to the account’s order history in the browser, the cart is cleared, and the shopper lands on their orders page.","code":"navigate(\"/order\")"},
        ],
      },
    ],
    approach: [
      "Products, blog posts and page content live in static data modules. The cart, wishlist, compare list and demo user each have their own React context saved to localStorage, and React Router guards the account and checkout routes.",
    ],
    architecture: {
      interface: ["23 routes: storefront, account, content, policies", "Cart, wishlist, compare and user contexts", "Service worker with precache and runtime caching"],
    },
    stack: [
      { group: "Interface", items: ["React 19", "React Router 7", "Tailwind CSS 4", "Swiper"] },
      { group: "State", items: ["React Context", "localStorage"] },
      { group: "Tooling", items: ["Vite", "ESLint", "vite-plugin-pwa", "Workbox"] },
    ],
    dataModel: [
      { group: "Saved in the browser", items: ["Cart", "Wishlist", "Compare list", "Demo user, addresses and orders"] },
      { group: "Static data", items: ["Products", "Collections", "Blog posts", "Site content"] },
    ],
    decisions: [
      {
        title: "Sending people back where they were",
        body: "Guarded routes redirect to sign-in with the original location in router state, and the login page sends the user back there afterwards, so checkout survives a sign-in.",
        excerpt: {
          file: "src/components/Auth/RequireAuth.jsx",
          language: "js",
          code: `const RequireAuth = ({ children }) => {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};`,
        },
      },
      {
        title: "Offline, but never out of date",
        body: "The service worker precaches the app shell and caches fonts and images as they load. It registers in prompt mode, so when a new version is deployed the user is asked to refresh instead of being switched over mid-session.",
        excerpt: {
          file: "vite.config.js",
          language: "js",
          code: `VitePWA({
  registerType: "prompt",
  workbox: {
    globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\\/\\/fonts\\.googleapis\\.com\\/.*/i,
        handler: "CacheFirst",
        options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10 } },
      },
    ],
  },
})`,
        },
      },
    ],
    nextSteps: [
      "Checkout creates a demo order in the browser. A real API and payment provider come next.",
      "Sign-in is simulated in localStorage for the demo and isn’t safe for production.",
      "The main bundle is large. Splitting it by route would make the first load much lighter.",
    ],
    repo: "https://github.com/dakshn15/techzonix",
    timeline: "Oct 2025 – Jul 2026",
  },
];
