import { SetupContext } from "@vue/runtime-core";

export const TheContainer = (_: {}, { slots }: SetupContext) => (
  <div class="flex flex-col items-center">{slots?.default?.()}</div>
);
