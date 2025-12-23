import Navbar from "../components/navbar.tsx"
import Footer from "../components/footer.tsx"
import Hero from "@/components/hero.tsx"

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <Footer/>
    </div>
  )
}

export default Home