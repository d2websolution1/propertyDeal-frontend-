import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "General",
  author: "Admin",
  status: "draft",
};

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "create" });
  };

  const openEdit = (blog) => {
    setForm({
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content,
      coverImage: blog.coverImage || "",
      category: blog.category || "General",
      author: blog.author || "Admin",
      status: blog.status,
    });
    setModal({ mode: "edit", data: blog });
  };

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title aur content dono zaroori hain");
      return;
    }
    try {
      if (modal.mode === "create") {
        await api.post("/admin/blogs", form);
      } else {
        await api.put(`/admin/blogs/${modal.data.id}`, form);
      }
      setModal(null);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const togglePublish = async (blog) => {
    try {
      await api.put(`/admin/blogs/${blog.id}`, {
        status: blog.status === "published" ? "draft" : "published",
      });
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const remove = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;
    try {
      await api.delete(`/admin/blogs/${blog.id}`);
      fetchBlogs();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create and manage blog posts</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
        >
          <i className="fas fa-plus mr-1.5"></i>
          New Post
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
          Abhi tak koi blog post nahi hai — pehla post banayein.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Views</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-gray-800">{blog.title}</td>
                  <td className="px-5 py-3 text-gray-500">{blog.category}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePublish(blog)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        blog.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{blog.views}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openEdit(blog)}
                      className="text-gray-500 hover:text-[#6C3EE6] mr-3"
                    >
                      <i className="fas fa-pen text-xs"></i>
                    </button>
                    <button
                      onClick={() => remove(blog)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[560px] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-4">
              {modal.mode === "create" ? "New Blog Post" : "Edit Blog Post"}
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Excerpt</label>
                <input
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cover Image URL</label>
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 bg-[#6C3EE6] hover:bg-[#5b34c9] text-white text-sm font-semibold py-2.5 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;