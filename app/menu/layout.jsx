import Nav from "@/layout/Nav"

export const metadata = {
    title: "Menu"
}

export default function RootLayout({ children }) {
    return (
        <>
        <Nav />
        {children}
        </>
    )
  }