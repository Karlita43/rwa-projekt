import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) {
      setError("Molimo ispuni sva polja.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Lozinka i potvrda lozinke se ne podudaraju.");
      return;
    }

    try {
      await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm, // Laravel očekuje ovo polje
      });
      navigate("/login"); // nakon registracije vodi na login
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Greška kod registracije.");
    }
  };

  return (
    <div className="page">
      <div className="modal-card">
        <h2>Registracija</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="Potvrdi lozinku"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <button type="submit" className="btn-login">
            Registriraj se
          </button>
          {error && <div className="form-error">{error}</div>}
        </form>
        <p className="modal-hint">
          Već imate račun? <Link to="/login" className="modal-link">Prijavi se</Link>
        </p>
      </div>
    </div>
  );
}
