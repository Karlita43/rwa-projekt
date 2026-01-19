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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Molimo ispuni sva polja.");
      return;
    }

    try {
      const res = await api.post("/login", { email, password });
      login(res.data.token); // spremi token u context i localStorage
      navigate("/"); // nakon login vodi na početnu
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Neuspješna prijava.");
    }
  };

  return (
    <div className="page">
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
        <button type="submit" className="btn-login">Prijavi se</button>
        {error && <div className="form-error">{error}</div>}
      </form>
      <p className="modal-hint" >
        Nemate račun? <Link to="/register" className="modal-link">Registriraj se</Link>
      </p>
      </div>
    </div>
  );
}
