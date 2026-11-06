import { createFileRoute } from '@tanstack/react-router'
import { Library } from '@/components/chess/Library'

export const Route = createFileRoute('/endgames')({
  head: () => ({ meta: [{ title: 'Endgames · RepKnight' }] }),
  component: () => <Library track="endgames" />,
})
