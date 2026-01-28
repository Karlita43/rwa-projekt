import { useState, useContext } from "react";
import api from "../api";
import { LoginContext } from "../LoginContextProvider";
import { useNavigate, Link } from "react-router-dom";



export default function Login() {
  const { login } = useContext(LoginContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    if (!email.trim() || !password.trim()) {
      setError("Molimo ispuni sva polja.");
      return;
    }
    
    try {
      const res = await api.post("/login", { email, password });
      const token = res?.data?.token;

      if (!token) {
        setError("Login je uspio, ali token nije vraćen iz API-ja.");
        return;
      }

      login(res.data.token); // spremi token u context i localStorage
      navigate("/profil"); // nakon login vodi na početnu
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 422) {
        const errors = err?.response?.data?.errors as Record<string, string[]> | undefined;

        const firstMsg =
          errors && Object.values(errors)[0]?.[0]
            ? Object.values(errors)[0][0]
            : "Validacijska greška.";

        setError(firstMsg);
      } else {
        setError("Dogodila se greška pri prijavi.");
      }
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleTidalLogin = () => {
  window.location.href = "http://localhost:8000/auth/tidal/redirect";
};



  return (
    <div className="page">
      <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
        <Link to="/" className="btn">
          ← Povratak na početnu
        </Link>
      </div>
      <div className="modal-card">
        <h2>Login</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
          </button>

          {error && <div className="form-error">{error}</div>}
        </form>

        <p className="modal-hint">
          Nemate račun?{" "}
          <Link to="/register" className="modal-link">
            Registriraj se
          </Link>
        </p>
      </div>

      <div className="social-login">
        <button
          type="button"
          className="btn-social btn-tidal"
          onClick={handleTidalLogin}
          disabled={isSubmitting}
        >
          Prijavi se preko TIDAL-a
        </button>
      </div>
    </div>
  );
}
