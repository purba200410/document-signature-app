import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function InviteAccept() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  useEffect(() => {
    const acceptInvite = async () => {
      if (!token) return;

      try {
        await API.post("/auth/accept-invite", { token });

        alert("Invitation accepted");
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Invalid or expired invite");
      }
    };

    acceptInvite();
  }, [token]);

  return <h2>Processing invitation...</h2>;
}