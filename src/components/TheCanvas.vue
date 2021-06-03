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

    <section class="flex gap-4">
      <div
        class={`${
          currentMove.value === "b" && "border-b-4 border-black"
        } w-[100px] flex justify-center`}
      >
        B: {score.value.b}
      </div>
      <meter
        min="0"
        max={score.value.b + score.value.w}
        value={score.value.b}
        class="w-[200px] h-[30px]"
      />
      <div
        class={`${
          currentMove.value !== "b" && "border-b-4 border-black"
        } w-[100px] flex justify-center`}
      >
        W: {score.value.w}
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
