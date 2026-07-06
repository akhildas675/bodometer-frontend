import { useState, useEffect, useMemo } from 'react';
import { Activity, Droplets, Moon, Utensils, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { StepperInput } from '@/features/user/user.onboarding/components/stepper.input';
import { HealthLogDto, MealEntry, MealEntryDto } from '@/modules/health-log/types/health-log.interface';
import { MealCategory } from "@/modules/meal-category/types/meal-category.interface";
import { useFetch } from '@/hooks/useFetch';
import { healthLogService } from '@/modules/health-log/service/health-log.service';
import mealCategoryService from '@/modules/meal-category/service/meal-category.service';
import { userService } from "@/modules/user/service/user.service";
import { subscriptionService } from '@/modules/subscription/service/subscription.service';
import { toast } from 'sonner';
import { parseApiError } from '@/api/error.helper';

//  Dirty-state snapshot
// Serialises the user-editable inputs so we can detect unsaved changes
// without running any business logic on the frontend.
interface EditSnapshot {
  sleepHours: number | null;
  waterLiters: number | null;
  steps: number | null;
  mealsKey: string; // JSON of [{categoryId, description}] only
}

const buildMealsKey = (meals: MealEntry[]): string =>
  JSON.stringify(meals.map(m => ({ categoryId: m.categoryId, description: m.description })));

//  Helpers for mapping server meals → local MealEntry
const mapDtoToEntry = (m: MealEntryDto, index: number): MealEntry => ({
  id:                `meal-${index}-${Date.now()}`,
  categoryId:        m.mealCategoryId,
  description:       m.description,
  correctedMeal:     m.correctedMeal,
  estimatedCalories: m.estimatedCalories ?? 0,
  estimatedProtein:  m.estimatedProtein  ?? 0,
  estimatedCarbs:    m.estimatedCarbs    ?? 0,
  estimatedFat:      m.estimatedFat      ?? 0,
});

//  Component
const UserHealthLog = () => {

  //  Form state (user inputs only)
  const [date,        setDate]        = useState<string>(new Date().toISOString().split('T')[0]);
  const [sleepHours,  setSleepHours]  = useState<number | null>(null);
  const [waterLiters, setWaterLiters] = useState<number | null>(null);
  const [steps,       setSteps]       = useState<number | null>(null);
  const [meals,       setMeals]       = useState<MealEntry[]>([]);

  //  Backend-sourced display values (no frontend calculations)
  const [savedLog, setSavedLog] = useState<HealthLogDto | null>(null);

  //  Dirty detection
  const [savedSnapshot, setSavedSnapshot] = useState<EditSnapshot>({
    sleepHours: null, waterLiters: null, steps: null, mealsKey: '[]',
  });

  const isDirty = useMemo<boolean>(() => {
    if (sleepHours  !== savedSnapshot.sleepHours)  return true;
    if (waterLiters !== savedSnapshot.waterLiters) return true;
    if (steps       !== savedSnapshot.steps)       return true;
    if (buildMealsKey(meals) !== savedSnapshot.mealsKey) return true;
    return false;
  }, [sleepHours, waterLiters, steps, meals, savedSnapshot]);

  //  Loading flags
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [subStartDate, setSubStartDate] = useState<string | null>(null);

  //  Fetch meal categories & subscription
  const { data: categoryResponse } = useFetch(() => mealCategoryService.getMealCategory({ limit: 100 }));
  const mealCategories = categoryResponse?.data ?? [];

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await subscriptionService.getActiveSubscription();
        if (res.data?.startDate) {
          setSubStartDate(new Date(res.data.startDate).toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };
    fetchSub();
  }, []);

  //  Load health log whenever date change
  useEffect(() => {
    const fetchLog = async () => {
      setIsLoading(true);
      try {
        const res  = await healthLogService.getHealthLog(date);
        const log  = res.data;
        const sleep  = log?.sleepHours  ?? null;
        const water  = log?.waterLiters ?? null;
        const stepsV = log?.steps       ?? null;
        const loaded = (log?.meals ?? []).map((m: MealEntryDto, i: number) => mapDtoToEntry(m, i));

        setSleepHours(sleep);
        setWaterLiters(water);
        setSteps(stepsV);
        setMeals(loaded);
        setSavedLog(log ?? null);

        setSavedSnapshot({
          sleepHours: sleep, waterLiters: water, steps: stepsV,
          mealsKey: buildMealsKey(loaded),
        });
      } catch (err) {
        console.error('Failed to load health log:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLog();
  }, [date]);

  //  Date Change Handler
  const handleDateChange = (newDate: string) => {
    const selected = new Date(newDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selected > today) {
      toast.error("You cannot log meals for a future date.");
      return; // Do not update the date
    }

    if (subStartDate && newDate < subStartDate) {
      toast.error("You cannot log meals for a date before your subscription started.");
      return; // Do not update the date
    }

    setDate(newDate);
  };

  //  Save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await healthLogService.upsertHealthLog({
        date,
        sleepHours,
        waterLiters,
        steps,
        meals: meals
          .filter(m => m.categoryId && m.description)
          .map(m => ({ mealCategoryId: m.categoryId, description: m.description })),
      });

      const log = res.data;
      if (log) {
        const saved = (log.meals ?? []).map((m: MealEntryDto, i: number) => mapDtoToEntry(m, i));
        setMeals(saved);
        setSavedLog(log);
        setSavedSnapshot({
          sleepHours, waterLiters, steps, mealsKey: buildMealsKey(saved),
        });
        toast.success("Health log saved successfully");
      }
    } catch (err: unknown) {
      console.error('Failed to save health log:', err);
      toast.error(parseApiError(err).message);
    } finally {
      setIsSaving(false);
    }
  };

  //  Meal list mutations
  const handleAddMeal = () =>
    setMeals(prev => [
      ...prev,
      { id: `meal-${Date.now()}`, categoryId: '', description: '',
        estimatedCalories: 0, estimatedProtein: 0, estimatedCarbs: 0, estimatedFat: 0 },
    ]);

  const handleRemoveMeal = (id: string) =>
    setMeals(prev => prev.filter(m => m.id !== id));

  const handleMealChange = (id: string, field: keyof MealEntry, value: string | number) =>
    setMeals(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  //  Render
  return (
    <div className="max-w-5xl mx-auto text-white pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase">
          Daily Health Log
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Track your optional daily metrics and log your meals for AI nutritional estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/*  Left: Date + Metrics  */}
        <div className="space-y-6 lg:col-span-1">
          {/* Date */}
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-6 shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <label className="block text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wider">Log Date</label>
            <input
              type="date"
              value={date}
              min={subStartDate || undefined}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => handleDateChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Metrics */}
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-6 shadow-xl border border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Daily Metrics
            </h2>
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <Moon className="w-4 h-4 text-indigo-400" /> Sleep (Hours)
                </label>
                <StepperInput value={sleepHours} setter={setSleepHours} min={0} max={24} step={0.5} unitLabel="hr" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" /> Water (Liters)
                </label>
                <StepperInput value={waterLiters} setter={setWaterLiters} min={0} max={10} step={0.1} unitLabel="Liters" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Steps
                </label>
                <StepperInput value={steps} setter={setSteps} min={0} max={50000} step={500} unitLabel="Steps" />
              </div>
            </div>
          </div>
        </div>

        {/*  Right: Macro bar + Meals  */}
        <div className="lg:col-span-2 space-y-6">

          {/* Macro summary — values come from backend, never calculated here */}
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-6 shadow-xl border border-white/5 flex items-center justify-between gap-4 overflow-x-auto">
            {[
              { label: 'Calories', value: savedLog?.totalCalories, unit: 'kcal', color: 'text-amber-400'  },
              { label: 'Protein',  value: savedLog?.totalProtein,  unit: 'g',    color: 'text-purple-400' },
              { label: 'Carbs',    value: savedLog?.totalCarbs,    unit: 'g',    color: 'text-blue-400'   },
              { label: 'Fat',      value: savedLog?.totalFat,      unit: 'g',    color: 'text-rose-400'   },
            ].map((item, idx, arr) => (
              <>
                <div key={item.label}>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                  <p className={`text-2xl font-black ${item.color}`}>
                    {isLoading || isSaving ? '…' : (item.value ?? 0)}{' '}
                    <span className="text-sm font-medium text-slate-500">{item.unit}</span>
                  </p>
                </div>
                {idx < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
              </>
            ))}
          </div>

          {/* Meals list */}
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-6 sm:p-8 shadow-xl border border-white/5">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <h2 className="text-lg font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                <Utensils className="w-5 h-5" /> Meals Consumed
              </h2>
              <button
                onClick={handleAddMeal}
                className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full text-xs font-bold transition"
              >
                <Plus className="w-4 h-4" /> Add Meal
              </button>
            </div>

            <div className="space-y-6">
              {meals.length === 0 ? (
                <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <p className="text-slate-400 text-sm">No meals logged for today.</p>
                </div>
              ) : (
                meals.map(meal => (
                  <div key={meal.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative group">
                    <button
                      onClick={() => handleRemoveMeal(meal.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-500/10 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition hover:bg-red-500/20"
                      title="Remove Meal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pr-8">
                      {/* Category */}
                      <div className="md:col-span-1">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Category</label>
                        <select
                          value={meal.categoryId}
                          onChange={e => handleMealChange(meal.id, 'categoryId', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition appearance-none"
                        >
                          <option value="" disabled className="bg-slate-900 text-slate-400">Select Category</option>
                          {mealCategories.map((cat: MealCategory) => {
                            const takenByOther = meals.some(m => m.categoryId === cat.mealCategoryId && m.id !== meal.id);
                            return (
                              <option
                                key={cat.mealCategoryId}
                                value={cat.mealCategoryId}
                                className="bg-slate-900"
                                disabled={takenByOther}
                              >
                                {cat.title}{takenByOther ? ' (Selected)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">What did you eat?</label>
                        <input
                          type="text"
                          value={meal.description}
                          onChange={e => handleMealChange(meal.id, 'description', e.target.value)}
                          placeholder='e.g. "2 egg curry and 4 chappathi"'
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                        />
                      </div>
                    </div>

                    {/* AI Macro estimates — read-only, backend-sourced */}
                    {meal.description && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">AI Estimated</span>
                        </div>
                        <div className="flex gap-4 text-xs font-medium">
                          <span className="text-slate-300">Calories: <span className="text-amber-400">{meal.estimatedCalories}</span></span>
                          <span className="text-slate-300">Pro: <span className="text-purple-400">{meal.estimatedProtein}g</span></span>
                          <span className="text-slate-300">Carbs: <span className="text-blue-400">{meal.estimatedCarbs}g</span></span>
                          <span className="text-slate-300">Fat: <span className="text-rose-400">{meal.estimatedFat}g</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Save button — only visible when form is dirty */}
            {(isDirty || isSaving) && (
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-purple-600/20 transition flex items-center gap-2"
                >
                  {isSaving ? (
                    <><Activity className="w-4 h-4 animate-spin" /> Saving…</>
                  ) : 'Save Health Log'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserHealthLog;
