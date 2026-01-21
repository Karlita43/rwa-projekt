import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type IngredientOption = {
  id: number;
  name: string;
};

type IngredientRow = {
  ingredient_id: number | ""; // "" dok nije odabrano
  quantity: string;           // string radi inputa; pretvori u broj na submit
  unit: string;
};

const MAX_ROWS = 10;

export default function CocktailNew() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
  const [rows, setRows] = useState<IngredientRow[]>([
    { ingredient_id: "", quantity: "", unit: "" },
  ]);

  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }),
    []
  );

  // učitaj sve dostupne sastojke (za dropdown)
  useEffect(() => {
    api
      .get("/ingredients")
      .then((res) => {
        const list = (res.data?.data ?? res.data ?? []) as IngredientOption[];
        setIngredientOptions(list);
      })
      .catch(() => {
        // nije kritično, ali bez ovog user ne može birati
        setError("Ne mogu dohvatiti listu sastojaka.");
      });
  }, []);

  function updateRow(index: number, patch: Partial<IngredientRow>) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };

      // auto-dodaj novi red kad se odabere ingredient u zadnjem redu
      const isLast = index === next.length - 1;
      const lastHasIngredient = next[index].ingredient_id !== "";
      if (isLast && lastHasIngredient && next.length < MAX_ROWS) {
        next.push({ ingredient_id: "", quantity: "", unit: "" });
      }

      return next;
    });
  }

  function removeRow(index: number) {
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // uvijek barem 1 red
      return next.length ? next : [{ ingredient_id: "", quantity: "", unit: "" }];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !instructions.trim()) {
      setError("Molimo upišite naziv i instrukcije.");
      return;
    }

    // uzmi samo redove gdje je odabran ingredient
    const ingredientsPayload = rows
      .filter((r) => r.ingredient_id !== "")
      .map((r) => ({
        ingredient_id: Number(r.ingredient_id),
        quantity: r.quantity.trim() === "" ? null : Number(r.quantity),
        unit: r.unit.trim() === "" ? null : r.unit.trim(),
      }));

    if (ingredientsPayload.length < 1) {
      setError("Dodajte barem jedan sastojak.");
      return;
    }

    // basic provjera za NaN
    for (const row of ingredientsPayload) {
      if (row.quantity !== null && Number.isNaN(row.quantity)) {
        setError("Količina mora biti broj (ili ostavite prazno).");
        return;
      }
    }

    try {
      await api.post(
        "/cocktails",
        {
          name: name.trim(),
          description: description.trim() || null,
          instructions: instructions.trim(),
          image_url: imageUrl.trim() || null,
          ingredients: ingredientsPayload,
        },
        authHeaders
      );

      navigate("/profil");
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 422) {
        const errors = err?.response?.data?.errors as Record<string, string[]> | undefined;
        const firstErrorArray = errors ? Object.values(errors)[0] : null;
        setError(firstErrorArray?.[0] ?? "Validacijska greška.");
      } else {
        setError(err?.response?.data?.message || "Dogodila se greška pri spremanju.");
      }
    }
  }

  return (
    <div className="page">
      <div className="modal-card">
        <h2>Novi koktel</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Naziv"
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL slike (opcionalno)"
          />

          <textarea 

            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opis (opcionalno)"
            rows={3}
          />

          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instrukcije"
            rows={5}
          />

          <div style={{ marginTop: 12 }}>
            <h3 style={{ marginBottom: 8 }}>Sastojci (max {MAX_ROWS})</h3>

            {rows.map((r, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 0.6fr 0.7fr auto",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <select
                  value={r.ingredient_id}
                  onChange={(e) =>
                    updateRow(idx, {
                      ingredient_id: e.target.value ? Number(e.target.value) : "",
                    })
                  }
                >
                  <option value="">Odaberi sastojak...</option>
                  {ingredientOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>

                <input
                  value={r.quantity}
                  onChange={(e) => updateRow(idx, { quantity: e.target.value })}
                  placeholder="Količina"
                  inputMode="decimal"
                />

                <input
                  value={r.unit}
                  onChange={(e) => updateRow(idx, { unit: e.target.value })}
                  placeholder="Jedinica"
                />

                <button
                className="btn-login"
                  type="button"
                  onClick={() => removeRow(idx)}
                  disabled={rows.length === 1}
                  title="Ukloni red"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-login">
            Spremi koktel
          </button>
        </form>
      </div>
    </div>
  );
}
