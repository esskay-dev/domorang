import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Domorang",
  description:
    "How Domorang collects, uses, and protects your personal data, in line with the Nigeria Data Protection Act (NDPA) 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold text-[#31768a] mb-2">
        Domorang Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated: July 17, 2026
      </p>

      <p className="mb-8 leading-relaxed">
        Domorang (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) operates
        domorang.com, a platform committed to making property transactions
        safer, more transparent, and more trustworthy in Abuja, Nigeria. This
        policy explains what personal data we collect, why, how we use it,
        and the rights you have over it, in line with the Nigeria Data
        Protection Act (NDPA) 2023.
      </p>
      <p className="mb-12 leading-relaxed">
        If you have questions about this policy or want to exercise any of
        the rights below, contact us at{" "}
        <a
          href="mailto:hello@domorang.com"
          className="text-[#31768a] underline"
        >
          hello@domorang.com
        </a>
        .
      </p>

      <Section title="1. Who this policy applies to">
        <p className="mb-2">This policy applies to anyone who uses Domorang, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Property seekers browsing or searching listings</li>
          <li>Property owners/landlords posting listings</li>
          <li>Agents creating profiles and managing listings</li>
          <li>Anyone who saves listings, leaves reviews, or submits reports</li>
        </ul>
      </Section>

      <Section title="2. What data we collect">
        <SubHeading>Account & profile data</SubHeading>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Name, email address, phone number</li>
          <li>Password (stored securely, never in plain text)</li>
          <li>Profile bio and role (seeker, agent, landlord)</li>
        </ul>

        <SubHeading>Agent-specific data</SubHeading>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Business/agent bio</li>
          <li>Social media and website links (e.g. Instagram)</li>
          <li>
            Verification status (currently based on profile completeness and
            platform review — we do not yet collect government ID documents;
            this may change as our verification process develops, and this
            policy will be updated if so)
          </li>
        </ul>

        <SubHeading>Listing data</SubHeading>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Property details, description, price, and category</li>
          <li>Property location, including map coordinates (latitude/longitude)</li>
          <li>Photos and video links submitted for listings</li>
        </ul>

        <SubHeading>Usage & interaction data</SubHeading>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Saved listings</li>
          <li>Reviews and ratings submitted</li>
          <li>
            Reports filed against listings or agents (including the content
            of the report, to allow us to investigate)
          </li>
        </ul>

        <SubHeading>Technical data</SubHeading>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>
            IP address, browser type, device information, and basic
            analytics collected automatically when you use the site
          </li>
        </ul>

        <p>
          We do <strong>not</strong> currently collect payment information.
          If Domorang introduces paid features, fees, or in-platform
          payments in the future, this policy will be updated before that
          data collection begins, and you will be notified.
        </p>
      </Section>

      <Section title="3. Why we collect this data (legal basis)">
        <p className="mb-2">
          We process personal data on the following grounds under the NDPA:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>
            <strong>Consent</strong> — for account creation, marketing
            communications, and optional profile information
          </li>
          <li>
            <strong>Contract/legitimate interest</strong> — to provide the
            core service: matching seekers with listings, enabling agents to
            manage listings, facilitating reviews and reports
          </li>
          <li>
            <strong>Legal obligation</strong> — where required to respond to
            lawful requests from regulators or authorities
          </li>
        </ul>
        <p className="mb-2">Specifically, we use your data to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Create and manage your account</li>
          <li>Display listings and agent profiles to other users</li>
          <li>Power search, map, and filtering features</li>
          <li>
            Investigate reports and moderate content to maintain
            listing/agent trust
          </li>
          <li>Communicate with you about your account or activity</li>
          <li>Improve the platform based on usage patterns</li>
        </ul>
      </Section>

      <Section title="4. Who we share data with">
        <p className="mb-2">
          We do not sell your personal data. We share data only with:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Service providers who help us run Domorang</strong>,
            under their own security and confidentiality obligations:
            <ul className="list-[circle] pl-6 mt-1 space-y-1">
              <li>Supabase (database hosting and authentication)</li>
              <li>Vercel (application hosting/deployment)</li>
              <li>Zoho Mail (email communication)</li>
              <li>Cloudflare (DNS and security)</li>
            </ul>
          </li>
          <li>
            <strong>Other users, where the platform is designed to show it</strong>{" "}
            — e.g. your listing details and agent profile are visible to
            seekers by design; reviews you post are visible publicly
          </li>
          <li>
            <strong>Regulators or law enforcement</strong>, only where
            legally required
          </li>
        </ul>
      </Section>

      <Section title="5. How we store and protect your data">
        <p>
          Your data is stored in Supabase, with row-level security (RLS)
          policies restricting access based on account role and ownership.
          We take reasonable technical and organizational measures to
          protect your data against loss, misuse, and unauthorized access,
          proportionate to our current size and the sensitivity of the data
          involved.
        </p>
      </Section>

      <Section title="6. How long we keep your data">
        <p>
          We retain your data for as long as your account is active. If you
          delete your account, we will delete or anonymize your personal
          data within a reasonable period, except where we&apos;re required
          to retain it (e.g. to resolve an open report or dispute, or to meet
          a legal obligation).
        </p>
      </Section>

      <Section title="7. Your rights">
        <p className="mb-2">Under the NDPA, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>
            <strong>Access</strong> the personal data we hold about you
          </li>
          <li>
            <strong>Correct</strong> inaccurate or incomplete data
          </li>
          <li>
            <strong>Delete</strong> your data, subject to legal or legitimate
            retention needs
          </li>
          <li>
            <strong>Object to</strong> or <strong>restrict</strong> certain
            processing
          </li>
          <li>
            <strong>Withdraw consent</strong> at any time, where processing
            is based on consent
          </li>
          <li>
            <strong>Request a copy</strong> of your data in a portable format
          </li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a href="mailto:hello@domorang.com" className="text-[#31768a] underline">
            hello@domorang.com
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </Section>

      <Section title="8. Cookies and tracking">
        <p>
          Domorang may use cookies or similar technologies for basic site
          functionality and analytics.
        </p>
      </Section>

      <Section title="9. Children's data">
        <p>
          Domorang is not directed at children, and we do not knowingly
          collect data from anyone under 18. If we learn we&apos;ve
          collected data from a minor without appropriate consent, we will
          delete it.
        </p>
      </Section>

      <Section title="10. Data breaches">
        <p>
          In the event of a data breach that poses a risk to your rights, we
          will notify affected users and, where required, the Nigeria Data
          Protection Commission (NDPC), in line with NDPA requirements.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this policy as Domorang grows and our data practices
          evolve (for example, if we introduce ID verification or payments).
          We&apos;ll update the &quot;Last updated&quot; date above and, for
          material changes, notify users directly.
        </p>
      </Section>

      <Section title="12. Contact us">
        <p>
          Questions, requests, or concerns about your data:{" "}
          <a href="mailto:hello@domorang.com" className="text-[#31768a] underline">
            hello@domorang.com
          </a>
        </p>
      </Section>

    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-[#31768a] mb-3">{title}</h2>
      <div className="leading-relaxed">{children}</div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-medium text-gray-900 mb-1">{children}</h3>;
}