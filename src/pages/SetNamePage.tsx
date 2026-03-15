import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const NAME_REGEX = /^[a-zA-ZåäöÅÄÖéèêëàâùûüïîçæœÉÈÊËÀÂÙÛÜÏÎÇÆŒ\s]+$/;

export function SetNamePage() {
  const { user, loading, displayName, updateName } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-[600px] min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (displayName) return <Navigate to="/" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || NAME_REGEX.test(value)) {
      setName(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Ange ditt namn.");
      return;
    }
    if (!NAME_REGEX.test(trimmed)) {
      setError("Namnet får bara innehålla bokstäver.");
      return;
    }
    setSubmitting(true);
    const { error } = await updateName(trimmed);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="mx-auto max-w-[600px] min-h-screen bg-white flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <svg
        width="48"
        height="16"
        viewBox="0 0 48 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-12"
      >
        <path
          d="M6 0V16H4V0H6ZM10 0V7H38V0H40V16H38V9H10V16H8V0H10ZM44 0V16H42V0H44ZM2 4V12H0V4H2ZM48 4V12H46V4H48Z"
          fill="black"
        />
      </svg>

      <h1 className="text-[20px] font-bold mb-2">Vad heter du?</h1>
      <p className="text-[15px] text-black/50 mb-8 text-center">
        Ange ditt namn för att komma igång.
      </p>

      {error && (
        <div className="w-full max-w-[345px] mb-4 p-3 bg-red-50 border border-red-200 rounded-button text-[13px] text-red-700 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-[345px] flex flex-col gap-4">
        <div className="bg-card rounded-card p-4 border border-transparent">
          <input
            type="text"
            placeholder="Ditt namn"
            value={name}
            onChange={handleChange}
            maxLength={60}
            autoFocus
            className="w-full bg-transparent text-[15px] outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting || name.trim().length === 0}
          className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-wider rounded-button disabled:opacity-50"
        >
          {submitting ? "Sparar..." : "Fortsätt"}
        </button>
      </form>
    </div>
  );
}
