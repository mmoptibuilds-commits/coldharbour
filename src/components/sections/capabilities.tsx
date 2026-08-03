import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/button";
import { Reveal } from "@/components/motion/primitives";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { CAPABILITIES } from "@/lib/site";

export function Capabilities() {
  return (
    <section className="border-t border-line py-24 md:py-32" aria-labelledby="capabilities-title">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>What the system does</Eyebrow>
            <h2 id="capabilities-title" className="display mt-4 text-3xl text-ink md:text-4xl">
              Four jobs, done properly
            </h2>
          </div>
          <Link
            href="/platform"
            className="group inline-flex items-center gap-2 text-sm text-ink underline-offset-4 hover:text-accent hover:underline"
          >
            See how each one works
            <ArrowGlyph />
          </Link>
        </div>

        <div className="mt-16 border-t border-line">
          {CAPABILITIES.map((item) => (
            <Reveal key={item.index} y={16}>
              <article className="group grid gap-8 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
                <div className="md:col-span-1">
                  <span className="font-mono text-sm text-muted transition-colors duration-[260ms] group-hover:text-accent">
                    {item.index}
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="text-xl text-ink md:text-2xl">{item.title}</h3>
                  <p className="measure mt-4 text-base text-mutedfg">{item.lede}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 self-start md:col-span-5">
                  {item.specs.map(([label, value]) => (
                    <div key={label}>
                      <dt className="label-mono">{label}</dt>
                      <dd className="mt-1.5 font-mono text-sm text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
