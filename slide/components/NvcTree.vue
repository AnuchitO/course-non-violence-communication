<script setup lang="ts">
// "Three Focus Options for Connection" drawn as an original tree illustration:
//   canopy (left)  = Empathy          canopy (right) = Self-Expression
//   trunk + heart  = connection       roots in the soil = Self-Empathy (Self-Connection)
// Content credit: "The NVC Tree of Life" © 2008 Inbal Kashtan (BayNVC).
// The "Original" toggle shows the original image unchanged (public/images/nvc-tree-of-life.jpg).
import { ref } from 'vue'

const view = ref<'tree' | 'original'>('tree')
</script>

<template>
  <div class="tree">
    <div class="tree-title">
      <h1>The NVC Tree of Life</h1>
      <span class="tree-sub">Three Focus Options for Connection</span>
      <div class="tree-toggle" role="group" aria-label="View">
        <button :class="{ on: view === 'tree' }" @click.stop="view = 'tree'">Tree</button>
        <button :class="{ on: view === 'original' }" @click.stop="view = 'original'">Original</button>
      </div>
    </div>

    <div v-show="view === 'tree'" class="stage">
      <!-- illustration -->
      <svg class="art" viewBox="0 0 900 400" preserveAspectRatio="none" aria-hidden="true">
        <!-- soil -->
        <path class="soil" d="M0,236 C150,226 300,244 450,236 S750,228 900,238 L900,400 L0,400 Z" />
        <path class="ground" d="M0,236 C150,226 300,244 450,236 S750,228 900,238" />
        <!-- canopy -->
        <g class="leaf emp">
          <circle cx="95" cy="95" r="70" /><circle cx="185" cy="60" r="80" /><circle cx="290" cy="70" r="72" />
          <circle cx="345" cy="130" r="55" /><circle cx="150" cy="150" r="62" /><circle cx="255" cy="150" r="60" />
        </g>
        <g class="leaf exp">
          <circle cx="805" cy="95" r="70" /><circle cx="715" cy="60" r="80" /><circle cx="610" cy="70" r="72" />
          <circle cx="555" cy="130" r="55" /><circle cx="750" cy="150" r="62" /><circle cx="645" cy="150" r="60" />
        </g>
        <!-- branches -->
        <path class="wood b" d="M444,128 C410,96 372,96 352,108" />
        <path class="wood b" d="M456,128 C490,96 528,96 548,108" />
        <path class="wood t" d="M447,112 C445,80 446,52 450,30" />
        <!-- trunk -->
        <path class="trunk" d="M424,246 C432,200 436,160 440,120 L460,120 C464,160 468,200 476,246 Z" />
        <!-- roots -->
        <path class="wood r" d="M432,244 C396,268 330,282 250,318" />
        <path class="wood r2" d="M440,248 C420,290 380,330 330,372" />
        <path class="wood r" d="M468,244 C504,268 570,282 650,318" />
        <path class="wood r2" d="M460,248 C480,290 520,330 570,372" />
      </svg>

      <!-- heart on the trunk -->
      <svg class="heart" viewBox="0 0 100 92" aria-hidden="true">
        <path d="M50,88 C22,66 4,50 4,30 C4,14 16,4 30,4 C40,4 47,10 50,18 C53,10 60,4 70,4 C84,4 96,14 96,30 C96,50 78,66 50,88 Z" />
      </svg>

      <!-- canopy: Empathy -->
      <div v-click="1" class="node emp">
        <div class="name">Empathy <small>Verbal · Non-Verbal</small></div>
        <div class="lead">Connecting with what’s alive in <em>you</em>:</div>
        <div class="lines">
          <span>(When you see/hear…)</span>
          <span>Are <em>you</em> feeling…</span>
          <span>because <em>you</em> need…?</span>
          <span>(Would you like…?)</span>
        </div>
      </div>

      <!-- canopy: Self-Expression -->
      <div v-click="2" class="node exp">
        <div class="name">Self-Expression</div>
        <div class="lead">Communicating what’s alive in <em>me</em>:</div>
        <div class="lines">
          <span>When <em>I</em> see/hear…</span>
          <span><em>I</em> feel…</span>
          <span>because <em>I</em> need….</span>
          <span>Would you be willing to…?</span>
        </div>
      </div>

      <!-- roots: Self-Empathy -->
      <div v-click="3" class="roots">
        <div class="roots-title">
          <span class="name">Self-Empathy</span><small>(Self-Connection)</small>
          <span class="open">Opening my heart to…</span>
        </div>
        <div class="root-col left">
          <div class="lead">… what’s alive in <em>me</em>:</div>
          <span>(Judgments?)</span><span>How am I feeling?</span><span>What am I needing?</span>
        </div>
        <div class="root-col right">
          <div class="lead">… what’s alive in <em>you</em>:</div>
          <span>(Judgments?)</span><span>Could s/he be feeling…?</span><span>Could s/he be needing…?</span>
        </div>
      </div>
    </div>

    <div v-show="view === 'tree'" v-click="4" class="foot">
      <div class="ask">Which option do I want to choose next? <b>Empathy? Self-Expression?</b></div>
      <div class="motto">♥ New Strategies Arise from Connection, Sometimes Without Words ♥</div>
    </div>

    <div v-if="view === 'original'" class="original">
      <img src="/images/nvc-tree-of-life.jpg" alt="The NVC Tree of Life (original)">
    </div>

    <div class="credit">Based on “The NVC Tree of Life” © 2008 by Inbal Kashtan · www.cnvc.org · www.baynvc.org</div>
  </div>
</template>

<style scoped>
.tree {
  --emp: #0ea5b7; --exp: var(--c-req); --self: var(--c-need); --heart: #e45f7f; --wood: #9a6a45;
  position: absolute; inset: 2.1rem 1.6rem 0.35rem; display: flex; flex-direction: column; gap: 0.3rem;
}
.tree-title { display: flex; align-items: baseline; gap: 0.9rem; }
.tree-title h1 { margin: 0 !important; font-size: 1.75rem !important; }
.tree-sub { font-size: 1rem; font-weight: 600; color: var(--muted); }
.tree-toggle {
  margin-left: auto; align-self: center; display: flex; padding: 3px; gap: 2px;
  background: var(--card); border: 1px solid var(--rule); border-radius: 999px; box-shadow: var(--shadow);
}
.tree-toggle button {
  font: 700 0.78rem/1 Inter, Sarabun, sans-serif; color: var(--muted); padding: 0.38rem 0.8rem;
  border-radius: 999px; border: none; background: transparent; cursor: pointer;
}
.tree-toggle button.on { background: var(--m); color: #fff; }

.stage { position: relative; flex: 1; min-height: 0; }
.art { position: absolute; inset: 0; width: 100%; height: 100%; }
.soil { fill: color-mix(in srgb, var(--self) 10%, transparent); }
.ground { fill: none; stroke: #5aa65a; stroke-width: 4; stroke-linecap: round; opacity: 0.8; }
.leaf circle { stroke: none; }
.leaf.emp circle { fill: color-mix(in srgb, var(--emp) 16%, transparent); }
.leaf.exp circle { fill: color-mix(in srgb, var(--exp) 16%, transparent); }
.trunk { fill: var(--wood); }
.wood { fill: none; stroke: var(--wood); stroke-linecap: round; }
.wood.b { stroke-width: 12; }
.wood.t { stroke-width: 9; }
.wood.r { stroke-width: 9; opacity: 0.9; }
.wood.r2 { stroke-width: 6; opacity: 0.75; }

.heart {
  position: absolute; left: 50%; top: 36%; width: 3.6rem; transform: translate(-50%, -50%);
  overflow: visible; filter: drop-shadow(0 6px 12px color-mix(in srgb, var(--heart) 50%, transparent));
}
.heart path { fill: var(--heart); stroke: #fff; stroke-width: 4; transform-origin: 50px 46px; animation: beat 2.4s ease-in-out infinite; }
@keyframes beat { 0%, 100% { transform: scale(1); } 12% { transform: scale(1.1); } 24% { transform: scale(1); } 36% { transform: scale(1.06); } 48% { transform: scale(1); } }

.node {
  position: absolute; top: 2%; width: 37%;
  padding: 0.5rem 0.9rem 0.55rem; border-radius: 22px;
  background: color-mix(in srgb, var(--card) 88%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--c) 45%, transparent);
  box-shadow: var(--shadow); backdrop-filter: blur(2px);
}
.node.emp { --c: var(--emp); left: 1%; }
.node.exp { --c: var(--exp); right: 1%; }
.name { font-size: 1.4rem; font-weight: 800; color: var(--c); letter-spacing: -0.01em; line-height: 1.2; }
.name small { font-size: 0.72rem; color: var(--muted); font-weight: 700; margin-left: 0.3rem; }
.lead { font-size: 0.95rem; font-weight: 700; color: var(--ink); margin-top: 0.1rem; }
.lines { display: flex; flex-direction: column; }
.lines span, .root-col span { font-family: var(--serif); font-size: 1rem; line-height: 1.4; color: var(--ink); }
em { font-style: normal; font-weight: 800; color: var(--heart); }

.roots { position: absolute; left: 0; right: 0; top: 61%; bottom: 0; --c: var(--self); }
.roots-title {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%);
  display: flex; align-items: baseline; gap: 0.4rem; white-space: nowrap;
  padding: 0.15rem 0.8rem; border-radius: 999px; background: var(--card);
  border: 1.5px solid color-mix(in srgb, var(--self) 50%, transparent); box-shadow: var(--shadow);
}
.roots-title .name { font-size: 1.15rem; }
.roots-title small { font-size: 0.72rem; font-weight: 700; color: var(--muted); }
.roots-title .open { font-size: 0.85rem; font-weight: 700; color: var(--self); margin-left: 0.4rem; }
.root-col { position: absolute; top: 2.3rem; width: 30%; display: flex; flex-direction: column; }
.root-col.left { left: 4%; }
.root-col.right { right: 4%; text-align: right; align-items: flex-end; }

.foot { text-align: center; }
.ask { font-size: 1.1rem; font-weight: 700; color: var(--ink); }
.ask b { color: var(--heart); }
.motto { font-size: 0.88rem; font-weight: 700; color: var(--muted); }

.original { flex: 1; min-height: 0; display: flex; justify-content: center; }
.original img { height: 100%; border-radius: 12px; box-shadow: var(--shadow); background: #fff; }

.credit { text-align: center; font-size: 0.55rem; color: var(--muted); }
</style>
