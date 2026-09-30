"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { emptyData, loadData, saveData } from "./clientStore";
import type { AppData } from "./types";

export type SetAppData = Dispatch<SetStateAction<AppData>>;

export function useAppData(): { data: AppData; setData: SetAppData; hydrated: boolean } {
  const [data, setData] = useState<AppData>(() => emptyData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage doesn't exist during the static prerender; hydrate once mounted
    // in the browser so the prerendered (empty) markup matches on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveData(data);
  }, [data, hydrated]);

  return { data, setData, hydrated };
}
