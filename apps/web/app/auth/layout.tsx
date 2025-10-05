import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${poppins.style}`}>
        <main className="w-full h-svh bg-[#F27D31] text-2xl text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
