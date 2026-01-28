import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../LoginContextProvider";

export default function TidalCallback() {
  const { login } = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // ⬇️ spremi token (LoginContext ga već sprema i u localStorage)
    login(token);

    // ⬇️ makni ?token=... iz URL-a
    navigate("/profil", { replace: true });
  }, [location.search, login, navigate]);

  return <div>Prijava preko TIDAL-a…</div>;
}
