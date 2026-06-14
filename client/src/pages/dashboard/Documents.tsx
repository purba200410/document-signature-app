import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function Documents() {
  const [documents, setDocuments] =
    useState<Document[]>([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res =
        await API.get("/docs");

      setDocuments(
        res.data.documents
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="text-xl">
        Loading...
      </h2>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        My Documents
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>
              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Created
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {documents.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center"
                >
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t hover:bg-slate-50"
                >
                  <td className="p-4">
                    {doc.title}
                  </td>

                  <td className="p-4">
                    {doc.status}
                  </td>

                  <td className="p-4">
                    {new Date(
                      doc.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/documents/${doc.id}`
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}