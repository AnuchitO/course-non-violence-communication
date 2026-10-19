<script setup lang="ts">
// Answer card for the quick-quiz slides. Put v-click on it so it shows on the next click:
//   <QuizAnswer v-click type="obs" :pick="1" note="…" better="…">why…</QuizAnswer>
// type  → the two choices of the quiz:
//   obs  = Observation | Interpretation      feel = Feeling | Thinking
//   need = Need | How (strategy)             req  = Request | Command / Demand
// pick  → 0 = first choice, 1 = second choice
// note  → optional small qualifier next to the verdict (e.g. "too vague")
// better→ a better way to say it
import { computed } from 'vue'

const props = defineProps<{ type: 'obs' | 'feel' | 'need' | 'req'; pick: number | string; note?: string; better?: string }>()

const TYPES = {
  obs: { options: ['Observation', 'Interpretation'], tones: ['var(--c-obs)', 'var(--bad)'] },
  feel: { options: ['Feeling', 'Thinking'], tones: ['var(--c-feel)', 'var(--bad)'] },
  need: { options: ['Need', 'How (strategy)'], tones: ['var(--c-need)', 'var(--c-req)'] },
  req: { options: ['Request', 'Command / Demand'], tones: ['var(--good)', 'var(--bad)'] },
} as const

const cfg = computed(() => TYPES[props.type])
const idx = computed(() => Number(props.pick))
const tone = computed(() => cfg.value.tones[idx.value])
</script>

<template>
  <div class="qa" :style="{ '--tone': tone }">
    <div class="choices">
      <div
        v-for="(o, i) in cfg.options" :key="o" class="choice"
        :class="i === idx ? 'picked' : 'other'"
        :style="i === idx ? { background: cfg.tones[i] } : undefined"
      >
        <span class="mark">{{ i === idx ? '✓' : '✕' }}</span>{{ o }}
      </div>
      <span v-if="note" class="note">{{ note }}</span>
    </div>
    <div class="why"><span class="lbl">Why</span><span><slot /></span></div>
    <div v-if="better" class="better">
      <span class="lbl">Better way to say it</span>
      <span class="say">{{ better }}</span>
    </div>
  </div>
</template>

<style scoped>
.qa {
  margin: 1.1rem auto 0;
  max-width: 46rem;
  padding: 0.75rem 1rem 0.8rem;
  background: var(--card);
  border: 1px solid var(--rule);
  border-top: 5px solid var(--tone);
  border-radius: 18px;
  box-shadow: var(--shadow);
}
.choices { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.choice {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.32rem 0.95rem; border-radius: 999px;
  font-size: 1.15rem; font-weight: 800; letter-spacing: -0.01em;
}
.choice.picked { color: #fff; box-shadow: 0 4px 14px color-mix(in srgb, var(--tone) 40%, transparent); }
.choice.other {
  color: var(--muted); background: transparent; border: 1.5px dashed var(--rule);
  font-weight: 600; font-size: 0.95rem; text-decoration: line-through; opacity: 0.75;
}
.choice .mark { font-size: 0.9em; }
.note {
  font-size: 0.82rem; font-weight: 700; color: var(--tone);
  padding: 0.15rem 0.6rem; border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 12%, transparent);
}
.lbl {
  flex: none; width: 6.4rem; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted); padding-top: 0.2rem;
}
.why { display: flex; gap: 0.6rem; margin-top: 0.6rem; font-size: 0.98rem; line-height: 1.45; color: var(--ink); }
.why :deep(b) { color: var(--tone); }
.better {
  display: flex; gap: 0.6rem; align-items: baseline; margin-top: 0.55rem;
  padding: 0.5rem 0.75rem; border-radius: 12px;
  background: color-mix(in srgb, var(--good) 11%, var(--card));
  border: 1px solid color-mix(in srgb, var(--good) 35%, transparent);
}
.better .lbl { color: var(--good); width: 5.85rem; }
.better .say { font-family: var(--serif); font-size: 1.15rem; line-height: 1.35; color: var(--ink); }
</style>
