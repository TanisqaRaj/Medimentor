
const Home = () => {
  return (
    <>
      <div className="h-[100vh] w-[100vw] bg-white">
        {/* <nav className="w-[100vw] bg-sky-950 flex">
          <div className="relative py-0.3 mx-auto flex items-center justify-between space-x-10">
            <a href="/" className="cursor-pointer py-7 pr-7">
              <img src="/" alt="Logo" width="125px" height="30px" />
            </a>
            <ul className="flex space-x-7">
              {["Home", "Services", "About us", "Pharmacy","Contact"].map((text) => (
                <li
                  key={text}
                  className="text-white py-7 hover:text-yellow-300 cursor-pointer transition-all duration-200 relative group"
                >
                  <a href="#">{text}</a>
                  <div className="absolute bottom-0 w-full h-1 bg-blue-400 hidden group-hover:block transition-all duration-200"></div>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <button className="duration-300 px-5 py-3 text-white border rounded-full text-sm font-bold hover:text-blue-200">
                Login
              </button>
              <button className="px-5 py-3 text-sky-500 border rounded-full text-sm bg-white hover:text-blue-600 transition-all duration-200">
                Sign up
              </button>
            </div>
          </div>
        </nav> */}

        { /* =================== Hero Section=============*/}
        <>
          <section className="hero_section pt-[60px] 2xl:h-[800px]">
            <div className="container">
              <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between"></div>
              <div>
                <div className="lg:w-[570px]">
                  <h1 className=" text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]">
                    we help patient to live a healthy</h1>
                    <p className="text_para">lorem ipsum dolor sit amet</p>
                    <button className="btn">Request for appointment</button>
                </div>

                {/* ==============Hero counter==========*/}
                <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
                  <div>
                    <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                      30+
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      </div>
    </>
  );
};

export default Home;
