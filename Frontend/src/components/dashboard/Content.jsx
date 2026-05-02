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
    <div className="w-full flex-grow mx-auto max-w-[1280px] p-6 lg:p-8 font-manrope">
      {/* Records Section */}
      <div className="mb-12">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-label-md text-on-surface-variant mb-2">Total Appointments</div>
            <div className="text-4xl font-headline-lg font-bold text-emerald-700">45</div>
            <div className="mt-4 w-full bg-primary-container/10 text-primary-container text-center py-2 rounded-lg font-label-md text-xs">
              +12% this month
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-label-md text-on-surface-variant mb-2">Approved Appointments</div>
            <div className="text-4xl font-headline-lg font-bold text-emerald-700">12</div>
            <div className="mt-4 w-full bg-primary-container/10 text-primary-container text-center py-2 rounded-lg font-label-md text-xs">
              Action Required
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-label-md text-on-surface-variant mb-2">Completed</div>
            <div className="text-4xl font-headline-lg font-bold text-emerald-700">8</div>
            <div className="mt-4 w-full bg-surface-variant text-on-surface-variant text-center py-2 rounded-lg font-label-md text-xs">
              Last 7 days
            </div>
          </div>
        </div>
      </div>

      {/* Trending News Section */}
      <div className="pb-10">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
          Trending Health News
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingNews.length > 0 ? trendingNews.map((item, index) => (
            <a
              key={index}
              href={item.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-full h-40 overflow-hidden relative">
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Trending News"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="font-label-md text-sm text-on-surface font-semibold line-clamp-3 group-hover:text-primary-container transition-colors">
                  {item.title}
                </h3>
                <span className="text-caption text-outline mt-3 text-xs">Read full article &rarr;</span>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-10 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-outline-variant/30">
               <span className="material-symbols-outlined text-4xl text-outline mb-2">article</span>
               <p className="text-on-surface-variant font-body-md">Loading trending news...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
