import { useContext, useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { LoginContext } from "../LoginContextProvider";

export default function Register() {
  const { login } = useContext(LoginContext);

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

   const [isSubmitting, setIsSubmitting] = useState(false); 

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

    setError("");
    setIsSubmitting(true);

    try {
     const response =  await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm, // Laravel očekuje ovo polje
      });

      const token = response?.data?.token;

      if (!token) {
        setError("Registracija je uspjela, ali token nije vraćen.");
        return;
      }
      login(token); // opcionalno, može se automatski logirati nakon registracije


      navigate("/students", { replace: true }); // nakon registracije vodi na login
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
        setError("Dogodila se greška pri registraciji.");
      }
    } finally{
      setIsSubmitting(false);
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
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Potvrdi lozinku"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? "Registracija..." : "Registracija"}
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
