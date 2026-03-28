/**
 * All user-visible UI strings, centralized for future i18n.
 * Organized by feature area. When translating, replace values here.
 */

// ── Navigation ───────────────────────────────────────────────────────────────

export const NAV = {
  HOME: "Hem",
  HISTORY: "Historik",
  STATISTICS: "Statistik",
  PROFILE: "Profil",
} as const;

// ── Common / Shared ──────────────────────────────────────────────────────────

export const COMMON = {
  SAVE: "Spara",
  CREATE: "Skapa",
  CANCEL: "Avbryt",
  DELETE: "Ta bort",
  DELETE_PERMANENT: "Radera",
  EDIT: "Ändra",
  ADD: "Lägg till",
  YES: "Ja",
  NO: "Nej",
  OR: "eller",
  CONTINUE: "Fortsätt",
  CLOSE: "Stäng",
  LOADING: "Laddar...",
  NAME: "Namn",
  PASSWORD: "Lösenord",
  EMAIL: "E-post",
  EMAIL_ADDRESS: "E-postadress",
} as const;

// ── Time units ───────────────────────────────────────────────────────────────

export const TIME = {
  DAY: "dag",
  DAYS: "dagar",
  WEEK: "vecka",
  WEEKS: "veckor",
  HOUR: "timme",
  HOURS: "timmar",
  LESS_THAN_AN_HOUR: "mindre än en timme",
  YEAR: "År",
  MONTH: "Månad",
  AGO_SUFFIX: "sedan",
  YEAR_SUFFIX: "år",
} as const;

// ── Day names ────────────────────────────────────────────────────────────────

export const DAY_NAMES = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
] as const;

// ── Month names ──────────────────────────────────────────────────────────────

export const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
] as const;

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dec",
] as const;

// ── Auth / Login ─────────────────────────────────────────────────────────────

export const AUTH = {
  WELCOME: "Välkommen till Forfutureyou!",
  LOGIN_SUBTITLE: "Logga in eller skapa konto nedan",
  LOGIN: "Logga in",
  LOGGING_IN: "Loggar in...",
  CONTINUE_WITH_GOOGLE: "Fortsätt med Google",
  NO_ACCOUNT: "Inget konto?",
  CREATE_ACCOUNT: "Skapa konto",
  CREATING_ACCOUNT: "Skapar konto...",
  ALREADY_HAVE_ACCOUNT: "Redan har ett konto?",
  CHECK_EMAIL: "Kolla din e-post",
  CONFIRMATION_SENT: (email: string) =>
    `Vi har skickat en bekräftelselänk till ${email}. Klicka på länken för att aktivera ditt konto.`,
  BACK_TO_LOGIN: "Tillbaka till inloggning",
  PASSWORD_MIN_CHARS: "Lösenord (minst 8 tecken)",
  NO_USER_LOGGED_IN: "Ingen användare inloggad.",
  WRONG_CURRENT_PASSWORD: "Fel nuvarande lösenord.",
  COULD_NOT_DELETE_ACCOUNT: "Kunde inte radera kontot. Försök igen.",
  LOGGED_IN_VIA_GOOGLE: "Inloggad via Google",
  LOGGED_IN_VIA_GITHUB: "Inloggad via GitHub",
  LOGGED_IN_VIA_EMAIL: "Inloggad via e-post",
} as const;

// ── Profile / Settings ───────────────────────────────────────────────────────

export const PROFILE = {
  ACCOUNT_OVERVIEW: "Kontoöversikt",
  ABOUT_YOU: "Om dig",
  WEIGHT: "Vikt",
  AGE: "Ålder",
  SELECT_SEX: "Välj kön",
  SEX_MALE: "Man",
  SEX_FEMALE: "Kvinna",
  SEX_MALE_VALUE: "man",
  SEX_FEMALE_VALUE: "kvinna",
  MEASUREMENTS_CTA: "Lägg till och följ\ndin måttutveckling",
  SETTINGS: "Inställningar",
  APPEARANCE: "Utseende",
  APPEARANCE_LIGHT: "Ljus",
  APPEARANCE_DARK: "Mörkt",
  APPEARANCE_AUTO: "Auto",
  APPEARANCE_LIGHT_VALUE: "ljus",
  APPEARANCE_DARK_VALUE: "mörkt",
  APPEARANCE_AUTO_VALUE: "auto",
  SHOW_CALORIES: "Visa kalorier",
  ABOUT_APP: "Om appen (version 1.0)",
  ABOUT_APP_DESCRIPTION:
    "Den här appen är designad av Kim Niklasson och framtagen med hjälp av AI.",
  ACCOUNT: "Konto",
  CHANGE: "Ändra",
  LOG_OUT: "Logga ut",
  DELETING: "Tar bort...",
  DELETE_ACCOUNT: "Ta bort konto",
  CHANGE_PASSWORD: "Ändra lösenord",
  CURRENT_PASSWORD: "Nuvarande",
  NEW_PASSWORD: "Nytt",
  CONFIRM_PASSWORD: "Bekräfta",
  PASSWORD_UPDATED: "Lösenord uppdaterat!",
  SAVE_NEW_PASSWORD: "Spara nytt lösenord",
  PASSWORD_MIN_6: "Lösenordet måste vara minst 6 tecken.",
  PASSWORDS_DONT_MATCH: "Lösenorden matchar inte.",
  CONFIRM_LOGOUT: "Är du säker på att du vill logga ut?",
  CONFIRM_DELETE_ACCOUNT:
    "Är du säker på att du vill ta bort ditt konto? All din data kommer att raderas permanent.",
} as const;

// ── Set Name Page ────────────────────────────────────────────────────────────

export const SET_NAME = {
  TITLE: "Vad heter du?",
  SUBTITLE: "Ange ditt namn för att komma igång.",
  PLACEHOLDER: "Fyll i ditt namn",
} as const;

// ── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = {
  CREATE_PLACEHOLDER: "Skapa ett pass",
  EMPTY_STATE:
    'Börja med att skapa en kategori, t.ex. "Bröst och triceps" och tryck på Skapa. Du kan skapa hur många kategorier du vill.',
  CONFIRM_DELETE: (name: string) =>
    `Är du säker på att du vill ta bort kategorin "${name}"?`,
  EXERCISE_SINGULAR: "övning",
  EXERCISE_PLURAL: "övningar",
  MOTIVATION_STRONG: (name: string) => `Starkt jobbat${name}!`,
  MOTIVATION_COME_ON: (name: string) => `Kom igen nu${name}!`,
  MOTIVATION_TIME_TO_GO: (name: string) => `Dags att ta tag i det${name}!`,
  LAST_TRAINED: (timeSince: string) =>
    `Senaste träningen var ${timeSince} sedan`,
} as const;

// ── Exercises ────────────────────────────────────────────────────────────────

export const EXERCISES = {
  ADD_EXERCISE: "Lägg till en övning",
  ADD_EXERCISE_SUBTITLE: "Fyll i allt för att lägga till",
  ADD: "Lägg till",
  ADD_EXERCISE_ARIA: "Lägg till övning",
  EDIT_EXERCISE: "Ändra en övning",
  EDIT_EXERCISE_SUBTITLE: "Tryck för att ändra",
  NAME_LABEL: "Namn på övning",
  NAME_PLACEHOLDER: "Fyll i t.ex. Hantelpress",
  REPS_LABEL: "Välj antal basrepetitioner",
  REPS_PLACEHOLDER: "Fyll i t.ex. 8",
  WEIGHT_LABEL: "Välj en basvikt",
  WEIGHT_PLACEHOLDER: "Fyll i t.ex. 30",
  BODYWEIGHT: "Kroppsvikt",
  BODYWEIGHT_QUESTION: "Kroppsvikt?",
  SETTINGS: "Inställningar",
  ALREADY_ACTIVE_SESSION:
    "Du har redan ett aktivt pass. Avsluta det först innan du startar ett nytt.",
  CATEGORY_NOT_FOUND: "Kategori hittades inte.",
  NO_EXERCISES_YET: "Inga övningar ännu.",
  EXERCISE_NOT_FOUND: "Övningen hittades inte",
  CONFIRM_REMOVE_FROM_CATEGORY: (exerciseName: string, categoryName: string) =>
    `Är du säker på att du vill ta bort ${exerciseName} från ${categoryName}?`,
} as const;

// ── Import Exercises Modal ───────────────────────────────────────────────────

export const IMPORT_EXERCISES = {
  HEADER: (categoryName: string) => `Välj övningar till ${categoryName}`,
  PLACEHOLDER: "Lägg till övning",
  NO_EXERCISES: "Inga övningar skapade ännu",
  SAVE: "SPARA",
  CONFIRM_DELETE: (name: string) =>
    `Vill du permanent radera ${name}? Övningen tas bort från alla kategorier.`,
} as const;

// ── Muscle Groups ────────────────────────────────────────────────────────────

export const MUSCLE_GROUPS = {
  LABEL: "Muskelgrupper",
  ADD: "Lägg till muskelgrupp",
  CREATE_PLACEHOLDER: "Skapa ny muskelgrupp...",
  CREATING: "Skapar...",
  CONFIRM_DELETE:
    "Ta bort muskelgruppen permanent? Den tas bort från alla övningar.",
} as const;

// ── Session / Timer ──────────────────────────────────────────────────────────

export const SESSION = {
  TOTAL_TIME: "TOTAL TID",
  GREAT_JOB: "Bra jobbat!",
  SUMMARY_TEXT: "Här är en summering av passet.",
  TIME: "Tid",
  SETS: "Set",
  REPS: "Reps",
  INTENSITY: "Intensitet",
  AVG_REST: "Snittvila",
  CALORIES: "Kalorier",
  VIEW_WORKOUT: "Visa pass",
  CONFIRM_CANCEL:
    "Avbryta pågående pass? Dina loggade set sparas inte.",
} as const;

// ── History ──────────────────────────────────────────────────────────────────

export const HISTORY = {
  TITLE: "Historik",
  SUBTITLE: "Genomförda träningspass",
  EMPTY_STATE: "Inga träningspass ännu.",
  CONFIRM_DELETE_WORKOUT:
    "Är du säker på att du vill ta bort detta träningspass?",
  WORKOUT_NOT_FOUND: "Träningspass hittades inte.",
  CONFIRM_DELETE_SET: "Är du säker på att du vill ta bort setet permanent?",
  REST_PREFIX: "Vila:",
  EXERCISE_REST_PREFIX: "Övningsvila:",
  INTENSITY_DESCRIPTION:
    "Visar hur tungt du lyfte i förhållande till din maxstyrka. 100 betyder att du lyfte på max hela passet – de flesta tränar runt 60–80.",
} as const;

// ── Exercise Progress ────────────────────────────────────────────────────────

export const PROGRESS = {
  HEAVIEST_LIFT: "Tyngsta lyft",
  TOTAL_VOLUME: "Total volym",
  NO_SESSIONS: "Inga pass under denna period",
} as const;

// ── Stats ────────────────────────────────────────────────────────────────────

export const STATS = {
  TITLE: "Statistik",
  SUBTITLE: "Framsteg och rekord",
  EMPTY_STATE: "Inga träningspass ännu.",
} as const;

export const STATS_PERSONAL_RECORDS = {
  TITLE: "Personliga rekord",
  SHOW_ALL: (count: number) => `Visa alla (${count})`,
} as const;

export const STATS_MILESTONES = {
  TITLE: "Milstolpar",
  TOTAL_LIFTED: "Totalt lyft",
  CARS: "bilar",
  ELEPHANTS: "elefanter",
  KEEP_LIFTING: "Fortsätt lyfta!",
  CAR_DESCRIPTION: "i bilvikt (1 500 kg per bil)",
  ELEPHANT_DESCRIPTION: "i elefantvikt (5 000 kg per elefant)",
  TRAINING_AGE: "Träningsålder",
  SINCE_FIRST_SESSION: "sedan ditt första pass",
  PERSONAL_RECORDS: "Personliga rekord",
  NEW_PBS_THIS_MONTH: "nya PBs denna månad",
  LAST_MONTH: "förra månaden",
} as const;

export const STATS_STREAKS = {
  TITLE: "Streak & kontinuitet",
  BEST_WEEK: "Bästa vecka",
  BEST_MONTH: "Bästa månad",
  AVG_PER_WEEK: "Snitt/vecka (4v)",
  FAVORITE_DAY: "Favoritdag",
  SESSIONS: "pass",
} as const;

export const STATS_EXERCISE_INSIGHTS = {
  TITLE: "Övningsinsikter",
  MOST_TRAINED: "Mest tränad",
  SETS_TOTAL: "set totalt",
  MOST_NEGLECTED: "Mest försummad",
  DAYS_AGO: "dagar sedan",
  CATEGORY_BALANCE: "Kategoribalans",
} as const;

export const STATS_SESSION_OVERVIEW = {
  TITLE: "Passöversikt",
  AVG_LENGTH: "Snittlängd",
  TOTAL_TIME: "Total tid",
  AVG_REST: "Snittvila",
  AVG_CALORIES: "Snittkalorier",
} as const;

export const STATS_VOLUME_TREND = {
  TITLE: "Träningsvolym",
  DESCRIPTION:
    "Visar din totala träningsvolym (set × reps × vikt) per kategori och vecka. Hjälper dig följa om du ökar din totala träningsbelastning över tid.",
} as const;

export const STATS_STRENGTH_TREND = {
  TITLE: "Styrketrend",
  DESCRIPTION:
    "Visar din relativa styrkeutveckling per kategori över tid. 100% är din utgångsnivå – kurvan visar hur din beräknade maxstyrka (e1RM) förändrats sedan start.",
} as const;

export const STATS_MUSCLE_GROUP_VOLUME = {
  TITLE: "Mest tränade muskelgrupper",
  EMPTY_DESCRIPTION:
    "Tilldela muskelgrupper till dina övningar för att se fördelningen.",
  PERIOD_30_DAYS: "30 dagar",
  PERIOD_ALL_TIME: "All tid",
} as const;

export const STATS_OVERVIEW = {
  SESSION_DISTRIBUTION: "Passfördelning",
  SESSION_DISTRIBUTION_DESCRIPTION:
    "Visar hur dina träningspass fördelar sig mellan olika kategorier. Tryck på ett segment för att se exakt andel.",
  INTENSITY_DESCRIPTION:
    "Visar hur tungt du i snitt lyfter jämfört med din maxstyrka, över alla pass. 100 = maximal ansträngning, de flesta landar på 60–80.",
} as const;

// ── Body Model / Measurements ────────────────────────────────────────────────

export const BODY = {
  LOADING_MODEL: "Laddar modell...",
  CONFIRM_DELETE_MEASUREMENT:
    "Är du säker på att du vill radera måttet permanent?",
} as const;

export const BODY_PARTS_MALE = {
  NECK: "Nacke",
  SHOULDERS: "Axlar",
  CHEST: "Bröst",
  WAIST: "Midja",
  GLUTES: "Rumpa",
  UPPER_ARM: "Överarm",
  FOREARM: "Underarm",
  THIGH: "Lår",
  CALF: "Vad",
} as const;

export const BODY_PARTS_FEMALE = {
  NECK: "Nacke",
  SHOULDERS: "Axlar",
  CHEST: "Bröst",
  WAIST: "Midja",
  GLUTES: "Rumpa",
  UPPER_ARM: "Överarm",
  FOREARM: "Underarm",
  THIGH: "Lår",
  CALF: "Vad",
} as const;
