import { useEffect, useState } from "react";

type LoginProps = {
  onClose: () => void;
  onSwitchToRegister?: () => void;
};

export default function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!email.trim() || !password.trim()) {
      triggerError("Molimo ispuni sva polja.");
      return;
    }

    try {

      // 2️⃣ Login request
      const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ email, password })
});

      const data = await response.json(); // pročitaj JSON samo jednom

      if (!response.ok) {
        triggerError(data.message || "Nešto nije u redu.");
        return;
      }

      console.log("LOGIN SUCCESS:", data);
      setError("");
      alert("Uspješna prijava 🎉");
      onClose();
    } catch (err) {
      triggerError("Server nije dostupan.");
      console.error(err);
    }
  }

  return (
    <div className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal-backdrop" />

      <div className={`modal-card ${shake ? "shake" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Prijava</h3>
          <button className="modal-x" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" placeholder="Unesite email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Lozinka
            <input type="password" placeholder="Unesite lozinku" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="btn btn-login" type="submit">Prijava</button>
          {error && <div className="form-error">{error}</div>}
        </form>

        <p className="modal-hint">
          Nemaš račun?
          <button className="modal-link" type="button" onClick={onSwitchToRegister}>Registriraj se</button>
        </p>
      </div>
    </div>
  );
}
