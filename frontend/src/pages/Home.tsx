import Navbar from "../components/navbar.tsx"
import Footer from "../components/footer.tsx"
import Hero from "@/components/hero.tsx"
import { DotPattern } from "@/components/ui/dot-pattern"

const Home = () => {
  return (
    <div>
        {/* <div className="relative h-[100px] w-full overflow-hidden">
            <DotPattern />
        </div> */}
      <Navbar />
      <Hero/>
      <Footer/>
    </div>
  )
}

export default Home