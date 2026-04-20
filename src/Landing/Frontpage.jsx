import Spline from "@splinetool/react-spline";
import Navbar from "../components/Navbar";
import About from "../Landing/About";
import Support from "../Landing/Support";
import Contact from "../Landing/Contact";

const Frontpage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* PAGE CONTAINER */}
      <div
        className="
          
          mx-4
          mb-4
          overflow-hidden
          bg-black
          dark:mx-4
          dark:mb-4
          dark:rounded-none
        "
      >
        <Navbar />

        {/* HERO */}
        <div>
          <section className=" relative min-h-[calc(99vh-60px)] ">
            <Spline
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="absolute inset-0 w-full h-full"
            />

            {/* CONTENT */}
            <div className="relative z-10 flex h-full pointer-events-none">
              <div className="flex-1 flex flex-col justify-center mt-40 md:px-10 text-white">
                <h1 className=" text-6xl font-bold">
                  Your Personal AI Assistant
                </h1>
                <p className="mt-4 text-gray-300 max-w-[400px]">
                  Chat, create, and explore smarter conversations powered by AI.
                </p>
              </div>
              <div className="flex-1" />
            </div>
          </section>
        </div>

        {/* ABOUT SECTION */}
        <section id="about">
          <About />
        </section>

        <section id="support" className="scroll-mt-24">
          <Support />
        </section>

        <section id="contact" className="scroll-mt-24">
          <Contact />
        </section>
      </div>
    </div>
  );
};

export default Frontpage;
