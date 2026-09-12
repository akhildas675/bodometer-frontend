import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, UtensilsCrossed, Calendar as CalendarIcon, Flame, Droplets, Target, Loader2, Sparkles, Clock } from 'lucide-react';
import { DietPlanService } from '../../../../modules/diet-plan/service/diet-plan.service';
import { GetDietPlansResponseDto } from '../../../../modules/diet-plan/types/diet-plan.types';
import { toast } from 'sonner';

export const UserDietPlans: React.FC = () => {
  const [plansData, setPlansData] = useState<GetDietPlansResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isPlanExpanded, setIsPlanExpanded] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await DietPlanService.getDietPlans();
      setPlansData(res.data);
      if (res.data.plans.length > 0) {
        const activePlan = res.data.plans.find(p => p.status === 'active') || res.data.plans[0];
        if (activePlan && activePlan.days.length > 0) {
          setExpandedDay(activePlan.days[0].dayNumber);
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching diet plans:', error);
      toast.error((error as Error).message || 'Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await DietPlanService.generateDietPlan();
      toast.success(res.message || 'Diet plan generated successfully!');
      fetchPlans();
    } catch (error: unknown) {
      console.error('Error generating diet plan:', error);
      toast.error((error as Error).message || 'Failed to generate diet plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  const plans = plansData?.plans || [];
  const activePlan = plans.find(p => p.status === 'active');

  return (
    <div className="max-w-7xl mx-auto text-white w-full px-4 md:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-black uppercase tracking-wide bg-linear-to-r from-white to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <UtensilsCrossed className="w-8 h-8 text-purple-400" />
              Diet Plans
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border bg-purple-500/20 text-purple-300 border-purple-500/40">
              ✦ Premium
            </span>
          </div>
          <p className="text-white/50 text-sm mt-1">
            AI-personalized weekly diet plans based on your fitness profile and goals.
          </p>
        </div>

        {plans.length > 0 && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={generating || !plansData?.canGenerate}
              className={`inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all ${
                generating || !plansData?.canGenerate
                  ? "bg-purple-950/40 border border-purple-500/30 text-purple-300 cursor-not-allowed"
                  : "bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02]"
              }`}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : !plansData?.canGenerate ? (
                <>
                  <Clock className="w-4 h-4" />
                  Complete current plan
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Diet Plan
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {!activePlan ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-linear-to-b from-[#140b3a] to-[#0a0624] rounded-3xl border border-white/5 p-8 text-center">
          <UtensilsCrossed className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Active Diet Plan</h3>
          <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
            Generate your first AI-personalized weekly diet plan based on your fitness profile and goals.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02]"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generating ? "Generating..." : "Generate AI Diet Plan"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-linear-to-br from-[#140b3a] to-[#0a0624] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <button 
              onClick={() => setIsPlanExpanded(!isPlanExpanded)}
              className="w-full p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/2 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 border border-purple-500/30 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
                    Week 1 Diet Plan
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </h3>
                </div>
              </div>
              {isPlanExpanded ? (
                <ChevronUp className="w-5 h-5 text-white/40" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              )}
            </button>

            {isPlanExpanded && (
              <div className="divide-y divide-white/5">
              {activePlan.days.map((day) => (
                <div key={day.dayNumber} className="group">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.dayNumber ? null : day.dayNumber)}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/2 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        expandedDay === day.dayNumber 
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                          : "bg-white/5 text-white/70 group-hover:bg-white/10"
                      }`}>
                        D{day.dayNumber}
                      </div>
                      <div className="text-left">
                        <h4 className={`font-bold transition-colors ${
                          expandedDay === day.dayNumber ? "text-white" : "text-white/80 group-hover:text-white"
                        }`}>
                          {day.day}
                        </h4>
                        <div className="flex items-center gap-3 text-xs font-medium text-white/50 mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20">
                            <Flame className="w-3 h-3" /> {day.calories} kcal
                          </span>
                          <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md border border-blue-500/20">
                            <Target className="w-3 h-3" /> P: {day.protein}g
                          </span>
                          <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-md border border-yellow-500/20">
                            <Droplets className="w-3 h-3" /> F: {day.fats}g
                          </span>
                          <span className="flex items-center gap-1.5 bg-white/5 text-white/60 px-2 py-0.5 rounded-md border border-white/10">
                            C: {day.carbs}g
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedDay === day.dayNumber ? (
                      <ChevronUp className="w-5 h-5 text-white/40" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                    )}
                  </button>

                  {expandedDay === day.dayNumber && (
                    <div className="p-6 pt-0 bg-black/20">
                      <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
                        <h5 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <UtensilsCrossed className="w-3 h-3" />
                          Recommended Foods Note
                        </h5>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {day.recommendedFoods || "Focus on hitting your daily macro targets with whole foods."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
