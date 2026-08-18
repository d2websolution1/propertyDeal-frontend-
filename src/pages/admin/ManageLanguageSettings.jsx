// pages/admin/ManageLanguageSettings.jsx
import React, { useState } from "react";

const ManageLanguageSettings = () => {
  const [languages, setLanguages] = useState([
    { code: "en", name: "English", active: true, default: true },
    { code: "hi", name: "Hindi", active: true, default: false },
    { code: "bn", name: "Bengali", active: false, default: false },
    { code: "ta", name: "Tamil", active: false, default: false },
    { code: "te", name: "Telugu", active: false, default: false },
    { code: "mr", name: "Marathi", active: false, default: false }
  ]);

  const toggleLanguage = (code) => {
    setLanguages(languages.map(lang => 
      lang.code === code ? {...lang, active: !lang.active} : lang
    ));
  };

  const setDefault = (code) => {
    setLanguages(languages.map(lang => 
      ({...lang, default: lang.code === code})
    ));
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Multi-Language Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage supported languages</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3">Language</th>
              <th className="text-left px-5 py-3">Code</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Default</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((lang) => (
              <tr key={lang.code} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-800">{lang.name}</td>
                <td className="px-5 py-3 text-gray-500">{lang.code}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    lang.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {lang.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {lang.default && (
                    <span className="text-xs font-bold text-[#6C3EE6]">Default</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toggleLanguage(lang.code)}
                    className={`text-sm font-medium px-3 py-1 rounded mr-2 ${
                      lang.active 
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {lang.active ? "Disable" : "Enable"}
                  </button>
                  {!lang.default && lang.active && (
                    <button
                      onClick={() => setDefault(lang.code)}
                      className="text-sm font-medium text-[#6C3EE6] hover:underline"
                    >
                      Set Default
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLanguageSettings;