// CommercialNewsAndArticles.jsx
import React from "react";

const CommercialNewsAndArticles = () => {
  const articles = [
    {
      id: 1,
      title: "Mhada Lottery 2025: Registration, application, lottery dates",
      excerpt:
        "In this guide, we will focus on how to apply for Mhada lottery units offered by the different Mhada Boards, check the draft, final list and lucky draw and finally…",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 2,
      title: "How are emerging micro markets shaping Mumbai's next set of luxury pincodes?",
      excerpt:
        "Mumbai's next luxury pin codes are not waiting to be discovered. They are in the process of becoming.",
      image:
        "https://images.unsplash.com/photo-1595655402605-58678db81b62?w=700&h=500&fit=crop&auto=format",
    },
    {
      id: 3,
      title: "From connectivity to capital appreciation: How is infrastructure transforming…",
      excerpt:
        "Luxury housing is no longer confined to a narrow set of traditional addresses. It is spreading across infrastructure-led corridors.",
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=700&h=500&fit=crop&auto=format",
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl text-[#0b1a2e]">
          News &amp; <span className="font-bold">Articles</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">Read what's happening in Real Estate</p>
      </div>

      {/* Cards */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id}>
              {/* Image */}
              <div className="h-[180px] w-full rounded-lg overflow-hidden mb-3">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="text-[#0b1a2e] font-bold text-base leading-snug mb-2">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-500 text-sm leading-snug line-clamp-3">
                {article.excerpt}
              </p>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className="hidden md:flex absolute top-[85px] right-0 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-[#0b1a2e] items-center justify-center transition-shadow z-10"
          aria-label="See more articles"
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
};

export default CommercialNewsAndArticles;