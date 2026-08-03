import type { Metadata } from "next";
import Link from "next/link";
import { WalkthroughForm } from "@/components/forms/walkthrough-form";
import { Container, Eyebrow, SampleNote } from "@/components/ui/primitives";
import { MaskedLines } from "@/components/motion/primitives";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a walkthrough",
  description:
    "Send the lane that worries you. Forty minutes with an engineer and a quality lead, and a written summary afterwards.",
  alternates: { canonical: "/contact" },
};

const ANSWERS = [
  {
    q: "Who joins the call?",
    a: "An engineer who has built lane monitoring, and a quality lead who has sat through inspections. Two people, no sales deck.",
  },
  {
    q: "What should I bring?",
    a: "One lane. Origin, destination, profile, transit time, and whatever you currently use to log temperature.",
  },
  {
    q: "What do I get?",
    a: "A written summary of where your current record has gaps, what Coldharbour would cover, and what would stay your responsibility.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="field-top relative overflow-hidden border-b border-line pt-16 pb-16 md:pt-24">
        <div
          aria-hidden="true"
          className="grid-field pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative">
          <Eyebrow>Talk to us</Eyebrow>
          <MaskedLines
            as="h1"
            trigger={false}
            className="display mt-5 max-w-4xl text-4xl text-ink md:text-5xl"
            lines={["Send the lane that keeps", "your quality team awake."]}
          />
          <p className="measure mt-6 text-lg text-mutedfg">
            Forty minutes, screen shared, on your data rather than a demo tenant. If Coldharbour is
            the wrong fit we will say so on the call.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <WalkthroughForm />
              <SampleNote className="mt-6">
                Demonstration build. Submissions are stored in the local project database and no
                email is sent.
              </SampleNote>
            </div>

            <div className="lg:col-span-5">
              <dl className="space-y-8">
                {ANSWERS.map((item) => (
                  <div key={item.q} className="border-t border-line pt-6">
                    <dt className="text-lg text-ink">{item.q}</dt>
                    <dd className="measure mt-2 text-base text-mutedfg">{item.a}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 rounded-lg border border-line bg-raised p-6">
                <p className="label-mono">Prefer to write first</p>
                <ul className="mt-4 space-y-3 text-base">
                  <li>
                    <a
                      href={`mailto:${SITE.contact.email}`}
                      className="text-ink underline-offset-4 hover:text-accent hover:underline"
                    >
                      {SITE.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${SITE.contact.phone.replace(/\s/g, "")}`}
                      className="text-ink underline-offset-4 hover:text-accent hover:underline"
                    >
                      {SITE.contact.phone}
                    </a>
                  </li>
                  <li className="text-mutedfg">{SITE.contact.hours}</li>
                </ul>
                <p className="mt-6 border-t border-line pt-4 text-sm text-mutedfg">
                  Curious first?{" "}
                  <Link href="/lanes" className="text-ink underline underline-offset-4 hover:text-accent">
                    Read a sample lane
                  </Link>{" "}
                  or{" "}
                  <Link href="/pricing" className="text-ink underline underline-offset-4 hover:text-accent">
                    compare plans
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
