<script setup lang="ts">
// Section tracker (same idea as the Playwright workshop deck):
// every slide sets `module: N` in its frontmatter; the bar shows where we are
// in the talk and tints the whole slide with that section's colour (--m).
import { computed, watchEffect } from 'vue'
import { useNav } from '@slidev/client'
import { SECTIONS } from './setup/sections'

const { currentSlideRoute, currentSlideNo, total } = useNav()
const fm = computed<any>(() => (currentSlideRoute.value as any)?.meta?.slide?.frontmatter ?? {})
const mod = computed<number | null>(() => (typeof fm.value.module === 'number' ? fm.value.module : null))
const info = computed(() => (mod.value === null ? null : SECTIONS[mod.value]))

watchEffect(() => {
  // --m-soft is derived from --m in style.css (separate light / dark tints)
  document.documentElement.style.setProperty('--m', info.value?.color ?? '#3b82f6')
})

const pct = computed(() => Math.round((currentSlideNo.value / total.value) * 100))
const hide = computed(() => fm.value.tracker === false)
</script>

<template>
  <div v-if="info && !hide" class="tracker">
    <div class="bar">
      <div
        v-for="(s, i) in SECTIONS" :key="i" class="seg"
        :title="s.name"
        :style="{ flex: s.weight, background: s.color, opacity: i === mod ? 1 : 0.25 }"
      />
    </div>
    <div class="row">
      <span class="name" :style="{ color: info.color }">{{ mod }} · {{ info.name }}</span>
      <span v-if="info.thai" class="thai">{{ info.thai }}</span>
      <span class="count">{{ currentSlideNo }} / {{ total }} · {{ pct }}%</span>
    </div>
  </div>
</template>

<style scoped>
.tracker { position: absolute; top: 0; left: 0; right: 0; z-index: 20; padding: 0.45rem 1.4rem 0; pointer-events: none; }
.bar { display: flex; gap: 4px; height: 7px; }
.seg { border-radius: 999px; transition: opacity 0.4s ease; }
.row { display: flex; gap: 0.9rem; font-size: 0.74rem; margin-top: 0.25rem; font-weight: 700; letter-spacing: 0.01em; }
.thai { color: var(--muted); font-weight: 500; }
.count { margin-left: auto; color: var(--muted); font-weight: 600; }
</style>
