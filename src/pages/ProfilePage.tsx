import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BodyModelPreview } from "../components/body/BodyModelPreview";
import { IconLogout, IconTrash, IconArrowLeft } from "../components/ui/icons";
import { useAuth } from "../auth/useAuth";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Modal } from "../components/ui/Modal";
import { useSettingsStore, type Appearance, type Sex } from "../stores/useSettingsStore";
import { IconShow, IconHide } from "../components/ui/icons";
import { PROFILE, COMMON, AUTH, TIME } from "../constants/ui-strings";

const NAME_REGEX = /^[a-zA-ZåäöÅÄÖéèêëàâùûüïîçæœÉÈÊËÀÂÙÛÜÏÎÇÆŒ\s]+$/;

function getProviderLabel(user: ReturnType<typeof useAuth>["user"]): string {
  const provider = user?.app_metadata?.provider;
  if (provider === "google") return AUTH.LOGGED_IN_VIA_GOOGLE;
  if (provider === "github") return AUTH.LOGGED_IN_VIA_GITHUB;
  return AUTH.LOGGED_IN_VIA_EMAIL;
}

export function ProfilePage() {
  const { user, displayName, updateName, updatePassword, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { appearance, setAppearance, userWeight, setUserWeight, userAge, setUserAge, userSex, setUserSex, showCalories, setShowCalories } = useSettingsStore();

  const [name, setName] = useState(displayName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [weightInput, setWeightInput] = useState(userWeight > 0 ? String(userWeight) : "");
  const [savingWeight, setSavingWeight] = useState(false);
  const [ageInput, setAgeInput] = useState(userAge > 0 ? String(userAge) : "");
  const [savingAge, setSavingAge] = useState(false);

  const weightValue = parseFloat(weightInput) || 0;
  const weightChanged = weightValue !== userWeight;
  const ageValue = parseInt(ageInput) || 0;
  const ageChanged = ageValue !== userAge;
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordSave = async () => {
    setPasswordError(null);
    if (newPassword.length < 6) { setPasswordError(PROFILE.PASSWORD_MIN_6); return; }
    if (newPassword !== confirmPassword) { setPasswordError(PROFILE.PASSWORDS_DONT_MATCH); return; }
    setSavingPassword(true);
    const { error } = await updatePassword(currentPassword, newPassword);
    setSavingPassword(false);
    if (error) { setPasswordError(error); return; }
    setPasswordSuccess(true);
    setTimeout(() => {
      setShowPasswordModal(false);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setPasswordSuccess(false);
    }, 1500);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasChanged = name.trim() !== displayName && name.trim().length > 0;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || NAME_REGEX.test(value)) {
      setName(value);
      setNameError(null);
    }
  };

  const handleNameSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || !hasChanged) return;
    setSaving(true);
    const { error } = await updateName(trimmed);
    setSaving(false);
    if (error) setNameError(error);
  };


  const handleWeightSave = () => {
    if (!weightChanged) return;
    setSavingWeight(true);
    setUserWeight(weightValue);
    setTimeout(() => setSavingWeight(false), 300);
  };

  const handleAgeSave = () => {
    if (!ageChanged) return;
    setSavingAge(true);
    setUserAge(ageValue);
    setTimeout(() => setSavingAge(false), 300);
  };

  const handleConfirmSignOut = async () => {
    setShowLogoutConfirm(false);
    await signOut();
    navigate("/login", { replace: true });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const { error } = await deleteAccount();
    setDeleting(false);
    if (!error) {
      navigate("/login", { replace: true });
    }
  };

  const providerLabel = getProviderLabel(user);

  const appearanceOptions: { value: Appearance; label: string }[] = [
    { value: PROFILE.APPEARANCE_LIGHT_VALUE as Appearance, label: PROFILE.APPEARANCE_LIGHT },
    { value: PROFILE.APPEARANCE_DARK_VALUE as Appearance, label: PROFILE.APPEARANCE_DARK },
    { value: PROFILE.APPEARANCE_AUTO_VALUE as Appearance, label: PROFILE.APPEARANCE_AUTO },
  ];

  const sexOptions: { value: Sex; label: string }[] = [
    { value: PROFILE.SEX_MALE_VALUE as Sex, label: PROFILE.SEX_MALE },
    { value: PROFILE.SEX_FEMALE_VALUE as Sex, label: PROFILE.SEX_FEMALE },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Title row */}
      <div className="flex flex-col items-center text-center">
        <span className="text-[20px] font-bold leading-[1.22]">{PROFILE.ACCOUNT_OVERVIEW}</span>
        <span className="text-[20px] leading-[1.22] opacity-50">{providerLabel}</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">{PROFILE.ABOUT_YOU}</span>

        {/* Name field */}
        <div className="flex flex-col gap-2">
          <label className={`border rounded-card flex items-center pl-6 pr-4 py-4 cursor-text ${nameError ? "border-red-300" : "border-black/10 dark:border-white/20"}`}>
            <span className="flex-1 text-[15px]">{COMMON.NAME}</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                onBlur={handleNameSave}
                onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
                maxLength={60}
                placeholder="–"
                style={{ width: `${Math.max(1, name.length)}ch` }}
                className="text-[15px] bg-transparent outline-none text-right"
              />
              {saving && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />}
            </div>
          </label>
          {nameError && (
            <span className="text-[12px] text-red-500">{nameError}</span>
          )}
        </div>

        {/* Weight field */}
        <label className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-4 cursor-text">
          <span className="flex-1 text-[15px]">{PROFILE.WEIGHT}</span>
          <div className="flex items-center gap-1">
            {savingWeight && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />}
            <input
              type="number"
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              onBlur={handleWeightSave}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              placeholder="–"
              style={{ width: `${Math.max(1, weightInput.length)}ch` }}
              className="text-[15px] bg-transparent outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[15px] opacity-50">kg</span>
          </div>
        </label>

        {/* Age field */}
        <label className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-4 cursor-text">
          <span className="flex-1 text-[15px]">{PROFILE.AGE}</span>
          <div className="flex items-center gap-1">
            {savingAge && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />}
            <input
              type="number"
              inputMode="numeric"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              onBlur={handleAgeSave}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              placeholder="–"
              style={{ width: `${Math.max(1, ageInput.length)}ch` }}
              className="text-[15px] bg-transparent outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[15px] opacity-50">{TIME.YEAR_SUFFIX}</span>
          </div>
        </label>

        {/* Sex selector */}
        <div className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-3">
          <span className="flex-1 text-[15px]">{PROFILE.SELECT_SEX}</span>
          <div className="flex rounded-full border border-black/10 dark:border-white/20 p-[5px] gap-[2px]">
            {sexOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUserSex(userSex === value ? null : value)}
                className={`px-4 py-[6px] rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors ${
                  userSex === value
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-black/40 dark:text-white/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body measurements card */}
        <button
          type="button"
          onClick={() => navigate('/body')}
          className="rounded-card flex overflow-hidden w-full text-left bg-[#f5f5f5] dark:bg-white/5"
          style={{ height: 136 }}
        >
          <div className="flex-1 flex flex-col justify-between pl-6 pt-6 pb-6">
            <p className="text-[15px] font-medium leading-snug opacity-80 whitespace-pre-line">
              {PROFILE.MEASUREMENTS_CTA}
            </p>
            <IconArrowLeft size={16} className="rotate-180" />
          </div>
          <div className="flex-shrink-0 self-center" style={{ width: 160, height: 210 }}>
            <BodyModelPreview sex={userSex} />
          </div>
        </button>

      </div>

      {/* Settings section */}
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">{PROFILE.SETTINGS}</span>

        <div className="flex flex-col gap-2">
          {/* Appearance row */}
          <div className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-3">
            <span className="flex-1 text-[15px]">{PROFILE.APPEARANCE}</span>
            <div className="flex rounded-full border border-black/10 dark:border-white/20 p-[5px] gap-[2px]">
              {appearanceOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAppearance(value)}
                  className={`px-4 py-[6px] rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    appearance === value
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "text-black/40 dark:text-white/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Show calories toggle */}
          <div className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-3">
            <span className="flex-1 text-[15px]">{PROFILE.SHOW_CALORIES}</span>
            <div className="flex rounded-full border border-black/10 dark:border-white/20 p-[5px] gap-[2px]">
              {([{ value: true, label: COMMON.YES }, { value: false, label: COMMON.NO }] as const).map(({ value, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setShowCalories(value)}
                  className={`px-4 py-[6px] rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors ${
                    showCalories === value
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "text-black/40 dark:text-white/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* About section */}
      <div className="flex flex-col gap-1 pt-2">
        <span className="text-[15px] font-bold leading-[18px]">{PROFILE.ABOUT_APP}</span>
        <span className="text-[15px] leading-[18px] opacity-50">
          {PROFILE.ABOUT_APP_DESCRIPTION}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">{PROFILE.ACCOUNT}</span>

        {/* Email field */}
        <div className="border border-black/10 dark:border-white/20 rounded-card flex flex-col pl-6 pr-4 py-3 opacity-50">
          <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
            {COMMON.EMAIL_ADDRESS}
          </span>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="text-[15px] bg-transparent outline-none cursor-not-allowed"
          />
        </div>

        {/* Password field */}
        <div className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-3">
          <div className="flex flex-col flex-1 opacity-50">
            <span className="text-[12px] font-bold uppercase tracking-wider opacity-50">
              {COMMON.PASSWORD}
            </span>
            <span className="text-[15px]">*********</span>
          </div>
          <button
            type="button"
            onClick={() => { setShowPasswordModal(true); setPasswordError(null); setPasswordSuccess(false); }}
            className="px-4 py-2 rounded-button text-[12px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 transition-colors"
          >
            {PROFILE.CHANGE}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Logout */}
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 rounded-full px-6 py-5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors"
        >
          {PROFILE.LOG_OUT}
          <IconLogout size={18} />
        </button>

        {/* Delete account */}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-red-500 opacity-70 hover:opacity-100 transition-opacity mx-auto"
        >
          {deleting ? PROFILE.DELETING : PROFILE.DELETE_ACCOUNT}
          <IconTrash size={16} />
        </button>
      </div>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(null); }}
        title={PROFILE.CHANGE_PASSWORD}
      >
        <div className="flex flex-col gap-3">
          {/* Current password */}
          <label className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-4 cursor-text">
            <span className="flex-1 text-[15px]">{PROFILE.CURRENT_PASSWORD}</span>
            <input
              type={showCurrentPw ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="text-[15px] bg-transparent outline-none text-right w-28"
            />
            <button type="button" onClick={(e) => { e.preventDefault(); setShowCurrentPw(v => !v); }} className="ml-2 opacity-40 hover:opacity-70 transition-opacity">
              {showCurrentPw ? <IconHide size={16} /> : <IconShow size={16} />}
            </button>
          </label>

          {/* New password */}
          <label className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-4 cursor-text">
            <span className="flex-1 text-[15px]">{PROFILE.NEW_PASSWORD}</span>
            <input
              type={showNewPw ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="text-[15px] bg-transparent outline-none text-right w-28"
            />
            <button type="button" onClick={(e) => { e.preventDefault(); setShowNewPw(v => !v); }} className="ml-2 opacity-40 hover:opacity-70 transition-opacity">
              {showNewPw ? <IconHide size={16} /> : <IconShow size={16} />}
            </button>
          </label>

          {/* Confirm new password */}
          <label className="border border-black/10 dark:border-white/20 rounded-card flex items-center pl-6 pr-4 py-4 cursor-text">
            <span className="flex-1 text-[15px]">{PROFILE.CONFIRM_PASSWORD}</span>
            <input
              type={showConfirmPw ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handlePasswordSave(); }}
              placeholder="••••••••"
              className="text-[15px] bg-transparent outline-none text-right w-28"
            />
            <button type="button" onClick={(e) => { e.preventDefault(); setShowConfirmPw(v => !v); }} className="ml-2 opacity-40 hover:opacity-70 transition-opacity">
              {showConfirmPw ? <IconHide size={16} /> : <IconShow size={16} />}
            </button>
          </label>

          {passwordError && <span className="text-[12px] text-red-500 text-center">{passwordError}</span>}
          {passwordSuccess && <span className="text-[12px] text-green-500 text-center">{PROFILE.PASSWORD_UPDATED}</span>}

          <button
            type="button"
            onClick={handlePasswordSave}
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
            className={`w-full py-4 rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center ${
              !savingPassword && currentPassword && newPassword && confirmPassword
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-black/5 dark:bg-white/10 text-black/30 dark:text-white/30"
            }`}
          >
            {savingPassword
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : PROFILE.SAVE_NEW_PASSWORD
            }
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        message={PROFILE.CONFIRM_LOGOUT}
        confirmLabel={PROFILE.LOG_OUT}
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message={PROFILE.CONFIRM_DELETE_ACCOUNT}
        confirmLabel={COMMON.DELETE}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
