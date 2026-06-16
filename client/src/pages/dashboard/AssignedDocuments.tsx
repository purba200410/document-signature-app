import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AssignedDocuments() {
  const [documents, setDocuments] =
    useState<any[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await API.get(
        "/docs/assigned"
      );

      setDocuments(res.data.documents);
    } catch (error) {
      console.error(error);
    }
  };
const completeAction = async (
  documentId: string
) => {
  try {
    await API.post(
      `/docs/${documentId}/complete`
    );

    alert("Action completed");

    loadDocuments();
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      "Failed"
    );
  }
};
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Assigned Documents
      </h1>

      {documents.length === 0 ? (
        <p>
          No assigned documents.
        </p>
      ) : (
        <div className="space-y-4">
          {documents.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="font-bold text-lg">
                {item.document.title}
              </h2>

              <p>
                Role: {item.role}
              </p>

              <p>
                Status: {item.status}
              </p>

             <button
  onClick={() => completeAction(item.document.id)}
  className="inline-block mt-3 bg-green-600 text-white px-4 py-2 rounded"
>
  Complete Action
</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}