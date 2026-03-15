import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { CategoryList } from "./components/categories/CategoryList";
import { ExerciseListPage } from "./components/exercises/ExerciseListPage";
import { CompletedWorkoutsList } from "./components/history/CompletedWorkoutsList";
import { WorkoutDetailView } from "./components/history/WorkoutDetailView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<CategoryList />} />
          <Route path="/category/:id" element={<ExerciseListPage />} />
          <Route path="/history" element={<CompletedWorkoutsList />} />
          <Route path="/history/:sessionId" element={<WorkoutDetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
