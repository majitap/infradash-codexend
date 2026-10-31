"use client";

import { useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { initialCompleted, upgrade, upgradeTotal } from "@/lib/mock-data";

const key = "infradash-codexend:upgrade:v1";
const eventName = "infradash-upgrade-progress";
const initial = JSON.stringify(initialCompleted);
const allowed = new Set(
  upgrade.phases.flatMap((phase) => phase.items.map((item) => item.id)),
);
let memory: string | null = null;
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
function snapshot() {
  try {
    return window.localStorage.getItem(key) ?? memory ?? initial;
  } catch {
    return memory ?? initial;
  }
}
function save(value: string) {
  memory = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    toast.info(
      "브라우저 저장 공간을 사용할 수 없어 이번 세션에만 진행 상태를 저장했어요.",
    );
  }
  window.dispatchEvent(new Event(eventName));
}
export function useUpgradeProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => initial);
  const completed = useMemo<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? Array.from(
            new Set(
              parsed.filter(
                (id): id is string => typeof id === "string" && allowed.has(id),
              ),
            ),
          )
        : initialCompleted;
    } catch {
      return initialCompleted;
    }
  }, [raw]);
  return {
    completed,
    percent: Math.round((completed.length / upgradeTotal) * 100),
    toggle: (id: string) => {
      if (!allowed.has(id)) return;
      save(
        JSON.stringify(
          completed.includes(id)
            ? completed.filter((value) => value !== id)
            : [...completed, id],
        ),
      );
    },
    reset: () => {
      save(initial);
      toast.success("체크리스트를 데모 초기 상태로 되돌렸어요.");
    },
  };
}
