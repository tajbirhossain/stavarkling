import AccessAuthWall from '@/components/access/AccessAuthWall'
import { getAccessSession } from '@/lib/accessSession'

export default async function AccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAccessSession()

  if (!session) {
    return <AccessAuthWall />
  }

  return children
}
