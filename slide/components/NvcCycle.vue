<script setup lang="ts">
// Observations → Feelings → Needs → Requests cycle diagram.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $page, $renderContext } = useSlideContext()
const play = computed(() =>
  $renderContext.value !== 'print'
  && $renderContext.value !== 'overview'
  && $slidev.nav.currentPage === $page.value,
)

const R = 150
const C = 200
const nodes = [
  { label: 'Observations', angle: 0, color: 'var(--nvc-amber)' },
  { label: 'Feelings', angle: 90, color: 'var(--nvc-teal)' },
  { label: 'Needs', angle: 180, color: 'var(--nvc-pink)' },
  { label: 'Requests', angle: 270, color: 'var(--nvc-purple)' },
].map((n, i) => {
  const rad = (n.angle * Math.PI) / 180
  const x = C + R * Math.sin(rad)
  const y = C - R * Math.cos(rad)
  const side = Math.round(Math.sin(rad))
  const lx = C + (R + (side ? 24 : 0)) * Math.sin(rad)
  const ly = C - (R + 30) * Math.cos(rad) + 7
  const anchor = side > 0 ? 'start' : side < 0 ? 'end' : 'middle'
  return { ...n, x, y, lx, ly, anchor, i }
})
const arrows = [45, 135, 225, 315].map((a) => {
  const rad = (a * Math.PI) / 180
  return { a, x: C + R * Math.sin(rad), y: C - R * Math.cos(rad) }
})
</script>

<template>
  <svg class="cycle" :class="{ play }" viewBox="-70 0 540 400">
    <circle class="ring" :cx="C" :cy="C" :r="R" />
    <g v-for="ar in arrows" :key="ar.a" class="arrow" :transform="`translate(${ar.x} ${ar.y}) rotate(${ar.a})`">
      <polygon points="-7,-7 7,0 -7,7" />
    </g>
    <text class="center" :x="C" :y="C + 12" text-anchor="middle">NVC</text>
    <g v-for="n in nodes" :key="n.label" class="node" :style="{ '--d': `${0.3 + n.i * 0.35}s` }">
      <circle :cx="n.x" :cy="n.y" r="11" :fill="n.color" />
      <text :x="n.lx" :y="n.ly" :text-anchor="n.anchor">{{ n.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cycle { width: 100%; height: 100%; overflow: visible; }
.ring {
  fill: none;
  stroke: var(--nvc-pink);
  stroke-width: 3;
  stroke-dasharray: 943;
  transform: rotate(-90deg);
  transform-origin: 200px 200px;
}
.arrow polygon { fill: var(--nvc-pink); }
.center { font-family: Bitter, serif; font-weight: 700; font-size: 36px; fill: var(--nvc-teal); }
.node text { font-size: 20px; font-weight: 600; fill: var(--nvc-ink); }

.play .ring { animation: ring-draw 1.6s ease-in-out both; }
.play .arrow { animation: fade .3s ease-out 1.5s both; }
.play .node { animation: node-in .5s cubic-bezier(.3,1.4,.5,1) var(--d) both; transform-box: fill-box; transform-origin: center; }
.play .center { animation: fade .6s ease-out .1s both; }

@keyframes ring-draw { from { stroke-dashoffset: 943; } to { stroke-dashoffset: 0; } }
@keyframes fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes node-in { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: none; } }
</style>
