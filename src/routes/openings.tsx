import { createFileRoute } from '@tanstack/react-router'
import { Library } from '@/components/chess/Library'

export const Route = createFileRoute('/openings')({
  head: () => ({ meta: [{ title: 'Openings · RepKnight' }] }),
  component: () => <Library track="openings" />,
})
