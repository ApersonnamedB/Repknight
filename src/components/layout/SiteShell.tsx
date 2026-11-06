import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const NAV = [
  { to: '/openings', label: 'Openings' },
  { to: '/puzzles', label: 'Puzzles' },
  { to: '/endgames', label: 'Endgames' },
  { to: '/advanced', label: 'Advanced' },
] as const

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-md">
      <span className="piece piece-w flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-2xl">♞{'︎'}</span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Rep<span className="text-accent">Knight</span>
      </span>
    </Link>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
                activeProps={{ className: 'bg-secondary !text-foreground' }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden rounded-full font-bold sm:inline-flex">
              <Link to="/puzzles">Start training</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-6">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Pick a training area.</SheetDescription>
                <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                  {NAV.map((n) => (
                    <Link key={n.to} to={n.to} className="rounded-lg px-3 py-3 font-bold hover:bg-secondary">
                      {n.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-lg font-extrabold">RepKnight</p>
            <p className="text-sm opacity-80">Built for young players in Tennessee, from first moves to master level.</p>
          </div>
          <p className="text-sm opacity-70">Openings · Puzzles · Endgames · Advanced technique</p>
        </div>
      </footer>
    </div>
  )
}
