import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data } = useSession()

  const bottomLinks = [
    {
      name: 'Products ->',
      href: '/products?ignoreCache=true',
      text: 'Peruse and browse your products listings.'
    },
    {
      name: 'Orders ->',
      href: '/orders?ignoreCache=true',
      text: 'Browse and search through your order history.'
    },
    {
      name: 'Inventory ->',
      href: '/inventory?ignoreCache=true',
      text: 'Discover and browse current shop inventory.'
    }
  ]
  return (
    <>
      <Head>
        <title>Comment Sold Interview</title>
        <meta name="description" content="For Isaiah Griego's Interview" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center p-24 min-h-screen">
        <div className="font-normal max-w-[1100px] w-[100%] z-20 font-mono flex flex-row justify-between">
          {data?.user && (
            <div className="mt-auto mb-auto">
              <div className="font-semibold font-mono">{data?.user?.name}</div>
            </div>
          )}
          <Link href={`/api/auth/${data?.user ? 'signout' : 'signin'}`}>
            <div className="py-4 px-5 rounded-xl border border-transparent hover:border-solid  hover:border-neutral-700 transition-all cursor-pointer">
              {data?.user ? 'Logout' : 'Login'}
            </div>
          </Link>
        </div>

        <div className="bg-black">
          <div style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '5em' }}>Portal</div>
        </div>

        <div className=" grid grid-cols-2 mb-36 max-w-7xl">
          {bottomLinks.map(bottom => (
            <Link
              key={bottom.href}
              href={bottom.href}
              className="py-4 px-4 rounded-xl border border-transparent hover:border-neutral-700 transition-all ease-in-out delay-100">
              <h2 className="mb-1">{bottom.name}</h2>
              <p className="my-2">{bottom.text}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
