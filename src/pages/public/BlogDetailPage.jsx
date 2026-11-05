// frontend/src/pages/public/BlogDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://propertydeal-backend-w3yk.onrender.com/api';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlog = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs/${slug}`);
        setBlog(res.data);

        // Fetch recent blogs for sidebar / bottom
        const listRes = await axios.get(`${API_BASE_URL}/blogs`);
        const others = (listRes.data || []).filter((b) => b.slug !== slug).slice(0, 3);
        setRecentBlogs(others);
      } catch (err) {
        console.error('Failed to load blog:', err);
        setError('Article not found or has been unpublished.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
        <i className="fas fa-spinner fa-spin text-3xl text-[#005744] mb-3"></i>
        <p className="text-xs font-bold text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center font-sans">
        <div className="text-5xl mb-3">📖</div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 max-w-sm">{error || 'The requested article could not be loaded.'}</p>
        <Link
          to="/blogs"
          className="px-5 py-2.5 rounded-xl bg-[#005744] text-white text-xs font-bold hover:bg-[#004737] shadow-sm"
        >
          ← Back to All Articles
        </Link>
      </div>
    );
  }

  const readingTime = Math.max(2, Math.ceil((blog.content?.length || 200) / 600));

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-slate-900">Articles & Guides</Link>
          <span>/</span>
          <span className="text-[#005744] font-bold truncate max-w-[200px] sm:max-w-none">{blog.title}</span>
        </div>
      </div>

      <article className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#005744] text-xs font-extrabold uppercase tracking-wider">
            {blog.category || 'General'}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Recent'}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">{readingTime} min read</span>
          {blog.views > 0 && (
            <>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 font-mono">👁️ {blog.views} views</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          {blog.title}
        </h1>

        {/* Author & Share Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#005744] text-white flex items-center justify-center font-bold text-sm">
              {blog.author?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{blog.author || 'Property Adda Editorial'}</p>
              <p className="text-[11px] text-slate-400">Verified Real Estate Advisory</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold mr-1">Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} - ${window.location.href}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center text-xs transition-colors"
              title="Share on WhatsApp"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center text-xs transition-colors"
              title="Share on Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{copied ? '✓ Link Copied!' : '🔗 Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Featured Cover Image */}
        {blog.coverImage && (
          <div className="rounded-3xl overflow-hidden shadow-md bg-slate-100 max-h-[500px]">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Excerpt Lead */}
        {blog.excerpt && (
          <p className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed border-l-4 border-[#005744] pl-4 italic bg-emerald-50/40 py-2 rounded-r-xl">
            {blog.excerpt}
          </p>
        )}

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-5 text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
          {blog.content ? (
            blog.content.includes('<p>') ? (
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="prose prose-emerald max-w-none space-y-4"
              />
            ) : (
              blog.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 leading-relaxed">
                  {para}
                </p>
              ))
            )
          ) : (
            <p className="text-slate-500">No content provided.</p>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500">Related Topics:</span>
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#005744] to-[#004737] text-white p-8 sm:p-10 text-center space-y-4 shadow-lg my-8">
          <h3 className="text-xl sm:text-2xl font-black">Looking for Verified Properties in Your City?</h3>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
            Browse thousands of direct owner flats, plots, builder floors, and commercial shops across Jaipur, Delhi NCR, and top Indian metros.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-white text-[#005744] text-xs sm:text-sm font-extrabold hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              Explore Properties →
            </Link>
            <Link
              to="/post-property"
              className="px-6 py-3 rounded-xl bg-emerald-500/30 border border-emerald-400 text-white text-xs sm:text-sm font-extrabold hover:bg-emerald-500/40 transition-all cursor-pointer"
            >
              Post Free Listing
            </Link>
          </div>
        </div>

        {/* Related Recent Blogs */}
        {recentBlogs.length > 0 && (
          <div className="pt-8 space-y-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900">More Insights & Guides</h3>
              <Link to="/blogs" className="text-xs font-bold text-[#005744] hover:underline">
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentBlogs.map((rBlog) => (
                <Link
                  key={rBlog.id || rBlog._id}
                  to={`/blogs/${rBlog.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="h-32 bg-slate-100 rounded-xl overflow-hidden mb-2">
                      <img
                        src={rBlog.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80'}
                        alt={rBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase text-[#005744]">
                      {rBlog.category || 'Article'}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#005744] line-clamp-2">
                      {rBlog.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#005744] pt-3 flex items-center gap-1">
                    Read Story →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;
