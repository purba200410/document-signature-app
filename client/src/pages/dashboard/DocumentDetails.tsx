import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";


interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  signedFileUrl?: string;
}

interface Participant {
  id: string;
  email?: string;
  role: string;
  status: string;
  user: {
    id?: string;
    name: string;
    email: string;
  } | null;
}

interface AuditLog {
  id: string;
  action: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function DocumentDetails() {
  
  const { id } = useParams();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("SIGNER");

  const [document, setDocument] = useState<Document | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [setCurrentUser] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [setMyParticipant] = useState<any>(null);


  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [docRes, participantRes, auditRes, profileRes] =
      await Promise.all([
    API.get(`/docs/${id}`),
    API.get(`/docs/${id}/participants`),
    API.get(`/docs/${id}/audit`),
    API.get("/auth/profile"),
  ]);

      setDocument(docRes.data.document);
      setParticipants(participantRes.data.participants);
      setLogs(auditRes.data.logs);
      const user = profileRes.data.user;

setCurrentUser(user);

const participant =
  participantRes.data.participants.find(
    (p: any) => p.user?.id === user.userId
  ) || null;

setMyParticipant(participant);

if (
  docRes.data.document.ownerId ===
  user.userId
) {
  setIsOwner(true);
}
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async () => {
    try {
      await API.post(`/docs/${id}/participants`, {
        email,
        role,
      });

      alert("Participant added successfully");
      setEmail("");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add participant");
    }
  };
  const deleteParticipant = async (
  participantId: string
) => {
  const confirmed = window.confirm(
    "Remove this participant?"
  );

  if (!confirmed) return;

  try {
    await API.delete(
      `/docs/participants/${participantId}`
    );

    alert("Participant removed");

    loadData();
  } catch (error) {
    console.error(error);
    alert("Failed to remove participant");
  }
};

  const handleDownload = async () => {
  try {
    const response = await API.get(
      `/docs/${id}/download`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = window.document.createElement("a");

    link.href = url;
    link.download = `${document?.title}.pdf`;

    window.document.body.appendChild(link);

    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Download failed");
  }
};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="space-y-8">
      {/* Document Info */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">{document?.title}</h1>

        <p className="mt-2">
          Status:
          <span className="ml-2 font-semibold">{document?.status}</span>
        </p>

        <p className="text-gray-500 mt-2">
          Created:{" "}
          {document?.createdAt &&
            new Date(document.createdAt).toLocaleString()}
        </p>

        {document?.status === "COMPLETED" && (
          <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Signed PDF
          </button>
        )}
      </div>

      {/* Add Participant */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Add Participant</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Participant Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="SIGNER">SIGNER</option>
            <option value="WITNESS">WITNESS</option>
            <option value="AUTHENTICATOR">AUTHENTICATOR</option>
          </select>

          <button
            onClick={addParticipant}
            className="bg-blue-600 text-white rounded px-4"
          >
            Add Participant
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Participants</h2>

        {participants.length === 0 ? (
          <p>No participants added yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>

            <tbody>
  {participants.map((p) => (
    <tr key={p.id} className="border-t">
      <td className="p-2">
        {p.user?.name || "Not Registered"}
      </td>

      <td className="p-2">
        {p.user?.email || p.email || "No Email"}
      </td>

      <td className="p-2">{p.role}</td>

      <td className="p-2">{p.status}</td>
      <td className="p-2">
        {isOwner && (
        <button
          onClick={() => deleteParticipant(p.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>

      {/* Audit Logs */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>

        {logs.length === 0 ? (
          <p>No audit logs.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3">
                <p className="font-medium">{log.action}</p>

                <p className="text-sm text-gray-500">
                  {log.user?.name} ({log.user?.email})
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}