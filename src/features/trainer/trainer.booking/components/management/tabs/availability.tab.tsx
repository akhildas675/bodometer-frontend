import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { trainerAvailabilityService } from "@/modules/booking/service/trainer-availability.service";
import {
  TrainerAvailability,
  TrainerScheduleSetupPayload,
  DaySchedule,
  TrainerBookingSettingsForm,
  CreateTrainerUnavailability,
} from "@/features/trainer/trainer.availability/types/trainer-availability.types";
import { CoachingListItem } from "@/modules/coaching/types/coaching.interface";
import { coachingService } from "@/modules/coaching/service/coaching.service";
import {
  validateTrainerAvailability,
  createDefaultWeeklySchedule,
  normalizeWeeklySchedule,
} from "@/features/trainer/trainer.availability/utils/trainer-availability.validator";
import { TrainerAvailabilityEditor } from "@/features/trainer/trainer.availability/components/trainer-availability.editor";
import { TrainerAvailabilityList } from "@/features/trainer/trainer.availability/components/trainer-availability.list";
import { TrainerAvailabilityDeleteModal } from "@/features/trainer/trainer.availability/components/trainer-availability.delete-modal";

import {
  AVAILABILITY_STATUS,
  ADVANCE_NOTICE_HOURS,
  BUFFER_TIME_MINUTES,
  MAX_BOOKING_LIMITS,
  TRAINER_AVAILABILITY_MESSAGES,
} from "@/constants/booking.constant";
import { TabSkeleton } from "./overview.tab";

const DEFAULT_BOOKING_RULES: TrainerBookingSettingsForm = {
  serviceIds: [],
  advanceNoticeHours: ADVANCE_NOTICE_HOURS.TWO,
  bufferMinutes: BUFFER_TIME_MINUTES.FIFTEEN,
  maximumBookingPerDay: MAX_BOOKING_LIMITS.EIGHT,
};

export const AvailabilityTab: React.FC = () => {
  const [view, setView] = useState<"list" | "editor">("list");
  const [loading, setLoading] = useState(true);

  const [availabilities, setAvailabilities] = useState<TrainerAvailability[]>([]);
  const [availableServices, setAvailableServices] = useState<CoachingListItem[]>([]);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);

  // Editor form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );
  const [effectiveUntil, setEffectiveUntil] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [timezone, setTimezone] = useState<string>(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
  );
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(
    createDefaultWeeklySchedule
  );
  const [bookingRules, setBookingRules] =
    useState<TrainerBookingSettingsForm>(DEFAULT_BOOKING_RULES);
  const [offeredServiceIds, setOfferedServiceIds] = useState<string[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<CreateTrainerUnavailability[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddUnavailability = (leave: CreateTrainerUnavailability) => {
    setUnavailabilities((prev) => [...prev, leave]);
  };

  const handleUpdateUnavailability = (index: number, updatedLeave: CreateTrainerUnavailability) => {
    setUnavailabilities((prev) =>
      prev.map((leave, i) => (i === index ? updatedLeave : leave))
    );
  };

  const handleRemoveUnavailability = async (index: number) => {
    const target = unavailabilities[index];
    if (target?.id) {
      try {
        await trainerAvailabilityService.cancelUnavailability(target.id);
        toast.success("Leave record removed.");
      } catch {
        toast.error("Failed to remove leave record.");
      }
    }
    setUnavailabilities((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    Promise.all([
      trainerAvailabilityService.getScheduleSetup().catch(() => null),
      trainerAvailabilityService.getAvailability().catch(() => null),
      coachingService.getCoachingServices().catch(() => null),
      trainerAvailabilityService.getUnavailabilities().catch(() => null),
    ]).then(([setupRes, availRes, svcRes, leavesRes]) => {
      if (setupRes?.data) {
        const setup = setupRes.data;
        if (setup.availability) {
          if (setup.availability.effectiveFrom) {
            setEffectiveFrom(new Date(setup.availability.effectiveFrom).toISOString().split("T")[0]);
          }
          if (setup.availability.effectiveUntil) {
            setEffectiveUntil(new Date(setup.availability.effectiveUntil).toISOString().split("T")[0]);
          }
          if (setup.availability.timeZone) {
            setTimezone(setup.availability.timeZone);
          }
          if (setup.availability.weeklySchedule) {
            setWeeklySchedule(normalizeWeeklySchedule(setup.availability.weeklySchedule));
          }
        }
        if (setup.settings) {
          setBookingRules({
            serviceIds: setup.settings.serviceIds || [],
            advanceNoticeHours: setup.settings.advanceNoticeHours,
            bufferMinutes: setup.settings.bufferMinutes,
            maximumBookingPerDay: setup.settings.maximumBookingPerDay,
          });
          if (setup.settings.serviceIds && setup.settings.serviceIds.length > 0) {
            setOfferedServiceIds(setup.settings.serviceIds);
          }
        }
      }

      if (leavesRes?.data && Array.isArray(leavesRes.data)) {
        setUnavailabilities(
          leavesRes.data.map((u) => ({
            id: u.id,
            type: u.type,
            startDate: new Date(u.startDate).toISOString().split("T")[0],
            endDate: new Date(u.endDate).toISOString().split("T")[0],
            reason: u.reason,
          }))
        );
      } else if (setupRes?.data?.unavailabilities) {
        setUnavailabilities(
          setupRes.data.unavailabilities.map((u) => ({
            id: u.id,
            type: u.type,
            startDate: new Date(u.startDate).toISOString().split("T")[0],
            endDate: new Date(u.endDate).toISOString().split("T")[0],
            reason: u.reason,
          }))
        );
      }

      let list: TrainerAvailability[] = [];

      if (availRes?.data && Array.isArray(availRes.data)) {
        list = availRes.data.map((a: TrainerAvailability) => ({
          ...a,
          weeklySchedule: normalizeWeeklySchedule(a.weeklySchedule),
        }));
      }

      if (list.length === 0 && setupRes?.data?.availability) {
        const setupAvail = setupRes.data.availability;
        list = [
          {
            id: "active-setup",
            trainerId: "",
            effectiveFrom: String(setupAvail.effectiveFrom),
            effectiveUntil: String(setupAvail.effectiveUntil),
            timeZone: setupAvail.timeZone,
            weeklySchedule: normalizeWeeklySchedule(setupAvail.weeklySchedule),
            status: (setupAvail.status || "ACTIVE") as TrainerAvailability["status"],
          },
        ];
      }

      setAvailabilities(list);

      if (svcRes?.data && Array.isArray(svcRes.data)) {
        setAvailableServices(svcRes.data);
      }
      setLoading(false);
    });
  }, []);

  const currentFormPayload = useMemo(
    () => ({
      id: editingId || undefined,
      effectiveFrom,
      effectiveUntil,
      timezone,
      weeklySchedule,
      bookingRules,
      offeredServiceIds,
      unavailabilities: unavailabilities.length > 0 ? unavailabilities : undefined,
    }),
    [editingId, effectiveFrom, effectiveUntil, timezone, weeklySchedule, bookingRules, offeredServiceIds, unavailabilities]
  );

  const validationResult = useMemo(
    () => validateTrainerAvailability(currentFormPayload, availabilities),
    [currentFormPayload, availabilities]
  );

  const openCreateForm = () => {
    setEditingId(null);
    setShowValidationErrors(false);
    setEffectiveFrom(new Date().toISOString().split("T")[0]);
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setEffectiveUntil(d.toISOString().split("T")[0]);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata");
    setWeeklySchedule(createDefaultWeeklySchedule());
    setBookingRules(DEFAULT_BOOKING_RULES);
    setUnavailabilities([]);
    
    setOfferedServiceIds([]);
    setView("editor");
  };

  const openEditForm = (item: TrainerAvailability) => {
    if (item.status?.toUpperCase() === "EXPIRED") {
      toast.error(TRAINER_AVAILABILITY_MESSAGES.ERROR.EXPIRED_CANNOT_EDIT);
      return;
    }
    setShowValidationErrors(false);
    setEditingId(item.id);
    if (item.effectiveFrom) {
      setEffectiveFrom(new Date(item.effectiveFrom).toISOString().split("T")[0]);
    }
    if (item.effectiveUntil) {
      setEffectiveUntil(new Date(item.effectiveUntil).toISOString().split("T")[0]);
    }
    setTimezone(item.timeZone || "Asia/Kolkata");
    if (item.weeklySchedule) {
      setWeeklySchedule(normalizeWeeklySchedule(item.weeklySchedule));
    }
    if (offeredServiceIds.length === 0) {
      const allIds = availableServices
        .map((s) => s._id || s.coachingId || s.serviceId || s.serviceType)
        .filter(Boolean) as string[];
      setOfferedServiceIds(allIds);
    }
    setView("editor");
  };

  const handlePublishClick = async () => {
    console.log("📦 PUBLISH BUTTON CLICKED - Form Payload:", currentFormPayload);
    if (!validationResult.isValid) {
      setShowValidationErrors(true);
      toast.error(TRAINER_AVAILABILITY_MESSAGES.ERROR.VALIDATION_FAILED);
      return;
    }
    if (offeredServiceIds.length === 0) {
      setShowValidationErrors(true);
      toast.error(TRAINER_AVAILABILITY_MESSAGES.ERROR.SERVICE_REQUIRED);
      return;
    }

    const payload: TrainerScheduleSetupPayload = {
      availability: {
        effectiveFrom: new Date(effectiveFrom).toISOString(),
        effectiveUntil: new Date(effectiveUntil).toISOString(),
        timeZone: timezone,
        weeklySchedule: normalizeWeeklySchedule(weeklySchedule),
        status: AVAILABILITY_STATUS.ACTIVE,
      },
      settings: {
        serviceIds: offeredServiceIds,
        advanceNoticeHours: bookingRules.advanceNoticeHours,
        bufferMinutes: bookingRules.bufferMinutes,
        maximumBookingPerDay: bookingRules.maximumBookingPerDay,
      },
      unavailabilities: unavailabilities.length > 0 ? unavailabilities : undefined,
    };

    try {
      if (editingId) {
        const updateTasks: Promise<unknown>[] = [
          trainerAvailabilityService.updateAvailability({
            effectiveFrom: new Date(effectiveFrom).toISOString(),
            effectiveUntil: new Date(effectiveUntil).toISOString(),
            timeZone: timezone,
            weeklySchedule: normalizeWeeklySchedule(weeklySchedule),
            status: AVAILABILITY_STATUS.ACTIVE,
          }),
          trainerAvailabilityService.updateBookingSettings({
            serviceIds: offeredServiceIds,
            advanceNoticeHours: bookingRules.advanceNoticeHours,
            bufferMinutes: bookingRules.bufferMinutes,
            maximumBookingPerDay: bookingRules.maximumBookingPerDay,
          }),
        ];

        // Save any newly added draft leaves that don't have an ID yet
        unavailabilities.forEach((leave) => {
          if (!leave.id) {
            updateTasks.push(
              trainerAvailabilityService.createUnavailability({
                type: leave.type,
                startDate: leave.startDate,
                endDate: leave.endDate,
                reason: leave.reason,
              })
            );
          }
        });

        await Promise.all(updateTasks);
        toast.success(TRAINER_AVAILABILITY_MESSAGES.SUCCESS.UPDATED);
      } else {
        await trainerAvailabilityService.saveScheduleSetup(payload);
        toast.success(TRAINER_AVAILABILITY_MESSAGES.SUCCESS.PUBLISHED);
      }

      const freshSetup = await trainerAvailabilityService.getScheduleSetup().catch(() => null);
      if (freshSetup?.data?.availability) {
        const item = freshSetup.data.availability as unknown as {
          id?: string;
          trainerId?: string;
          effectiveFrom: string;
          effectiveUntil: string;
          timeZone: string;
          status?: (typeof AVAILABILITY_STATUS)[keyof typeof AVAILABILITY_STATUS];
          createdAt?: string;
          updatedAt?: string;
          weeklySchedule: DaySchedule[];
        };
        setAvailabilities([
          {
            id: item.id || "availability_1",
            trainerId: item.trainerId || "",
            effectiveFrom: item.effectiveFrom,
            effectiveUntil: item.effectiveUntil,
            timeZone: item.timeZone,
            status: item.status || AVAILABILITY_STATUS.ACTIVE,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            weeklySchedule: item.weeklySchedule,
          },
        ]);
      }
      setView("list");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string; errors?: Record<string, string> } };
        message?: string;
      };
      const detailMsg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).join(" | ")
        : err.response?.data?.message || err.message || TRAINER_AVAILABILITY_MESSAGES.ERROR.SAVE_AVAILABILITY_FAILED;
      toast.error(detailMsg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await trainerAvailabilityService.deleteAvailability(id);
      toast.success(res.message || TRAINER_AVAILABILITY_MESSAGES.SUCCESS.DELETED);
      setAvailabilities((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ||
          TRAINER_AVAILABILITY_MESSAGES.ERROR.DELETE_SCHEDULE_FAILED
      );
    }
  };

  if (loading) return <TabSkeleton rows={3} />;

  return (
    <>
      {view === "list" && (
        <TrainerAvailabilityList
          availabilities={availabilities}
          selectedAvailabilityId={selectedAvailabilityId}
          onSelectAvailability={(id) => setSelectedAvailabilityId(id)}
          onOpenCreateForm={openCreateForm}
          onOpenEditForm={openEditForm}
          onDeletePrompt={(id) => setDeleteConfirmId(id)}
        />
      )}

      {view === "editor" && (
        <TrainerAvailabilityEditor
          editingId={editingId}
          effectiveFrom={effectiveFrom}
          setEffectiveFrom={setEffectiveFrom}
          effectiveUntil={effectiveUntil}
          setEffectiveUntil={setEffectiveUntil}
          timezone={timezone}
          setTimezone={setTimezone}
          weeklySchedule={weeklySchedule}
          setWeeklySchedule={setWeeklySchedule}
          bookingRules={bookingRules}
          setBookingRules={setBookingRules}
          offeredServiceIds={offeredServiceIds}
          setOfferedServiceIds={setOfferedServiceIds}
          availableServices={availableServices}
          unavailabilities={unavailabilities}
          onAddUnavailability={handleAddUnavailability}
          onUpdateUnavailability={handleUpdateUnavailability}
          onRemoveUnavailability={handleRemoveUnavailability}
          validationResult={validationResult}
          showValidationErrors={showValidationErrors}
          onPublishAll={handlePublishClick}
          onCancel={() => {
            setShowValidationErrors(false);
            setView("list");
          }}
        />
      )}

      <TrainerAvailabilityDeleteModal
        deleteConfirmId={deleteConfirmId}
        onCancel={() => setDeleteConfirmId(null)}
        onConfirmDelete={handleDelete}
      />
    </>
  );
};
