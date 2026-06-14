import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Profile() {
  const [fullName, setFullName] =
    useState("");

  const [initials, setInitials] =
    useState("");

  const [fontFamily, setFontFamily] =
    useState("Dancing Script");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res =
        await API.get(
          "/signatures/profile"
        );

      const profile =
        res.data.profile;

      setFullName(
        profile.fullName
      );

      setInitials(
        profile.initials
      );

      setFontFamily(
        profile.fontFamily
      );
    } catch (error) {
      console.log(
        "No profile yet"
      );
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        fullName,
        initials,
        fontFamily,
      };

      try {
        await API.post(
          "/signatures/profile",
          payload
        );
      } catch {
        await API.put(
          "/signatures/profile",
          payload
        );
      }

      alert(
        "Profile saved successfully"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to save profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Signature Profile
      </h1>

      <div className="bg-white rounded-2xl shadow p-8 space-y-6">

        <div>
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Initials
          </label>

          <input
            type="text"
            value={initials}
            onChange={(e) =>
              setInitials(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Signature Font
          </label>

          <select
            value={fontFamily}
            onChange={(e) =>
              setFontFamily(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          >
            <option>
              Dancing Script
            </option>

            <option>
              Pacifico
            </option>

            <option>
              Great Vibes
            </option>

            <option>
              Satisfy
            </option>
          </select>
        </div>

        <div className="bg-slate-100 rounded-xl p-6">

          <p className="text-sm text-gray-500 mb-2">
            Signature Preview
          </p>

          <h2
            className="text-4xl"
            style={{
              fontFamily,
            }}
          >
            {fullName || "Your Signature"}
          </h2>

        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          {loading
            ? "Saving..."
            : "Save Profile"}
        </button>

      </div>

    </div>
  );
}