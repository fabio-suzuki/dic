import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  Draft,
  MeasurementDraftValues,
  MeasurementKey,
  MeasurementRecord,
  MeasurementValues,
  Profile,
} from '../types/measurements';
import { brToIso, formatDateBr, parseMetric, todayIso } from '../lib/calculations';
import {
  clearDraft,
  DEFAULT_PROFILE,
  loadDraft,
  loadProfile,
  loadRecords,
  saveDraft,
  saveProfile,
  saveRecords,
} from '../lib/storage';

const AUTOSAVE_DELAY_MS = 400;

function emptyDraft(): Draft {
  return { date: formatDateBr(todayIso()), values: {}, note: '', savedAt: 0 };
}

interface MeasurementsContextValue {
  ready: boolean;
  records: MeasurementRecord[];
  profile: Profile;
  draft: Draft;
  draftSavedAt: number;
  updateDraftValue: (key: MeasurementKey, text: string) => void;
  updateDraftDate: (date: string) => void;
  updateDraftNote: (note: string) => void;
  resetDraft: () => void;
  editRecord: (id: string) => void;
  commitDraft: () => MeasurementRecord | null;
  deleteRecord: (id: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  latestRecord?: MeasurementRecord;
}

const MeasurementsContext = createContext<MeasurementsContextValue | undefined>(undefined);

export function MeasurementsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [draftSavedAt, setDraftSavedAt] = useState(0);

  const draftRef = useRef(draft);
  draftRef.current = draft;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [storedRecords, storedProfile, storedDraft] = await Promise.all([
        loadRecords(),
        loadProfile(),
        loadDraft(),
      ]);
      if (!active) return;
      setRecords(storedRecords);
      setProfile(storedProfile);
      if (storedDraft) {
        setDraft(storedDraft);
        setDraftSavedAt(storedDraft.savedAt);
      }
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const flushDraft = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const savedAt = Date.now();
    await saveDraft({ ...draftRef.current, savedAt });
    setDraftSavedAt(savedAt);
  }, []);

  /** Agenda a gravação do rascunho — nada digitado se perde ao sair da tela ou do app. */
  const scheduleSave = useCallback(
    (next: Draft) => {
      draftRef.current = next;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flushDraft();
      }, AUTOSAVE_DELAY_MS);
    },
    [flushDraft]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') void flushDraft();
    });
    return () => {
      subscription.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flushDraft]);

  const updateDraftValue = useCallback(
    (key: MeasurementKey, text: string) => {
      setDraft((current) => {
        const values: MeasurementDraftValues = { ...current.values, [key]: text };
        if (text.length === 0) delete values[key];
        const next = { ...current, values };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const updateDraftDate = useCallback(
    (date: string) => {
      setDraft((current) => {
        const next = { ...current, date };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const updateDraftNote = useCallback(
    (note: string) => {
      setDraft((current) => {
        const next = { ...current, note };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const resetDraft = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = emptyDraft();
    setDraft(next);
    draftRef.current = next;
    setDraftSavedAt(0);
    void clearDraft();
  }, []);

  const editRecord = useCallback(
    (id: string) => {
      const record = records.find((r) => r.id === id);
      if (!record) return;
      const values: MeasurementDraftValues = {};
      (Object.keys(record.values) as MeasurementKey[]).forEach((key) => {
        const value = record.values[key];
        if (value !== undefined) values[key] = String(value).replace('.', ',');
      });
      const next: Draft = {
        editingId: record.id,
        date: formatDateBr(record.date),
        values,
        note: record.note ?? '',
        savedAt: Date.now(),
      };
      setDraft(next);
      scheduleSave(next);
    },
    [records, scheduleSave]
  );

  const persistRecords = useCallback((next: MeasurementRecord[]) => {
    const sorted = [...next].sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt
    );
    setRecords(sorted);
    void saveRecords(sorted);
    return sorted;
  }, []);

  const commitDraft = useCallback((): MeasurementRecord | null => {
    const current = draftRef.current;
    const values: MeasurementValues = {};
    (Object.keys(current.values) as MeasurementKey[]).forEach((key) => {
      const parsed = parseMetric(current.values[key]);
      if (parsed !== undefined) values[key] = parsed;
    });
    if (Object.keys(values).length === 0) return null;

    const existing = current.editingId
      ? records.find((r) => r.id === current.editingId)
      : undefined;
    const record: MeasurementRecord = {
      id: existing?.id ?? `${Date.now()}`,
      date: brToIso(current.date) ?? existing?.date ?? todayIso(),
      createdAt: existing?.createdAt ?? Date.now(),
      values,
      note: current.note.trim() || undefined,
    };
    persistRecords([...records.filter((r) => r.id !== record.id), record]);
    resetDraft();
    return record;
  }, [persistRecords, records, resetDraft]);

  const deleteRecord = useCallback(
    (id: string) => {
      persistRecords(records.filter((r) => r.id !== id));
    },
    [persistRecords, records]
  );

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((current) => {
      const next = { ...current, ...patch };
      void saveProfile(next);
      return next;
    });
  }, []);

  const latestRecord = useMemo(
    () =>
      [...records].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)[0],
    [records]
  );

  const value: MeasurementsContextValue = {
    ready,
    records,
    profile,
    draft,
    draftSavedAt,
    updateDraftValue,
    updateDraftDate,
    updateDraftNote,
    resetDraft,
    editRecord,
    commitDraft,
    deleteRecord,
    updateProfile,
    latestRecord,
  };

  return <MeasurementsContext.Provider value={value}>{children}</MeasurementsContext.Provider>;
}

export function useMeasurements(): MeasurementsContextValue {
  const context = useContext(MeasurementsContext);
  if (!context) throw new Error('useMeasurements deve ser usado dentro de MeasurementsProvider');
  return context;
}
