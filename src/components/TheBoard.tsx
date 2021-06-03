import { SetupContext } from "@vue/runtime-core";

export const TheBoard = (_: {}, { slots }: SetupContext) => (
  <div class="flex flex-col gap-px p-4 bg-green-900">{slots?.default?.()}</div>
);
