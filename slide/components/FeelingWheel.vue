<script setup lang="ts">
// Feelings wheel, redrawn as SVG so it is sharp at any size.
// Words transcribed from the original image used in the deck:
// https://i.pinimg.com/originals/11/01/73/1101739e7f0b286c5b516e4a48a385f2.jpg
// Structure: core feeling → middle-ring feelings → 2 outer-ring words each.
//
// Interactive (for presenting):
//   • hover any word → it and its path (core › middle › outer) light up, the rest
//     fades, and the word is shown large in the side panel
//   • click any word → zoom into that whole category; click again (or Esc) to reset
//
//   • search box (EN or ไทย, with autocomplete): matches light up as you type;
//     pick a result to pin it, zoom to its category and show it in the side panel
//   • EN / ไทย button (top right of the wheel) switches the language;
//     in Thai the side panel also shows the English word.
// <FeelingWheel lang="th" /> starts in Thai.
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = withDefaults(defineProps<{ lang?: 'en' | 'th' }>(), { lang: 'en' })

type Core = { name: string; color: string; mid: [string, [string, string]][] }

// clockwise from 12 o'clock
const WHEEL: Core[] = [
  { name: 'Fearful', color: '#f6c35b', mid: [
    ['Scared', ['Helpless', 'Frightened']],
    ['Anxious', ['Overwhelmed', 'Worried']],
    ['Insecure', ['Inadequate', 'Inferior']],
    ['Weak', ['Worthless', 'Insignificant']],
    ['Rejected', ['Excluded', 'Persecuted']],
    ['Threatened', ['Nervous', 'Exposed']],
  ] },
  { name: 'Angry', color: '#f2737c', mid: [
    ['Let down', ['Betrayed', 'Resentful']],
    ['Humiliated', ['Disrespected', 'Ridiculed']],
    ['Bitter', ['Indignant', 'Violated']],
    ['Mad', ['Furious', 'Jealous']],
    ['Aggressive', ['Provoked', 'Hostile']],
    ['Frustrated', ['Infuriated', 'Annoyed']],
    ['Distant', ['Withdrawn', 'Numb']],
    ['Critical', ['Sceptical', 'Dismissive']],
  ] },
  { name: 'Disgusted', color: '#949cab', mid: [
    ['Disapproving', ['Judgmental', 'Embarrassed']],
    ['Disappointed', ['Appalled', 'Revolted']],
    ['Awful', ['Nauseated', 'Detestable']],
    ['Repelled', ['Horrified', 'Hesitant']],
  ] },
  { name: 'Sad', color: '#6ea8e2', mid: [
    ['Hurt', ['Embarrassed', 'Disappointed']],
    ['Depressed', ['Inferior', 'Empty']],
    ['Guilty', ['Remorseful', 'Ashamed']],
    ['Despair', ['Powerless', 'Grief']],
    ['Vulnerable', ['Fragile', 'Victimised']],
    ['Lonely', ['Abandoned', 'Isolated']],
  ] },
  { name: 'Happy', color: '#f2df5c', mid: [
    ['Optimistic', ['Inspired', 'Hopeful']],
    ['Trusting', ['Intimate', 'Sensitive']],
    ['Peaceful', ['Thankful', 'Loving']],
    ['Powerful', ['Creative', 'Courageous']],
    ['Accepted', ['Valued', 'Respected']],
    ['Proud', ['Confident', 'Successful']],
    ['Interested', ['Inquisitive', 'Curious']],
    ['Content', ['Joyful', 'Free']],
    ['Playful', ['Cheeky', 'Aroused']],
  ] },
  { name: 'Surprised', color: '#ab8ddb', mid: [
    ['Excited', ['Energetic', 'Eager']],
    ['Amazed', ['Awe', 'Astonished']],
    ['Confused', ['Perplexed', 'Disillusioned']],
    ['Startled', ['Dismayed', 'Shocked']],
  ] },
  { name: 'Bad', color: '#5cc59c', mid: [
    ['Tired', ['Unfocussed', 'Sleepy']],
    ['Stressed', ['Out of control', 'Overwhelmed']],
    ['Busy', ['Rushed', 'Pressured']],
    ['Bored', ['Apathetic', 'Indifferent']],
  ] },
]

// Thai wording — everyday feeling words (ภาษาที่ใช้พูดถึงความรู้สึกจริง ๆ),
// the same English word always maps to the same Thai word.
const TH: Record<string, string> = {
  // core
  'Fearful': 'กลัว', 'Angry': 'โกรธ', 'Disgusted': 'รังเกียจ', 'Sad': 'เศร้า',
  'Happy': 'มีความสุข', 'Surprised': 'ประหลาดใจ', 'Bad': 'รู้สึกแย่',
  // Fearful
  'Scared': 'หวาดกลัว', 'Helpless': 'หมดหนทาง', 'Frightened': 'ตกใจกลัว',
  'Anxious': 'วิตกกังวล', 'Overwhelmed': 'รับมือไม่ไหว', 'Worried': 'กังวลใจ',
  'Insecure': 'ไม่มั่นคง', 'Inadequate': 'ไม่ดีพอ', 'Inferior': 'ต่ำต้อย',
  'Weak': 'อ่อนแอ', 'Worthless': 'ไร้ค่า', 'Insignificant': 'ไม่สำคัญ',
  'Rejected': 'ถูกปฏิเสธ', 'Excluded': 'ถูกกีดกัน', 'Persecuted': 'ถูกข่มเหง',
  'Threatened': 'ถูกคุกคาม', 'Nervous': 'ประหม่า', 'Exposed': 'ถูกเปิดโปง',
  // Angry
  'Let down': 'เสียความรู้สึก', 'Betrayed': 'ถูกหักหลัง', 'Resentful': 'ขุ่นเคือง',
  'Humiliated': 'ขายหน้า', 'Disrespected': 'ถูกดูหมิ่น', 'Ridiculed': 'ถูกเยาะเย้ย',
  'Bitter': 'ขมขื่น', 'Indignant': 'คับแค้นใจ', 'Violated': 'ถูกล่วงละเมิด',
  'Mad': 'โมโห', 'Furious': 'โกรธจัด', 'Jealous': 'อิจฉา',
  'Aggressive': 'ก้าวร้าว', 'Provoked': 'ถูกยั่วยุ', 'Hostile': 'เป็นปฏิปักษ์',
  'Frustrated': 'หงุดหงิด', 'Infuriated': 'เดือดดาล', 'Annoyed': 'รำคาญ',
  'Distant': 'เหินห่าง', 'Withdrawn': 'ปลีกตัว', 'Numb': 'ด้านชา',
  'Critical': 'ช่างติ', 'Sceptical': 'กังขา', 'Dismissive': 'ดูแคลน',
  // Disgusted
  'Disapproving': 'ไม่เห็นด้วย', 'Judgmental': 'ตัดสินคนอื่น', 'Embarrassed': 'อับอาย',
  'Disappointed': 'ผิดหวัง', 'Appalled': 'รับไม่ได้', 'Revolted': 'ขยะแขยง',
  'Awful': 'แย่มาก', 'Nauseated': 'คลื่นไส้', 'Detestable': 'น่ารังเกียจ',
  'Repelled': 'อยากถอยห่าง', 'Horrified': 'สยดสยอง', 'Hesitant': 'ลังเล',
  // Sad
  'Hurt': 'เจ็บปวด', 'Depressed': 'หดหู่', 'Empty': 'ว่างเปล่า',
  'Guilty': 'รู้สึกผิด', 'Remorseful': 'สำนึกเสียใจ', 'Ashamed': 'ละอายใจ',
  'Despair': 'สิ้นหวัง', 'Powerless': 'ไร้พลัง', 'Grief': 'โศกเศร้า',
  'Vulnerable': 'เปราะบาง', 'Fragile': 'บอบบาง', 'Victimised': 'ตกเป็นเหยื่อ',
  'Lonely': 'เหงา', 'Abandoned': 'ถูกทอดทิ้ง', 'Isolated': 'โดดเดี่ยว',
  // Happy
  'Optimistic': 'มองโลกในแง่ดี', 'Inspired': 'ได้แรงบันดาลใจ', 'Hopeful': 'มีความหวัง',
  'Trusting': 'ไว้วางใจ', 'Intimate': 'ใกล้ชิด', 'Sensitive': 'อ่อนไหว',
  'Peaceful': 'สงบ', 'Thankful': 'ซาบซึ้งใจ', 'Loving': 'เปี่ยมรัก',
  'Powerful': 'มีพลัง', 'Creative': 'สร้างสรรค์', 'Courageous': 'กล้าหาญ',
  'Accepted': 'เป็นที่ยอมรับ', 'Valued': 'มีคุณค่า', 'Respected': 'ได้รับเกียรติ',
  'Proud': 'ภูมิใจ', 'Confident': 'มั่นใจ', 'Successful': 'สำเร็จ',
  'Interested': 'สนใจ', 'Inquisitive': 'ใฝ่รู้', 'Curious': 'อยากรู้',
  'Content': 'พอใจ', 'Joyful': 'เบิกบาน', 'Free': 'เป็นอิสระ',
  'Playful': 'ขี้เล่น', 'Cheeky': 'ทะเล้น', 'Aroused': 'ตื่นตัว',
  // Surprised
  'Excited': 'ตื่นเต้น', 'Energetic': 'กระปรี้กระเปร่า', 'Eager': 'กระตือรือร้น',
  'Amazed': 'ทึ่ง', 'Awe': 'อัศจรรย์ใจ', 'Astonished': 'ตื่นตะลึง',
  'Confused': 'สับสน', 'Perplexed': 'งุนงง', 'Disillusioned': 'หมดศรัทธา',
  'Startled': 'ตกใจ', 'Dismayed': 'ใจเสีย', 'Shocked': 'ช็อก',
  // Bad
  'Tired': 'เหนื่อย', 'Unfocussed': 'ไม่มีสมาธิ', 'Sleepy': 'ง่วง',
  'Stressed': 'เครียด', 'Out of control': 'ควบคุมไม่ได้',
  'Busy': 'ยุ่ง', 'Rushed': 'เร่งรีบ', 'Pressured': 'ถูกกดดัน',
  'Bored': 'เบื่อ', 'Apathetic': 'เฉยชา', 'Indifferent': 'ไม่แยแส',
}
const lang = ref<'en' | 'th'>(props.lang)
const isTh = computed(() => lang.value === 'th')
const swapping = ref(false)
function setLang(l: 'en' | 'th') {
  if (l === lang.value) return
  swapping.value = true
  setTimeout(() => { lang.value = l; swapping.value = false }, 160)
}
const clipId = `fw-clip-${useId()}`
const t = (en: string) => (isTh.value ? TH[en] ?? en : en)

const C = 500
const R = [0, 168, 330, 492] // core / middle / outer ring radii
const total = WHEEL.reduce((n, c) => n + c.mid.length * 2, 0)
const step = 360 / total

const pt = (r: number, a: number) => {
  const rad = (a * Math.PI) / 180
  return [C + r * Math.sin(rad), C - r * Math.cos(rad)]
}
function sector(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0
  const [x0, y0] = pt(r1, a0); const [x1, y1] = pt(r1, a1)
  if (r0 === 0) return `M${C},${C} L${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} Z`
  const [x2, y2] = pt(r0, a1); const [x3, y3] = pt(r0, a0)
  return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`
}
// radial text: reads outward on the right half, inward on the left half (always left→right)
function label(r: number, a: number) {
  const [x, y] = pt(r, a)
  const rot = a <= 180 ? a - 90 : a + 90
  return { x, y, transform: `rotate(${rot} ${x} ${y})` }
}
// small outward nudge for the hovered segment
function nudge(a: number, d: number) {
  const rad = (a * Math.PI) / 180
  return `translate(${(d * Math.sin(rad)).toFixed(1)}px, ${(-d * Math.cos(rad)).toFixed(1)}px)`
}
const tint = (c: string, p: number) => `color-mix(in srgb, ${c} ${p}%, #ffffff)`

type Seg = { key: string; level: 'core' | 'mid' | 'outer'; ci: number; mi: number; oi: number; en: string; d: string; fill: string; mid: number; x: number; y: number; transform: string }

const shapes = computed(() => {
  const cores: Seg[] = []; const mids: Seg[] = []; const outers: Seg[] = []
  const coreMid: number[] = []
  let a = 0; let mi = 0; let oi = 0
  WHEEL.forEach((core, ci) => {
    const a0 = a
    for (const [m, [o1, o2]] of core.mid) {
      const m0 = a
      for (const o of [o1, o2]) {
        outers.push({ key: `o${oi}`, level: 'outer', ci, mi, oi, en: o, d: sector(R[2], R[3], a, a + step), fill: tint(core.color, 72), mid: a + step / 2, ...label((R[2] + R[3]) / 2, a + step / 2) })
        a += step; oi++
      }
      mids.push({ key: `m${mi}`, level: 'mid', ci, mi, oi: -1, en: m, d: sector(R[1], R[2], m0, a), fill: tint(core.color, 38), mid: (m0 + a) / 2, ...label((R[1] + R[2]) / 2, (m0 + a) / 2) })
      mi++
    }
    coreMid.push((a0 + a) / 2)
    cores.push({ key: `c${ci}`, level: 'core', ci, mi: -1, oi: -1, en: core.name, d: sector(0, R[1], a0, a), fill: core.color, mid: (a0 + a) / 2, ...label(R[1] * 0.58, (a0 + a) / 2) })
  })
  return { cores, mids, outers, coreMid }
})
const byKey = computed(() => {
  const m = new Map<string, Seg>()
  for (const s of [...shapes.value.cores, ...shapes.value.mids, ...shapes.value.outers]) m.set(s.key, s)
  return m
})

// ---------- interaction ----------
const hover = ref<Seg | null>(null)
const pinned = ref<Seg | null>(null)   // chosen from the search box
const focus = ref<number | null>(null) // focused core index (zoomed)
const current = computed(() => hover.value ?? pinned.value)

// ---------- search (EN or TH) ----------
const query = ref('')
const open = ref(false)
const activeIdx = ref(0)
const allSegs = computed(() => [...shapes.value.cores, ...shapes.value.mids, ...shapes.value.outers])
const q = computed(() => query.value.trim().toLowerCase())
const isHit = (s: Seg) => !!q.value && (s.en.toLowerCase().includes(q.value) || (TH[s.en] ?? '').includes(q.value))
const hits = computed(() => {
  if (!q.value) return [] as Seg[]
  const starts = (s: Seg) => s.en.toLowerCase().startsWith(q.value) || (TH[s.en] ?? '').startsWith(q.value)
  const rank = { core: 0, mid: 1, outer: 2 }
  return allSegs.value.filter(isHit).sort((a, b) => Number(starts(b)) - Number(starts(a)) || rank[a.level] - rank[b.level])
})
// matched segments + their parents (core / middle ring) stay bright
const hitKeys = computed(() => {
  const k = new Set<string>()
  for (const h of hits.value) {
    k.add(h.key); k.add(`c${h.ci}`)
    if (h.level === 'outer') k.add(`m${h.mi}`)
  }
  return k
})
const pathOf = (s: Seg) => {
  const p = [WHEEL[s.ci].name]
  if (s.level === 'outer') p.push(shapes.value.mids[s.mi].en)
  return p
}
function onInput() { open.value = true; activeIdx.value = 0; pinned.value = null; focus.value = null }
function choose(s: Seg) {
  pinned.value = s
  focus.value = s.ci
  query.value = t(s.en)
  open.value = false
}
function clearSearch() { query.value = ''; pinned.value = null; focus.value = null; open.value = false }
function onSearchKey(e: KeyboardEvent) {
  const list = hits.value.slice(0, 12)
  if (e.key === 'ArrowDown') { e.preventDefault(); open.value = true; activeIdx.value = Math.min(activeIdx.value + 1, list.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx.value = Math.max(activeIdx.value - 1, 0) }
  else if (e.key === 'Enter') { e.preventDefault(); if (list[activeIdx.value]) choose(list[activeIdx.value]) }
  else if (e.key === 'Escape') { clearSearch(); (e.target as HTMLInputElement).blur() }
}

function lit(s: Seg) {
  const h = current.value
  if (h) {
    if (s.ci !== h.ci) return false
    if (s.level === 'core') return true
    if (h.level === 'core') return true
    if (s.level === 'mid') return s.mi === h.mi
    return h.level === 'mid' ? s.mi === h.mi : s.oi === h.oi
  }
  if (q.value && hits.value.length) return hitKeys.value.has(s.key)
  if (focus.value !== null) return s.ci === focus.value
  return true
}
const active = computed(() => current.value !== null || focus.value !== null || hits.value.length > 0)

function onClick(s: Seg) {
  focus.value = focus.value === s.ci ? null : s.ci
}
function reset() { focus.value = null; hover.value = null; pinned.value = null; query.value = ''; open.value = false }
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') reset() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

// zoom towards the focused category
const zoom = computed(() => {
  if (focus.value === null) return 'translate(0px, 0px) scale(1)'
  const a = shapes.value.coreMid[focus.value]
  const [px, py] = pt(300, a)
  const k = 1.45
  return `translate(${(C - px * k).toFixed(1)}px, ${(C - py * k).toFixed(1)}px) scale(${k})`
})

// side panel content
const panel = computed(() => {
  const h = current.value
  if (h) {
    const core = WHEEL[h.ci]
    const path: string[] = [core.name]
    if (h.level !== 'core') {
      const midSeg = h.level === 'mid' ? h : shapes.value.mids[h.mi]
      path.push(midSeg.en)
    }
    if (h.level === 'outer') path.push(h.en)
    return { color: core.color, big: h.en, path, list: h.level === 'core' ? core.mid.map(m => m[0]) : h.level === 'mid' ? core.mid.find(m => m[0] === h.en)![1] : [] }
  }
  if (focus.value !== null) {
    const core = WHEEL[focus.value]
    return { color: core.color, big: core.name, path: [core.name], list: core.mid.map(m => m[0]) }
  }
  return null
})

const { $slidev, $page, $renderContext } = useSlideContext()
const play = computed(() =>
  $renderContext.value !== 'print'
  && $renderContext.value !== 'overview'
  && $slidev.nav.currentPage === $page.value,
)
</script>

<template>
  <div class="fw" :class="{ th: isTh, swapping }">
    <div class="lang-toggle" role="group" aria-label="Language">
      <button :class="{ on: !isTh }" @click.stop="setLang('en')">EN</button>
      <button :class="{ on: isTh }" @click.stop="setLang('th')">ไทย</button>
    </div>
    <div class="search" @click.stop>
      <span class="icon">⌕</span>
      <input
        v-model="query" type="text" spellcheck="false" autocomplete="off"
        :placeholder="isTh ? 'ค้นหาความรู้สึก…' : 'Search a feeling…'"
        @input="onInput" @focus="open = !!query" @blur="open = false"
        @keydown.stop="onSearchKey" @keyup.stop @keypress.stop
      >
      <button v-if="query" class="clear" title="Clear" @mousedown.prevent="clearSearch">×</button>
      <div v-if="open && q" class="results">
        <div v-if="!hits.length" class="empty">{{ isTh ? 'ไม่พบ' : 'No match' }}</div>
        <div
          v-for="(s, i) in hits.slice(0, 12)" :key="s.key" class="item" :class="{ on: i === activeIdx }"
          @mousedown.prevent="choose(s)" @mouseenter="activeIdx = i"
        >
          <span class="dot" :style="{ background: WHEEL[s.ci].color }" />
          <span class="main">{{ t(s.en) }}<small>{{ isTh ? s.en : TH[s.en] }}</small></span>
          <span v-if="s.level !== 'core'" class="where">{{ pathOf(s).map(t).join(' › ') }}</span>
        </div>
        <div v-if="hits.length > 12" class="more">+{{ hits.length - 12 }}</div>
      </div>
    </div>
    <svg class="wheel" :class="{ play, active }" viewBox="0 0 1000 1000" role="img" :aria-label="isTh ? 'วงล้อความรู้สึก' : 'Feelings wheel'" @click.self="reset">
      <defs><clipPath :id="clipId"><circle :cx="C" :cy="C" r="499" /></clipPath></defs>
      <rect x="0" y="0" width="1000" height="1000" fill="transparent" @click="reset" />
      <g :clip-path="`url(#${clipId})`">
        <g class="zoom" :style="{ transform: zoom }">
          <g v-for="ring in (['outers', 'mids', 'cores'] as const)" :key="ring" class="ring" :class="ring">
            <g
              v-for="s in shapes[ring]" :key="s.key" class="seg"
              :class="{ dim: !lit(s), hov: current && current.key === s.key, hit: !current && q && isHit(s) }"
              :style="current && current.key === s.key ? { transform: nudge(s.mid, s.level === 'core' ? 10 : 14) } : undefined"
              @mouseenter="hover = s" @mouseleave="hover = null" @click.stop="onClick(s)"
            >
              <path :d="s.d" :fill="s.fill" />
              <text :x="s.x" :y="s.y" :transform="s.transform" :class="'t-' + s.level">{{ t(s.en) }}</text>
            </g>
          </g>
        </g>
      </g>
    </svg>

    <transition name="fw-panel">
      <div v-if="panel" class="panel" :style="{ '--c': panel.color }">
        <div class="crumbs">
          <template v-for="(p, i) in panel.path" :key="p"><span v-if="i" class="sep">›</span>{{ t(p) }}</template>
        </div>
        <div class="big">{{ t(panel.big) }}</div>
        <div v-if="isTh" class="en">{{ panel.big }}</div>
        <div v-if="panel.list.length" class="list">
          <span v-for="w in panel.list" :key="w">{{ t(w) }}<small v-if="isTh"> · {{ w }}</small></span>
        </div>
      </div>
    </transition>
    <div v-if="!panel" class="hint">{{ isTh ? 'ชี้เพื่อเน้น · คลิกเพื่อซูม' : 'hover to highlight · click to zoom' }}</div>
  </div>
</template>

<style scoped>
.fw { position: relative; width: 100%; height: 100%; }
.wheel { width: 100%; height: 100%; display: block; overflow: visible; cursor: default; }
path { stroke: var(--card, #fff); stroke-width: 2.5; stroke-linejoin: round; }
text {
  fill: #1b2a41;
  dominant-baseline: central;
  text-anchor: middle;
  font-family: Inter, Sarabun, sans-serif;
  pointer-events: none;
}
.t-outer { font-size: 16.5px; font-weight: 500; }
.t-mid { font-size: 19px; font-weight: 600; }
.t-core { font-size: 22px; font-weight: 800; }
.th .t-outer { font-size: 16px; font-weight: 600; }
.th .t-mid { font-size: 18.5px; font-weight: 700; }
.th .t-core { font-size: 21px; }

.seg { cursor: pointer; transition: opacity .25s ease, transform .25s ease, filter .25s ease; }
.seg.dim { opacity: 0.18; }
.seg.hov { filter: drop-shadow(0 6px 14px rgba(20, 40, 80, 0.35)); }
.seg.hov path { stroke: #1b2a41; stroke-width: 3; }
.seg.hov text { font-weight: 800; }
.zoom { transition: transform .6s cubic-bezier(.2,.8,.2,1); transform-origin: 0 0; }

.ring { transform-origin: 500px 500px; }
.play .cores { animation: w-in .6s cubic-bezier(.2,.8,.2,1) both; }
.play .mids { animation: w-in .7s cubic-bezier(.2,.8,.2,1) .25s both; }
.play .outers { animation: w-in .8s cubic-bezier(.2,.8,.2,1) .5s both; }
@keyframes w-in { from { opacity: 0; transform: rotate(-25deg) scale(.85); } to { opacity: 1; transform: none; } }

/* language switch (sits in the empty space right of the wheel) */
.lang-toggle {
  position: absolute; left: calc(100% + 1rem); top: 6%;
  display: flex; padding: 3px; gap: 2px;
  background: var(--card); border: 1px solid var(--rule); border-radius: 999px;
  box-shadow: var(--shadow); z-index: 5;
}
.lang-toggle button {
  font: 700 0.85rem/1 Inter, Sarabun, sans-serif; color: var(--muted);
  padding: 0.42rem 0.85rem; border-radius: 999px; cursor: pointer;
  background: transparent; border: none; transition: background .2s, color .2s;
}
.lang-toggle button.on { background: var(--m); color: #fff; }
.lang-toggle button:not(.on):hover { color: var(--ink); }
.wheel text, .panel { transition: opacity .16s ease; }
.swapping .wheel text, .swapping .panel { opacity: 0; }

/* search box with autocomplete (right of the wheel, under the language switch) */
.search {
  position: absolute; left: calc(100% + 1rem); top: calc(6% + 2.9rem); width: 14rem; z-index: 6;
}
.search input {
  width: 100%; padding: 0.5rem 1.9rem 0.5rem 1.9rem; border-radius: 999px;
  font: 600 0.9rem/1.2 Inter, Sarabun, sans-serif; color: var(--ink);
  background: var(--card); border: 1px solid var(--rule); box-shadow: var(--shadow); outline: none;
}
.search input:focus { border-color: var(--m); box-shadow: 0 0 0 3px color-mix(in srgb, var(--m) 25%, transparent); }
.search input::placeholder { color: var(--muted); font-weight: 500; }
.search .icon { position: absolute; left: 0.7rem; top: 50%; transform: translateY(-52%); font-size: 1rem; color: var(--muted); pointer-events: none; }
.search .clear {
  position: absolute; right: 0.45rem; top: 50%; transform: translateY(-50%);
  width: 1.3rem; height: 1.3rem; border-radius: 50%; border: none; cursor: pointer;
  background: color-mix(in srgb, var(--muted) 25%, transparent); color: var(--ink); font-size: 0.9rem; line-height: 1;
}
.results {
  position: absolute; top: calc(100% + 0.35rem); left: 0; right: 0; max-height: 16rem; overflow-y: auto;
  background: var(--card); border: 1px solid var(--rule); border-radius: 14px; box-shadow: var(--shadow); padding: 0.3rem;
}
.results .item {
  display: grid; grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: center;
  padding: 0.35rem 0.55rem; border-radius: 10px; cursor: pointer;
}
.results .item.on { background: color-mix(in srgb, var(--m) 14%, transparent); }
.results .dot { width: 0.6rem; height: 0.6rem; border-radius: 50%; grid-row: span 2; }
.results .main { font-size: 0.92rem; font-weight: 700; color: var(--ink); }
.results .main small { font-weight: 500; color: var(--muted); margin-left: 0.4rem; font-size: 0.78rem; }
.results .where { grid-column: 2; font-size: 0.7rem; color: var(--muted); }
.results .empty, .results .more { padding: 0.35rem 0.6rem; font-size: 0.78rem; color: var(--muted); }
.seg.hit path { stroke: #1b2a41; stroke-width: 3; }
.seg.hit text { font-weight: 800; }

/* side panel (sits in the empty space left of the wheel) */
.panel {
  position: absolute;
  right: calc(100% + 1rem);
  top: 6%;
  width: 13.5rem;
  padding: 0.8rem 1rem 0.9rem;
  background: var(--card);
  border: 1px solid var(--rule);
  border-left: 8px solid var(--c);
  border-radius: 16px;
  box-shadow: var(--shadow);
  color: var(--ink);
}
.crumbs { font-size: 0.72rem; font-weight: 700; color: var(--muted); letter-spacing: 0.02em; }
.crumbs .sep { margin: 0 0.3rem; opacity: 0.6; }
.big { font-size: 2.1rem; font-weight: 800; line-height: 1.15; margin-top: 0.15rem; letter-spacing: -0.01em; }
.en { font-size: 0.9rem; color: var(--muted); font-weight: 600; }
.list { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.6rem; }
.list span {
  font-size: 0.78rem; font-weight: 600; padding: 0.1rem 0.55rem; border-radius: 999px;
  background: color-mix(in srgb, var(--c) 30%, var(--card));
}
.list small { font-weight: 500; opacity: 0.75; }
.hint {
  position: absolute; right: calc(100% + 1rem); bottom: 4%;
  font-size: 0.66rem; color: var(--muted); opacity: 0.7; white-space: nowrap;
}
.fw-panel-enter-active, .fw-panel-leave-active { transition: opacity .2s ease, transform .2s ease; }
.fw-panel-enter-from, .fw-panel-leave-to { opacity: 0; transform: translateX(-8px); }
</style>
