<script lang="tsx" setup>
import { ref, watch } from "vue";
import { useReversi } from "../composable/useReversi";
import { TheBoard } from "./TheBoard";
import { TheContainer } from "./TheContainer";

const {
  col,
  row,
  boardRowList,
  currentMove,
  currentTurn,
  score,
  isFinished,
  init,
  setCell,
  turnNext,
  autoPlace,
} = useReversi({ w: 16, h: 16 });

init();

const autoMode = ref(false);

let handle = -1;
watch(autoMode, (val) => {
  if (val) {
    handle = setInterval(() => {
      const canNext = autoPlace();
      if (!canNext) {
        autoMode.value = false;
      }
    }, 1);
  } else {
    clearInterval(handle);
  }
});

export default () => (
  <TheContainer>
    <section>
      <p>turn: {currentTurn.value + 1}</p>
      <p>rest:{score.value.rest}</p>

      <p>
        col:
        <input
          type="range"
          value={col.value}
          onInput={(evt: Event) => {
            col.value = Number((evt.target as HTMLInputElement).value);
          }}
          min="1"
          max="64"
          step="1"
        />
        {col.value}
      </p>
      <p>
        row:
        <input
          type="range"
          value={row.value}
          onInput={(evt: Event) => {
            row.value = Number((evt.target as HTMLInputElement).value);
          }}
          min="1"
          max="64"
          step="1"
        />
        {row.value}
      </p>
    </section>

    <TheBoard>
      {boardRowList.value.map((row, y) => (
        <div key={y} class="flex flex-row gap-px">
          {row.map(({ placed, candidate }, x) => (
            <div class="w-4 h-4 flex items-center justify-center select-none bg-green-700">
              {placed ? (
                <div
                  key={`${y}:${x}`}
                  class={placed === "b" ? "text-black" : "text-white"}
                >
                  ●
                </div>
              ) : (
                candidate && (
                  <div
                    class="cursor-pointer w-full h-full bg-green-500 hover:bg-green-200"
                    onClick={() => {
                      setCell(x, y);
                    }}
                  ></div>
                )
              )}
            </div>
          ))}
        </div>
      ))}
    </TheBoard>

    <section class="flex gap-4 mt-2 items-center">
      <div
        class={`border-l-8 w-[64px] flex justify-center ${
          currentMove.value === "b" && "border-yellow-300"
        } ${
          isFinished.value && score.value.b >= score.value.w
            ? "bg-red-500 text-black"
            : "bg-black text-white"
        }`}
      >
        B:{score.value.b}
      </div>
      <div class="w-[200px] h-[16px] border bg-gray-100 relative">
        <div
          class="bg-black h-full"
          style={{
            width:
              Math.floor(
                (200 * score.value.b) / (score.value.b + score.value.w)
              ) + "px",
          }}
        ></div>
        <div class="absolute w-[2px] top-0 bottom-0 left-0 right-0 m-auto bg-gray-400"></div>
      </div>
      <div
        class={`border-r-8 w-[64px] flex justify-center ${
          currentMove.value !== "b" && "border-yellow-300"
        } ${
          isFinished.value && score.value.w >= score.value.b
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        W:{score.value.w}
      </div>
    </section>

    <section class="flex gap-4">
      <button class="p-2 border" onClick={() => turnNext()}>
        pass
      </button>
      <button class="p-2 border" onClick={() => init()}>
        init
      </button>
      <button
        class="p-2 border"
        onClick={() => (autoMode.value = !autoMode.value)}
      >
        auto: {autoMode.value ? "ON" : "OFF"}
      </button>
    </section>
  </TheContainer>
);
</script>
