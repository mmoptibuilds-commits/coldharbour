import { Container, Skeleton } from "@/components/ui/primitives";

export default function LanesLoading() {
  return (
    <div className="py-14 md:py-20">
      <Container>
        <span className="sr-only" role="status">
          Loading lanes
        </span>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-6 h-12 w-[min(28rem,90%)]" />
        <Skeleton className="mt-3 h-12 w-[min(34rem,95%)]" />
        <Skeleton className="mt-8 h-20 w-full max-w-xl" />

        <div className="mt-14 rounded-lg border border-line bg-raised p-5">
          <Skeleton className="h-11 w-full" />
        </div>

        <ul className="mt-6 border-t border-line">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="grid grid-cols-1 gap-4 border-b border-line py-5 md:grid-cols-12 md:items-center">
              <div className="md:col-span-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-40" />
              </div>
              <div className="md:col-span-3">
                <Skeleton className="h-3 w-44" />
                <Skeleton className="mt-2 h-3 w-32" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-7 w-26" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="flex justify-end md:col-span-2">
                <Skeleton className="size-10 rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
