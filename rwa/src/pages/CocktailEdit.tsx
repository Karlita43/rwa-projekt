import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../featured_cocktails.css";

type IngredientOption = {
  id: number;
  name: string;
};

type IngredientRow = {
  ingredient_id: number | "";
  quantity: string;
  unit: string;
};

type CocktailResponse = {
  id: number;
  name: string;
  description?: string | null;
  instructions: string;
  image_url?: string | null;
  ingredients?: Array<{
    id: number | string;
    name: string;
    pivot?: {
      quantity?: number | null;
      unit?: string | null;
    };
  }>;
};

const MAX_ROWS = 10;
const EMPTY_ROW: IngredientRow = { ingredient_id: "", quantity: "", unit: "" };

export default function CocktailEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }),
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [instructions, setInstructions] = useState("");

  const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
  const [rows, setRows] = useState<IngredientRow[]>([{ ...EMPTY_ROW }]);

  function ensureTrailingEmptyRow(list: IngredientRow[]): IngredientRow[] {
    const safe = list.slice(0, MAX_ROWS);
    const last = safe[safe.length - 1];

    if (last && last.ingredient_id !== "" && safe.length < MAX_ROWS) {
      return [...safe, { ...EMPTY_ROW }];
    }
    return safe.length ? safe : [{ ...EMPTY_ROW }];
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        // 1) dropdown opcije sastojaka
        const ingRes = await api.get("/ingredients");
        const ingList = (ingRes.data?.data ?? ingRes.data ?? []) as IngredientOption[];
        if (!cancelled) setIngredientOptions(ingList);

        // 2) dohvat koktela
        const cRes = await api.get(`/cocktails/${id}`);
        const c = cRes.data as CocktailResponse;

        if (cancelled) return;

        setName(c.name ?? "");
        setDescription(c.description ?? "");
        setInstructions(c.instructions ?? "");
        setImageUrl(c.image_url ?? "");

        // map ingredients -> rows
        const mappedRows: IngredientRow[] =
          c.ingredients?.map((ing) => ({
            ingredient_id: Number(ing.id), // ✅ cast to number
            quantity:
              ing.pivot?.quantity === null || ing.pivot?.quantity === undefined
                ? ""
                : String(ing.pivot.quantity),
            unit: ing.pivot?.unit ?? "",
          })) ?? [];

        setRows(ensureTrailingEmptyRow(mappedRows));
      } catch (e: any) {
        if (e?.response?.status === 403) {
          setError("Nemaš dopuštenje za uređivanje ovog koktela.");
        } else {
          setError("Greška pri dohvaćanju koktela.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function updateRow(index: number, patch: Partial<IngredientRow>) {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };

      const isLast = index === next.length - 1;
      const lastHasIngredient = next[index].ingredient_id !== "";
      if (isLast && lastHasIngredient && next.length < MAX_ROWS) {
        next.push({ ...EMPTY_ROW });
      }

      return next;
    });
  }

  function removeRow(index: number) {
    setRows((prev) => ensureTrailingEmptyRow(prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!id) return;

    if (!name.trim() || !instructions.trim()) {
      setError("Molimo upišite naziv i instrukcije.");
      return;
    }

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

    for (const row of ingredientsPayload) {
      if (row.quantity !== null && Number.isNaN(row.quantity)) {
        setError("Količina mora biti broj (ili ostavite prazno).");
        return;
      }
    }

    try {
      await api.put(
        `/cocktails/${id}`,
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
      } else if (status === 403) {
        setError("Nemaš dopuštenje za uređivanje ovog koktela.");
      } else {
        setError(err?.response?.data?.message || "Greška pri spremanju promjena.");
      }
    }
  }

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="page">
      <div className="modal-card">
        <h2>Uredi koktel</h2>

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
            Spremi promjene
          </button>
        </form>
      </div>
    </div>
  )
}