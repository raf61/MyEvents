import Nav from "@/layout/Nav"
export default function RootLayout({ children }) {
    return (
        <>
        <Nav />
        {children}
        </>
    )
  }