import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "../api/user";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center text-xl font-light text-neutral-400 border border-neutral-100">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <h2 className="mt-6 text-lg font-light">{user.first_name} {user.last_name}</h2>
            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mt-1">{user.email}</p>

            <div className="mt-10 w-full flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-3 text-[10px] tracking-[0.2em] uppercase border border-neutral-200 hover:border-black transition-colors"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              {user.role === "seller" && (
                <Link to="/seller/dashboard" className="w-full py-3 text-[10px] tracking-[0.2em] uppercase border border-neutral-200 hover:border-black transition-colors text-center">
                  Dashboard
                </Link>
              )}
              <button onClick={() => { logout(); navigate("/"); }} className="py-3 text-[10px] tracking-[0.2em] uppercase text-neutral-400 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-8">
          <h1 className="text-2xl font-light uppercase tracking-[0.1em] mb-12">Account Settings</h1>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                <Input label="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                <Input label="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <div className="border-b border-neutral-100 pb-2">
                  <label className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 block mb-2">Email</label>
                  <span className="text-sm text-neutral-400">{user.email}</span>
                </div>
              </div>
              <button disabled={saving} className="bg-black text-white px-12 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-neutral-800 transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              <Info label="First Name" value={user.first_name} />
              <Info label="Last Name" value={user.last_name} />
              <Info label="Email" value={user.email} />
              <Info label="Phone" value={user.phone || "Not provided"} />
              <Info label="Role" value={user.role} />
              <Info label="Verified" value={user.is_email_verified ? "Yes" : "No"} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const Info = ({ label, value }) => (
  <div className="border-b border-neutral-100 pb-4">
    <p className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 mb-2">{label}</p>
    <p className="text-sm font-light text-neutral-700">{value}</p>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div className="border-b border-neutral-200">
    <label className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 block mb-2">{label}</label>
    <input
      value={value}
      onChange={onChange}
      className="w-full py-2 outline-none text-sm font-light text-neutral-700 placeholder-neutral-300"
    />
  </div>
);

export default Profile;