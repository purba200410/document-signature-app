import { useState } from "react";
import API from "../../services/api";

export default function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("document", file);

      await API.post(
        "/docs/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Document uploaded successfully");

      setFile(null);
    } catch (error) {
      console.error(error);

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Upload Document
      </h1>

      <div className="bg-white rounded-2xl shadow p-8">

        <label
          htmlFor="pdf-upload"
          className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
        >
          <div className="text-center">

            <p className="text-xl font-semibold">
              Click to Choose PDF
            </p>

            <p className="text-gray-500 mt-2">
              or drag & drop file here
            </p>

            {file && (
              <p className="mt-4 text-green-600 font-medium">
                Selected: {file.name}
              </p>
            )}

          </div>
        </label>

        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading
            ? "Uploading..."
            : "Upload File"}
        </button>

      </div>
    </div>
  );
}