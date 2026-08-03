import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { NAV } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>404</Eyebrow>
          <h1 className="display mt-5 text-4xl text-ink md:text-5xl">
            No record at that address
          </h1>
          <p className="measure mt-6 text-lg text-mutedfg">
            The lane, note or page you asked for is not in this build. These are the places worth
            going instead.
          </p>

          <ul className="mt-10 border-t border-line">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/contact", label: "Book a walkthrough" }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between border-b border-line py-4 text-lg text-ink transition-colors duration-[180ms] hover:text-accent"
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-mono text-sm text-muted group-hover:text-accent">
                      →
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </Container>
    </section>
  );
}
