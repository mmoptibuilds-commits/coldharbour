import { Container, Skeleton } from "@/components/ui/primitives";

export default function FieldNotesLoading() {
  return (
    <div className="py-14 md:py-20">
      <Container>
        <span className="sr-only" role="status">
          Loading field notes
        </span>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-6 h-12 w-[min(26rem,90%)]" />
        <Skeleton className="mt-3 h-12 w-[min(30rem,95%)]" />

        <div className="mt-10 flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-24" />
          ))}
        </div>

        <ul className="mt-14 border-t border-line">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-3 w-32" />
              </div>
              <div className="md:col-span-9">
                <Skeleton className="h-6 w-[min(30rem,90%)]" />
                <Skeleton className="mt-3 h-4 w-[min(34rem,95%)]" />
                <Skeleton className="mt-2 h-4 w-[min(24rem,80%)]" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
