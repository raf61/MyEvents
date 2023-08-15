import Nav from "@/layout/Nav"

export const metadata = {
    title: "Login"
}

export default function RootLayout({ children }) {
    return (
        <>
        <Nav />
        {children}
        </>
    )
  }