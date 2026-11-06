import { createFileRoute } from '@tanstack/react-router'
import { Library } from '@/components/chess/Library'

export const Route = createFileRoute('/advanced')({
  head: () => ({ meta: [{ title: 'Advanced · RepKnight' }] }),
  component: () => <Library track="advanced" />,
})
