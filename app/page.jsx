import Container from "../layout/Container";
import {SiEventstore} from 'react-icons/si'
import GetStartedButton from "../components/GetStartedButton";
import Nav from '@/layout/Nav'
import FeaturedEvents from "./FeaturedEvents";
export default async function Home(){

  return (
    <>
    <Nav hideLogo={true} />
    <main className="p-7 mb-20">
      <Container>
        <h1 className="flex items-center justify-center gap-3 text-6xl pt-10 font-bold text-center">
          <span><SiEventstore /></span>
          <span className="text-5xl sm:text-6xl">MyEvents</span>
        </h1>
        <h2 className="text-3xl text-center pt-10 sm:text-4xl">Simplify Your Event Management.</h2>
        <h2 className="text-center text-gray-700 text-lg mt-3 sm:text-xl pt-1 max-w-[43rem] mx-auto">MyEvents provides you the tools you need to create memorable experiences.</h2>
        <div className="flex justify-center pt-10">
          <GetStartedButton />
        </div>
      </Container>
      <div className="flex justify-center">
        <FeaturedEvents />
      </div>
    </main>
    </>
  )
}