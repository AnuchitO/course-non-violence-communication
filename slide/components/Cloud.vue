<script setup lang="ts">
// Thought-bubble ("cloud callout") used in the Send/Receive signal diagrams.
withDefaults(defineProps<{ tail?: 'left' | 'right' }>(), { tail: 'left' })

const puffs = [
  [58, 70, 34], [98, 50, 38], [146, 52, 36], [184, 78, 30],
  [158, 104, 32], [112, 112, 34], [64, 104, 30], [34, 86, 24],
]
</script>

<template>
  <div class="cloud">
    <svg viewBox="0 0 220 180" class="cloud-svg" aria-hidden="true">
      <g class="cloud-outline">
        <circle v-for="(p, i) in puffs" :key="'o' + i" :cx="p[0]" :cy="p[1]" :r="p[2]" />
      </g>
      <g class="cloud-fill">
        <circle v-for="(p, i) in puffs" :key="'f' + i" :cx="p[0]" :cy="p[1]" :r="p[2]" />
      </g>
      <g class="cloud-tail" :transform="tail === 'right' ? 'translate(220 0) scale(-1 1)' : ''">
        <circle cx="70" cy="152" r="9" />
        <circle cx="58" cy="166" r="6" />
        <circle cx="50" cy="176" r="3.5" />
      </g>
    </svg>
    <div class="cloud-text"><slot /></div>
  </div>
</template>

<style scoped>
.cloud {
  position: relative;
  width: 100%;
  aspect-ratio: 220 / 180;
}
.cloud-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 6px 14px rgba(0, 61, 79, 0.12));
}
.cloud-outline circle,
.cloud-tail circle {
  fill: #fff;
  stroke: #9aa9ae;
  stroke-width: 5;
}
.cloud-fill circle {
  fill: #fff;
}
.cloud-text {
  position: absolute;
  left: 14%;
  right: 10%;
  top: 14%;
  height: 58%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  line-height: 1.25;
  color: var(--nvc-ink);
  font-weight: 500;
}
</style>
