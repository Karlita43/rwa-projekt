import { useEffect, useState } from "react";

type RegisterProps = {
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

export default function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  function triggerError(message: string) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 350);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim()) {
      triggerError("Molimo ispuni sva polja.");
      return;
    }

    if (password !== passwordConfirmation) {
      triggerError("Lozinke se ne podudaraju.");
      return;
    }

    try {
      // 1️⃣ Dohvat CSRF cookie-a
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });

      // 2️⃣ POST request za registraciju
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        triggerError(data.message || "Nešto nije u redu.");
        return;
      }

      console.log("REGISTER SUCCESS:", data);
      setError("");
      alert("Registracija uspješna 🎉");

      onSwitchToLogin?.();
      onClose();
    } catch (err) {
      triggerError("Server nije dostupan.");
      console.error(err);
    }
  }

  return (
    <div className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />

      <div className={`modal-card ${shake ? "shake" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Registracija</h3>
          <button className="modal-x" type="button" onClick={onClose} aria-label="Zatvori">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Ime
            <input type="text" placeholder="Unesite ime" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Email
            <input type="email" placeholder="Unesite email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Lozinka
            <input type="password" placeholder="Unesite lozinku" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <label>
            Potvrdi lozinku
            <input type="password" placeholder="Potvrdi lozinku" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
          </label>

          <button className="btn btn-login" type="submit">Registriraj se</button>
          {error && <div className="form-error">{error}</div>}
        </form>

        <p className="modal-hint">
          Već imaš račun?
          <button className="modal-link" type="button" onClick={onSwitchToLogin}>Prijavi se</button>
        </p>
      </div>
    </div>
  );
}
