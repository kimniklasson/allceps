import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth/useAuth";

const NAME_REGEX = /^[a-zA-ZåäöÅÄÖéèêëàâùûüïîçæœÉÈÊËÀÂÙÛÜÏÎÇÆŒ\s]+$/;

function getProviderLabel(user: ReturnType<typeof useAuth>["user"]): string {
  const provider = user?.app_metadata?.provider;
  if (provider === "google") return "Inloggad via Google";
  if (provider === "github") return "Inloggad via GitHub";
  return "Inloggad via e-post";
}

export function ProfilePage() {
  const { user, displayName, updateName, signOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(displayName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || NAME_REGEX.test(value)) {
      setName(value);
      setNameError(null);
      setSaved(false);
    }
  };

  const handleNameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Ange ditt namn.");
      return;
    }
    if (!NAME_REGEX.test(trimmed)) {
      setNameError("Namnet får bara innehålla bokstäver.");
      return;
    }
    setSaving(true);
    const { error } = await updateName(trimmed);
    setSaving(false);
    if (error) {
      setNameError(error);
    } else {
      setSaved(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const providerLabel = getProviderLabel(user);

  return (
    <div className="flex flex-col gap-8">
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-[15px] font-bold leading-[18px]">Kontooversikt</span>
          <span className="text-[15px] leading-[18px] opacity-50">{providerLabel}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 hover:bg-red-600 transition-colors"
          aria-label="Logga ut"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Name field */}
      <form onSubmit={handleNameSave} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
            Ditt namn
          </span>
          <div
            className={`bg-white rounded-card p-4 border ${
              nameError ? "border-red-300" : "border-black/10"
            }`}
          >
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              maxLength={60}
              className="w-full bg-transparent text-[15px] outline-none"
              placeholder="Ditt namn"
            />
          </div>
          {nameError && (
            <span className="text-[12px] text-red-500">{nameError}</span>
          )}
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
            Din e-postadress
          </span>
          <div className="bg-white rounded-card p-4 border border-black/10 opacity-50">
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full bg-transparent text-[15px] outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {name.trim() !== displayName && (
          <button
            type="submit"
            disabled={saving || name.trim().length === 0}
            className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-wider rounded-button disabled:opacity-50 transition-opacity"
          >
            {saving ? "Sparar..." : saved ? "Sparat!" : "Spara namn"}
          </button>
        )}
      </form>

      {/* About section */}
      <div className="flex flex-col gap-1 pt-2">
        <span className="text-[15px] font-bold leading-[18px]">Om appen (version 1.0)</span>
        <span className="text-[15px] leading-[18px] opacity-50">
          Den här appen är designad av Kim Niklasson och framtagen med hjälp av AI.
        </span>
      </div>
    </div>
  );
}
