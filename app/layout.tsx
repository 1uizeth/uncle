import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Uncle',
  description: 'A community-first lending protocol that gives excluded borrowers a path back into the financial system.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
