import Nav from "@/layout/Nav"
export const metadata = {
    title: "Account"
}

export default function RootLayout({ children }) {
    return (
        <>
        <Nav />
        {children}
        </>
    )
  }