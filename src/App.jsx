
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/navbar";
import Banner from "./components/page/user/home/banner";
import HerbSection from "./components/page/user/home/herbsection";
import NewsSection from "./components/page/user/home/newssection";
import ResearchSection from "./components/page/user/home/research-section";

const App = () => {
  return(
    <div className="w-screen flex flex-col items-center gap-10 overflow-y-auto">
      <Navbar/>
      <Banner/>
      <HerbSection/>
      <NewsSection/>
      <ResearchSection/>
      <Footer/>
    </div>
  )
}
export default App;