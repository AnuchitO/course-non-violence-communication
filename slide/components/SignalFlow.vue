<script setup lang="ts">
// Sender → "Send signal" → message → "Receive signal" → Receiver diagram.
// Positions follow the original Google Slides layout (percent of a 16:9 canvas).
// The entrance animation plays each time the slide becomes the current slide.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

defineProps<{
  senderLabel?: string
  receiverLabel?: string
  senderThought?: string
  receiverThought?: string
  message?: string
}>()

const { $slidev, $page, $renderContext } = useSlideContext()
const play = computed(() =>
  $renderContext.value !== 'print'
  && $renderContext.value !== 'overview'
  && $slidev.nav.currentPage === $page.value,
)
</script>

<template>
  <div class="sf" :class="{ play }">
    <!-- thought clouds -->
    <Cloud class="sf-cloud sender-cloud a7" tail="left">{{ senderThought }}</Cloud>
    <Cloud class="sf-cloud receiver-cloud a8" tail="right">{{ receiverThought }}</Cloud>

    <!-- people -->
    <img src="/images/sender.png" class="sf-person sender a1" alt="Sender">
    <img src="/images/receiver.png" class="sf-person receiver a5" alt="Receiver">

    <!-- signal boxes -->
    <div class="sf-box send a2">Send<br>signal</div>
    <div class="sf-box receive a4">Receive<br>signal</div>

    <!-- arrow -->
    <svg class="sf-arrow" viewBox="0 0 140 20" preserveAspectRatio="none" aria-hidden="true">
      <line class="a3-line" x1="2" y1="10" x2="124" y2="10" />
      <polygon class="a3-head" points="122,3 138,10 122,17" />
    </svg>

    <div v-if="message" class="sf-message a6">{{ message }}</div>

    <div v-if="senderLabel" class="sf-label left a1">{{ senderLabel }}</div>
    <div v-if="receiverLabel" class="sf-label right a5">{{ receiverLabel }}</div>
  </div>
</template>

<style scoped>
.sf {
  position: absolute;
  inset: 0;
}
.sf-person {
  position: absolute;
  width: 14.83%;
  height: 47.4%;
  object-fit: contain;
}
.sf-person.sender { left: 15.38%; top: 30.74%; }
.sf-person.receiver { left: 73.64%; top: 32.09%; }

.sf-box {
  position: absolute;
  top: 44.2%;
  width: 13%;
  height: 16.8%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-size: 1.15rem;
  line-height: 1.2;
  color: #1d2a30;
  background: linear-gradient(160deg, #fff27a, #ffd93d);
  border: 2px solid #1d2a30;
  border-radius: 10px;
  box-shadow: 4px 4px 0 #1d2a30;
}
.sf-box.send { left: 29%; }
.sf-box.receive { left: 60.64%; }

.sf-arrow {
  position: absolute;
  left: 44%;
  width: 14.5%;
  top: calc(52.6% - 10px);
  height: 20px;
  overflow: visible;
}
.sf-arrow line {
  stroke: var(--nvc-ink);
  stroke-width: 2.5;
  stroke-dasharray: 130;
  stroke-dashoffset: 0;
}
.sf-arrow polygon { fill: var(--nvc-ink); }

.sf-message {
  position: absolute;
  left: 34%;
  width: 32%;
  top: 64.5%;
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.35;
  color: var(--nvc-teal);
  font-weight: 500;
  font-style: italic;
}

.sf-label {
  position: absolute;
  top: 80.5%;
  width: 21.14%;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--nvc-teal);
}
.sf-label.left { left: 12.2%; }
.sf-label.right { left: 70.6%; }

.sf-cloud { position: absolute; }
.sender-cloud { left: 18.5%; top: 1.5%; width: 23%; }
.receiver-cloud { left: 58.5%; top: 1.5%; width: 21%; }

/* ---------- entrance sequence ---------- */
.play .a1 { animation: sf-up .55s cubic-bezier(.2,.8,.2,1) both; }
.play .a2 { animation: sf-pop .45s cubic-bezier(.2,.8,.2,1) .35s both; }
.play .a3-line { animation: sf-draw .5s ease-out .7s both; }
.play .a3-head { animation: sf-fade .2s ease-out 1.15s both; }
.play .a4 { animation: sf-pop .45s cubic-bezier(.2,.8,.2,1) 1.25s both; }
.play .a5 { animation: sf-up .55s cubic-bezier(.2,.8,.2,1) 1.45s both; }
.play .a6 { animation: sf-up .5s ease-out 1.8s both; }
.play .a7 { animation: sf-cloud .6s cubic-bezier(.3,1.4,.5,1) 2.1s both; transform-origin: 30% 100%; }
.play .a8 { animation: sf-cloud .6s cubic-bezier(.3,1.4,.5,1) 2.6s both; transform-origin: 70% 100%; }

@keyframes sf-up { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes sf-pop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
@keyframes sf-draw { from { stroke-dashoffset: 130; } to { stroke-dashoffset: 0; } }
@keyframes sf-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes sf-cloud { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
</style>
