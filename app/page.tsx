import { TopNav } from "@/components/layout/top-nav"
import { Planner } from "@/components/planner"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      <TopNav />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Planner />
      </div>
    </main>
  )
}
