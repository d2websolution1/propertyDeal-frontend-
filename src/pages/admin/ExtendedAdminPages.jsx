import React, { useEffect, useMemo, useState } from "react";
import AdminPageShell from "./AdminPageShell";

const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};

const emptyForm = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.key]: field.defaultValue ?? "" }), {});

const GenericListPage = ({
  title,
  subtitle,
  storageKey,
  initialItems,
  fields,
  emptyMessage,
  extraActions,
}) => {
  const [items, setItems] = useLocalStorageState(storageKey, initialItems);
  const [form, setForm] = useState(emptyForm(fields));
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(emptyForm(fields));
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title && !form.name && !form.planName && !form.subject && !form.message) {
      return;
    }

    if (editingId) {
      setItems((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
    } else {
      setItems((prev) => [{ id: Date.now().toString(), ...form }, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  const handleToggle = (id, statusKey = "status") => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const current = item[statusKey] || "Active";
        const next = current === "Active" ? "Paused" : "Active";
        return { ...item, [statusKey]: next };
      })
    );
  };

  return (
    <AdminPageShell
      title={title}
      subtitle={subtitle}
      actions={
        <button
          onClick={resetForm}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset Form
        </button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{editingId ? "Edit item" : "Create item"}</h2>
            <span className="text-xs uppercase tracking-wide text-slate-400">{storageKey}</span>
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1 block text-sm font-medium text-slate-600">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    rows={field.rows || 4}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={form[field.key] ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#6C3EE6]"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" className="rounded-lg bg-[#6C3EE6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5b34c9]">
              {editingId ? "Save changes" : "Add item"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {emptyMessage}
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    {item.title || item.name || item.planName || item.subject ? (
                      <h3 className="truncate text-base font-semibold text-slate-900">
                        {item.title || item.name || item.planName || item.subject}
                      </h3>
                    ) : null}
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      {fields.slice(0, 3).map((field) => {
                        const value = item[field.key];
                        if (!value) return null;
                        return (
                          <p key={field.key} className="truncate">
                            <span className="font-medium text-slate-500">{field.label}:</span> {value}
                          </p>
                        );
                      })}
                      {extraActions ? extraActions(item) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === "Active" || item.status === "Published" || item.status === "Enabled" || item.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                      {item.status || "Draft"}
                    </span>
                    {item.enabled !== undefined && (
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                        {item.enabled ? "Enabled" : "Disabled"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => handleEdit(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                  <button onClick={() => handleToggle(item.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Toggle Status
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageShell>
  );
};

export const AdvertisementsPage = () => (
  <GenericListPage
    title="Advertisements"
    subtitle="Create, schedule, and manage promotional banners and campaigns"
    storageKey="admin-advertisements"
    initialItems={[
      { id: "ad-1", title: "Homepage Hero Ad", placement: "Homepage", status: "Active", budget: "₹50k", link: "https://example.com" },
    ]}
    fields={[
      { key: "title", label: "Title" },
      { key: "placement", label: "Placement" },
      { key: "budget", label: "Budget" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Paused", "Scheduled"] },
      { key: "link", label: "Link" },
    ]}
    emptyMessage="No ads yet — create your first campaign."
  />
);

export const CmsPagesPage = () => (
  <GenericListPage
    title="CMS Pages"
    subtitle="Manage custom content pages for your website"
    storageKey="admin-cms-pages"
    initialItems={[
      { id: "cms-1", title: "About Us", slug: "about-us", status: "Published", content: "Your full company story and mission." },
    ]}
    fields={[
      { key: "title", label: "Page Title" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Archived"] },
      { key: "content", label: "Content", type: "textarea" },
    ]}
    emptyMessage="No CMS pages yet — create an important marketing page."
  />
);

export const BlogManagementPage = () => (
  <GenericListPage
    title="Blog Management"
    subtitle="Publish timely articles and property news"
    storageKey="admin-blogs"
    initialItems={[
      { id: "blog-1", title: "Why luxury homes are booming in 2026", category: "Market Trends", author: "Admin", status: "Published" },
    ]}
    fields={[
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "author", label: "Author" },
      { key: "status", label: "Status", type: "select", options: ["Published", "Draft", "Scheduled"] },
    ]}
    emptyMessage="No blogs yet — publish your first article."
  />
);

export const SeoSettingsPage = () => (
  <GenericListPage
    title="SEO Settings"
    subtitle="Set metadata and keywords for your key pages"
    storageKey="admin-seo"
    initialItems={[
      { id: "seo-1", title: "Homepage", metaTitle: "Luxury Homes in Mumbai", metaDescription: "Discover premium homes and commercial spaces", keywords: "real estate, homes, property" },
    ]}
    fields={[
      { key: "title", label: "Page Name" },
      { key: "metaTitle", label: "Meta Title" },
      { key: "metaDescription", label: "Meta Description" },
      { key: "keywords", label: "Keywords" },
    ]}
    emptyMessage="No SEO entries yet — add metadata for better visibility."
  />
);

export const EmailTemplatesPage = () => (
  <GenericListPage
    title="Email Templates"
    subtitle="Create reusable email templates for leads and clients"
    storageKey="admin-email-templates"
    initialItems={[
      { id: "email-1", name: "Welcome Email", subject: "Welcome to Housing", status: "Active", body: "Hi {{name}}, thanks for joining our platform." },
    ]}
    fields={[
      { key: "name", label: "Template Name" },
      { key: "subject", label: "Subject" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
      { key: "body", label: "Body", type: "textarea" },
    ]}
    emptyMessage="No email templates yet — create your first one."
  />
);

export const PopUpBannersPage = () => (
  <GenericListPage
    title="Pop-up Banners"
    subtitle="Create and manage announcement banners"
    storageKey="admin-banners"
    initialItems={[
      { id: "banner-1", title: "Diwali Offer", message: "Get free consultation this week", status: "Active", link: "#" },
    ]}
    fields={[
      { key: "title", label: "Banner Title" },
      { key: "message", label: "Message" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Paused"] },
      { key: "link", label: "Link" },
    ]}
    emptyMessage="No pop-up banners yet — promote your latest deal."
  />
);

export const BulkMessagingPage = () => (
  <GenericListPage
    title="Bulk WhatsApp / SMS / Email"
    subtitle="Send campaign messages to your audience"
    storageKey="admin-bulk-messaging"
    initialItems={[
      { id: "bulk-1", title: "New Launch Campaign", audience: "Leads", channel: "WhatsApp", message: "New launch is now live", status: "Scheduled" },
    ]}
    fields={[
      { key: "title", label: "Campaign Name" },
      { key: "audience", label: "Audience" },
      { key: "channel", label: "Channel" },
      { key: "status", label: "Status", type: "select", options: ["Scheduled", "Draft", "Sent"] },
      { key: "message", label: "Message", type: "textarea" },
    ]}
    emptyMessage="No messaging campaigns yet — launch your first outreach."
  />
);

export const FeaturedListingsPage = () => (
  <GenericListPage
    title="Featured Listings"
    subtitle="Highlight premium properties for more exposure"
    storageKey="admin-featured-listings"
    initialItems={[
      { id: "featured-1", title: "Sea View Villa", owner: "Aarav", status: "Approved", price: "₹2.4 Cr" },
    ]}
    fields={[
      { key: "title", label: "Listing Name" },
      { key: "owner", label: "Owner" },
      { key: "price", label: "Price" },
      { key: "status", label: "Status", type: "select", options: ["Approved", "Pending", "Removed"] },
    ]}
    emptyMessage="No featured listings yet — add your top properties."
  />
);

export const VerifiedPropertyTagsPage = () => (
  <GenericListPage
    title="Verified Property Tags"
    subtitle="Assign trusted tags to verified properties"
    storageKey="admin-verified-tags"
    initialItems={[
      { id: "tag-1", title: "Verified Builder", description: "Trusted developer listing", status: "Active" },
    ]}
    fields={[
      { key: "title", label: "Tag Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
    ]}
    emptyMessage="No verified tags yet — build trust for your listings."
  />
);

export const EnquiriesPage = () => (
  <GenericListPage
    title="Enquiries"
    subtitle="Track interest from buyers, sellers, and renters"
    storageKey="admin-enquiries"
    initialItems={[
      { id: "enquiry-1", title: "Interested in a premium flat", name: "Riya", email: "riya@example.com", status: "New", message: "Looking for a 3BHK in Andheri." },
    ]}
    fields={[
      { key: "title", label: "Subject" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status", type: "select", options: ["New", "Follow-up", "Closed"] },
      { key: "message", label: "Message", type: "textarea" },
    ]}
    emptyMessage="No enquiries yet — your inbox is clear."
  />
);

export const PaymentsPage = () => (
  <GenericListPage
    title="Payments"
    subtitle="Monitor transaction history and payment states"
    storageKey="admin-payments"
    initialItems={[
      { id: "payment-1", title: "Order #1001", customer: "Sahil", amount: "₹14,500", status: "Completed" },
    ]}
    fields={[
      { key: "title", label: "Order ID" },
      { key: "customer", label: "Customer" },
      { key: "amount", label: "Amount" },
      { key: "status", label: "Status", type: "select", options: ["Completed", "Pending", "Failed"] },
    ]}
    emptyMessage="No payment records yet — transactions will appear here."
  />
);

export const SubscriptionsPage = () => (
  <GenericListPage
    title="Subscription Plans"
    subtitle="Offer, manage, and review subscription packages"
    storageKey="admin-subscriptions"
    initialItems={[
      { id: "sub-1", planName: "Pro", price: "₹999/mo", duration: "Monthly", status: "Active" },
    ]}
    fields={[
      { key: "planName", label: "Plan Name" },
      { key: "price", label: "Price" },
      { key: "duration", label: "Duration" },
      { key: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
    ]}
    emptyMessage="No subscriptions yet — create your first plan."
  />
);

export const ReportsPage = () => {
  const [properties] = useLocalStorageState("admin-properties", []);
  const [payments] = useLocalStorageState("admin-payments", []);
  const [enquiries] = useLocalStorageState("admin-enquiries", []);

  const summary = useMemo(() => ({
    listings: properties.length,
    payments: payments.length,
    enquiries: enquiries.length,
    conversion: payments.length ? Math.round((payments.filter((p) => p.status === "Completed").length / payments.length) * 100) : 0,
  }), [enquiries.length, payments, properties.length]);

  return (
    <AdminPageShell title="Reports & Analytics" subtitle="Track the strength of your listings and campaigns">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Listings", value: summary.listings },
          { label: "Payments", value: summary.payments },
          { label: "Enquiries", value: summary.enquiries },
          { label: "Conversion", value: `${summary.conversion}%` },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Performance snapshot</h2>
        <p className="mt-2 text-sm text-slate-500">Your dashboard is ready to track growth across all listing and customer engagement activities.</p>
      </div>
    </AdminPageShell>
  );
};

export const ListingsReportPage = () => (
  <AdminPageShell title="New Listing Report" subtitle="See the latest property listings added to the platform">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"> 
      <p className="text-sm text-slate-500">This report is ready for your real backend data. Currently it shows the latest local content entries added through the admin experience.</p>
    </div>
  </AdminPageShell>
);

export const UsersReportPage = () => (
  <AdminPageShell title="New User & Vendor Report" subtitle="Monitor user and vendor activity from one place">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">This report is ready for real user growth metrics and vendor onboarding analytics.</p>
    </div>
  </AdminPageShell>
);

export const GeneralSettingsPage = () => {
  const [settings, setSettings] = useLocalStorageState("admin-general-settings", {
    siteName: "Housing",
    supportEmail: "support@housing.com",
    maintenanceMode: false,
  });

  return (
    <AdminPageShell title="General Settings" subtitle="Set the core configuration for your website">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Site name</label>
              <input value={settings.siteName} onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">Support email</label>
              <input value={settings.supportEmail} onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-600">
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings((prev) => ({ ...prev, maintenanceMode: e.target.checked }))} />
              Enable maintenance mode
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Settings preview</h2>
          <p className="mt-2 text-sm text-slate-500">Site name: {settings.siteName}</p>
          <p className="mt-1 text-sm text-slate-500">Support email: {settings.supportEmail}</p>
          <p className="mt-1 text-sm text-slate-500">Maintenance mode: {settings.maintenanceMode ? "On" : "Off"}</p>
        </div>
      </div>
    </AdminPageShell>
  );
};

export const LanguageSettingsPage = () => {
  const [languages, setLanguages] = useLocalStorageState("admin-languages", [
    { id: 1, name: "English", code: "en", enabled: true },
    { id: 2, name: "Hindi", code: "hi", enabled: true },
  ]);

  return (
    <AdminPageShell title="Multi-language" subtitle="Enable language variants for your audience">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {languages.map((language) => (
            <label key={language.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-600">
              <span>
                {language.name} ({language.code})
              </span>
              <input type="checkbox" checked={language.enabled} onChange={() => setLanguages((prev) => prev.map((item) => item.id === language.id ? { ...item, enabled: !item.enabled } : item))} />
            </label>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
};

export const SecuritySettingsPage = () => {
  const [settings, setSettings] = useLocalStorageState("admin-security-settings", {
    twoFactor: true,
    passwordExpiry: "90 days",
    ssl: true,
  });

  return (
    <AdminPageShell title="Security & SSL" subtitle="Protect your platform and customer trust">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm text-slate-600">
            <span>Two-factor authentication</span>
            <input type="checkbox" checked={settings.twoFactor} onChange={(e) => setSettings((prev) => ({ ...prev, twoFactor: e.target.checked }))} />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-600">
            <span>SSL enabled</span>
            <input type="checkbox" checked={settings.ssl} onChange={(e) => setSettings((prev) => ({ ...prev, ssl: e.target.checked }))} />
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Password expiry</label>
            <input value={settings.passwordExpiry} onChange={(e) => setSettings((prev) => ({ ...prev, passwordExpiry: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
};

export const SessionsPage = () => {
  const [sessions] = useLocalStorageState("admin-sessions", [
    { id: 1, device: "Windows Desktop", location: "Mumbai", lastSeen: "2 mins ago" },
    { id: 2, device: "iPhone", location: "Delhi", lastSeen: "1 hour ago" },
  ]);

  return (
    <AdminPageShell title="Log Out All Devices" subtitle="Review active sessions and sign out if needed">
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{session.device}</p>
                <p className="text-sm text-slate-500">{session.location}</p>
              </div>
              <span className="text-sm text-slate-500">{session.lastSeen}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminPageShell>
  );
};
export default ExtendedAdminPages;
