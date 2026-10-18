<script setup lang="ts">
// Faux feelings → the real feelings and needs behind them.
// Redrawn as live text (was a screenshot) from:
// http://compassionateinteractions.com/resources/index.php?content=faux
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const SOURCE = 'http://compassionateinteractions.com/resources/index.php?content=faux'

const rows: [string, string, string][] = [
  ['Abandoned', 'Terrified, Hurt, Bewildered, Sad, Frightened, Lonely', 'Nurturing, Connection, Belonging, Support, Caring'],
  ['Abused', 'Angry, Frustrated, Frightened', 'Caring, Nurturing, Support, Well-being'],
  ['(Not) accepted', 'Upset, Scared, Lonely', 'Inclusion, Connection, Community, Belonging'],
  ['Attacked', 'Scared, Angry', 'Safety'],
  ['Belittled', 'Angry, Frustrated, Tense, Distressed', 'Respect, Autonomy, To Be Seen, Acknowledgment'],
  ['Betrayed', 'Angry, Hurt, Disappointed, Enraged', 'Trust, Dependability, Honesty, Honor'],
  ['Blamed', 'Angry, Scared, Confused, Antagonistic, Hostile', 'Accountability, Causality, Fairness, Justice'],
  ['Bullied', 'Angry, Scared, Pressured', 'Autonomy, Choice, Safety, Consideration'],
  ['Cheated', 'Resentful, Hurt, Angry', 'Honesty, Fairness, Justice, Trust, Reliability'],
  ['Coerced', 'Angry, Frustrated, Frightened, Thwarted, Scared', 'Choice, Autonomy, Freedom, Act Freely'],
]

const { $slidev, $page, $renderContext } = useSlideContext()
const play = computed(() =>
  $renderContext.value !== 'print'
  && $renderContext.value !== 'overview'
  && $slidev.nav.currentPage === $page.value,
)
</script>

<template>
  <div class="ff" :class="{ play }">
    <table>
      <thead>
        <tr>
          <th class="h-faux">Faux feelings</th>
          <th class="h-feel">Feelings</th>
          <th class="h-need">Needs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="r[0]" :style="{ '--i': i }">
          <td class="faux">{{ r[0] }}</td>
          <td class="feel">{{ r[1] }}</td>
          <td class="need">{{ r[2] }}</td>
        </tr>
      </tbody>
    </table>
    <div class="src">
      Source: <a :href="SOURCE" target="_blank" rel="noopener">{{ SOURCE }}</a>
    </div>
  </div>
</template>

<style scoped>
.ff {
  position: absolute;
  inset: 2.7rem 2.4rem 1.5rem;
  display: flex;
  flex-direction: column;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--card);
  border: 1px solid var(--rule);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  font-size: 0.93rem;
  line-height: 1.32;
}
th {
  text-align: left;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.6rem 1.1rem;
  border-bottom: 2px solid var(--rule);
}
.h-faux { color: var(--bad); }
.h-feel { color: var(--c-feel); }
.h-need { color: var(--c-need); }
td {
  padding: 0.4rem 1.1rem;
  vertical-align: top;
  border-bottom: 1px solid var(--rule);
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:nth-child(odd) td { background: color-mix(in srgb, var(--m) 6%, transparent); }
td.faux { font-weight: 800; width: 17%; white-space: nowrap; color: var(--ink); }
td.feel { width: 41%; color: color-mix(in srgb, var(--c-feel) 70%, var(--ink)); }
td.need { color: color-mix(in srgb, var(--c-need) 55%, var(--ink)); }
.src {
  margin-top: 0.7rem;
  font-size: 0.62rem;
  color: var(--muted);
  text-align: center;
}
.src a { color: var(--m); border-bottom: 1px dashed currentColor; }

.play tbody tr { animation: ff-in .45s ease-out both; animation-delay: calc(var(--i) * 70ms + 150ms); }
@keyframes ff-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
</style>
