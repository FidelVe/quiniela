"use client";

import { createContext, useContext, useActionState } from "react";
import type { ActionState } from "@/app/admin/matches/[id]/actions";

type Ctx = { state: ActionState; isPending: boolean };

const FormStateCtx = createContext<Ctx>({ state: null, isPending: false });

export function useSaveFormState(): Ctx {
  return useContext(FormStateCtx);
}

type SaveAction = (
  prev: ActionState,
  formData: FormData
) => Promise<ActionState>;

export function SaveForm({
  action,
  children,
  className,
}: {
  action: SaveAction;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    null
  );
  return (
    <FormStateCtx.Provider value={{ state, isPending }}>
      <form action={formAction} className={className}>
        {children}
      </form>
    </FormStateCtx.Provider>
  );
}
