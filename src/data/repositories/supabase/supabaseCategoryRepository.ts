import { supabase } from "../../../lib/supabase";
import type { Category, Exercise } from "../../../types/models";
import type { CategoryRepository } from "../../types";

interface DbCategory {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  created_at: string;
  exercises: DbExercise[];
}

interface DbExercise {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  base_reps: number;
  base_weight: number;
  is_bodyweight: boolean;
  sort_order: number;
}

function mapExercise(db: DbExercise): Exercise {
  return {
    id: db.id,
    categoryId: db.category_id,
    name: db.name,
    baseReps: db.base_reps,
    baseWeight: db.base_weight,
    isBodyweight: db.is_bodyweight,
    sortOrder: db.sort_order,
  };
}

function mapCategory(db: DbCategory): Category {
  return {
    id: db.id,
    name: db.name,
    exercises: (db.exercises || []).map(mapExercise).sort((a, b) => a.sortOrder - b.sortOrder),
    createdAt: db.created_at,
    sortOrder: db.sort_order,
  };
}

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export const supabaseCategoryRepository: CategoryRepository = {
  async getAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*, exercises(*)")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return (data as DbCategory[]).map(mapCategory);
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*, exercises(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return mapCategory(data as DbCategory);
  },

  async create(name: string) {
    const userId = await getUserId();

    // Get current max sort_order
    const { data: existing } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);

    const sortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data, error } = await supabase
      .from("categories")
      .insert({ user_id: userId, name, sort_order: sortOrder })
      .select("*, exercises(*)")
      .single();

    if (error) throw error;
    return mapCategory(data as DbCategory);
  },

  async update(id, data) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

    const { data: result, error } = await supabase
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select("*, exercises(*)")
      .single();

    if (error) throw error;
    return mapCategory(result as DbCategory);
  },

  async delete(id) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },

  async addExercise(categoryId, data) {
    const userId = await getUserId();

    // Get current max sort_order for exercises in this category
    const { data: existing } = await supabase
      .from("exercises")
      .select("sort_order")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: false })
      .limit(1);

    const sortOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const { data: result, error } = await supabase
      .from("exercises")
      .insert({
        user_id: userId,
        category_id: categoryId,
        name: data.name,
        base_reps: data.baseReps,
        base_weight: data.baseWeight,
        is_bodyweight: data.isBodyweight,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return mapExercise(result as DbExercise);
  },

  async updateExercise(_categoryId, exerciseId, data) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.baseReps !== undefined) updateData.base_reps = data.baseReps;
    if (data.baseWeight !== undefined) updateData.base_weight = data.baseWeight;
    if (data.isBodyweight !== undefined) updateData.is_bodyweight = data.isBodyweight;

    const { data: result, error } = await supabase
      .from("exercises")
      .update(updateData)
      .eq("id", exerciseId)
      .select()
      .single();

    if (error) throw error;
    return mapExercise(result as DbExercise);
  },

  async deleteExercise(_categoryId, exerciseId) {
    const { error } = await supabase.from("exercises").delete().eq("id", exerciseId);
    if (error) throw error;
  },

  async reorderCategories(orderedIds) {
    const updates = orderedIds.map((id, index) =>
      supabase.from("categories").update({ sort_order: index }).eq("id", id)
    );
    await Promise.all(updates);
  },

  async reorderExercises(_categoryId, orderedIds) {
    const updates = orderedIds.map((id, index) =>
      supabase.from("exercises").update({ sort_order: index }).eq("id", id)
    );
    await Promise.all(updates);
  },
};
