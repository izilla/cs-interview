import { useSession } from 'next-auth/react'
import Link from 'next/link'

type UserHeaderProps = {
  route: string | string[]
}

export const UserHeader = ({ route }: UserHeaderProps) => {
  const { data } = useSession()
  return (
    <div>
      <Link href={'/'}>{data?.user?.name}</Link> / {typeof route === 'string' ? route : route.join(' / ')}
    </div>
  )
}

export default UserHeader
