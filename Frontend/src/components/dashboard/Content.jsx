import { useEffect, useState } from "react";


const Content = () => {
  const [trendingNews, setTrendingNews] = useState([]);

  // newsApi call
  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_NEWS_API);
        const data = await response.json();
        setTrendingNews(data.results || []);
      } catch (error) {
        console.error("Error fetching trending news:", error);
      }
    };
  
    fetchTrendingNews();
  }, []);

  return (
    <div className="w-full">
      {/* Records Section */}
      <div className="pt-20 px-4 lg:px-10 mb-10 min-h-[30vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">45</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md text-sm sm:font-medium">
              Number of Appointments
            </div>
          </div>

          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">12</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md  text-sm sm:font-medium">
              Approved Appointments
            </div>
          </div>

          <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
            <div className="text-4xl font-bold text-emerald-500 mb-4">8</div>
            <div className="bg-emerald-100 text-emerald-600 w-full text-center py-2 rounded-md text-sm sm:font-medium">
              Completed Appointments
            </div>
          </div>
        </div>
      </div>

      {/* Trending News Section */}
      <div className="pb-5 mt-20">
        <p className="px-4 pt-10 lg:px-10 pb-10 text-2xl font-bold text-gray-700">
          Trending News
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 lg:px-10">
          {trendingNews.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white border rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-full flex justify-center mb-4">
                <img
                  src={item.image_url}
                  className="w-full h-48 object-cover rounded-md"
                  alt="Trending News"
                />
              </div>
              <a
                href={item.link || "#"}
                className="text-sm text-gray-700 text-center mt-2 mb-2 hover:text-blue-600 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
