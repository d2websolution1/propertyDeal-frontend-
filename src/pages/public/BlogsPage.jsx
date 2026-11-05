// frontend/src/pages/public/BlogsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const CATEGORIES = [
  'All',
  'Buying Guide',
  'Market Trends',
  'Legal & Finance',
  'Investment',
  'Home Decor',
  'General',
];

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`);
        setBlogs(res.data || []);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchCat =
        selectedCategory === 'All' ||
        (blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchSearch =
        !searchQuery ||
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  // Featured blog: first published blog
  const featuredBlog = filteredBlogs[0];
  const restBlogs = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* Hero Banner Header */}
      <section className="bg-gradient-to-r from-[#005744] via-[#004737] to-[#0f172a] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest mb-3 border border-emerald-400/30">
            Property Adda Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
            Real Estate Insights, Guides & Market Trends
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto mb-8">
            Stay informed with verified property advice, legal documentation checklists, home loan guidance, and city investment forecasts.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-1.5 flex items-center gap-2 border border-slate-200">
            <span className="pl-3 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              placeholder="Search guides, RERA tips, investment trends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2 py-2.5 text-xs sm:text-sm text-slate-900 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
              >
                Clear
              </button>
            )}
            <button className="px-5 py-2.5 rounded-xl bg-[#005744] text-white text-xs sm:text-sm font-bold hover:bg-[#004737] transition-colors cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 overflow-x-auto custom-scrollbar flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#005744] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10">
        {loading ? (
          <div className="py-24 text-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-3xl text-[#005744] mb-3 block"></i>
            <p className="text-sm font-bold text-slate-700">Loading latest published articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center max-w-lg mx-auto p-8 shadow-xs">
            <div className="text-4xl mb-3">📰</div>
            <h3 className="text-base font-bold text-slate-800">No articles found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `No articles match "${searchQuery}". Try a different keyword.`
                : 'Articles will appear here once added and published from the admin panel.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Blog Highlight */}
            {featuredBlog && !searchQuery && selectedCategory === 'All' && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-100">
                  <img
                    src={
                      featuredBlog.coverImage ||
                      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#005744] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    ⭐ Featured Article
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                      <span className="text-[#005744] font-bold uppercase">{featuredBlog.category || 'Guide'}</span>
                      <span>•</span>
                      <span>
                        {featuredBlog.publishedAt
                          ? new Date(featuredBlog.publishedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>

                    <Link to={`/blogs/${featuredBlog.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#005744] transition-colors leading-snug">
                        {featuredBlog.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {featuredBlog.excerpt ||
                        featuredBlog.content?.replace(/<[^>]+>/g, '').slice(0, 160) + '...'}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      By {featuredBlog.author || 'Property Adda Editorial'}
                    </span>
                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#005744] hover:underline"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || selectedCategory !== 'All' ? filteredBlogs : restBlogs).map((blog) => {
                const blogId = blog.id || blog._id;
                const readingTime = Math.max(2, Math.ceil((blog.content?.length || 200) / 600));

                return (
                  <article
                    key={blogId}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Cover Image */}
                      <Link to={`/blogs/${blog.slug}`} className="block h-48 bg-slate-100 relative overflow-hidden">
                        <img
                          src={
                            blog.coverImage ||
                            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-slate-200">
                          {blog.category || 'General'}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                          <span>
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                          <span>•</span>
                          <span>{readingTime} min read</span>
                        </div>

                        <Link to={`/blogs/${blog.slug}`}>
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#005744] transition-colors line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {blog.excerpt ||
                            blog.content?.replace(/<[^>]+>/g, '').slice(0, 110) + '...'}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                        {blog.author || 'Property Adda'}
                      </span>
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="font-bold text-[#005744] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Read More</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogsPage;

