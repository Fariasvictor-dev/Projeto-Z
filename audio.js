// ═══════════════════════════════════════════════════════
//  GRAVITAÇÃO Z — AUDIO ENGINE (Web Audio API)
//  Sons 100% sintetizados, sem arquivos externos
// ═══════════════════════════════════════════════════════

const GZ_Audio = (() => {
  let ctx = null;
  let masterGain = null;
  let iniciado = false;

  // Inicializa o contexto (precisa de gesto do usuário)
  function init() {
    if (iniciado) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(ctx.destination);
      iniciado = true;
    } catch(e) {
      console.warn('Web Audio não disponível:', e);
    }
  }

  // Retoma contexto suspenso (política autoplay)
  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // Utilitário: conecta nó ao master
  function connect(node) {
    node.connect(masterGain);
    return node;
  }

  // ── BOTÃO HOVER ───────────────────────────────────────
  // Tick suave, levemente espacial
  function btnHover() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.06);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g); connect(g);
    osc.start(t); osc.stop(t + 0.09);
  }

  // ── BOTÃO CLICK / CONFIRM ─────────────────────────────
  // Som de "select" estilo RPG anos 90 — dois tons rápidos ascendentes
  function btnClick() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;

    // Tom 1
    const osc1 = ctx.createOscillator();
    const g1   = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(440, t);
    g1.gain.setValueAtTime(0.0, t);
    g1.gain.linearRampToValueAtTime(0.18, t + 0.005);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    osc1.connect(g1); connect(g1);
    osc1.start(t); osc1.stop(t + 0.10);

    // Tom 2 (mais agudo)
    const osc2 = ctx.createOscillator();
    const g2   = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(660, t + 0.07);
    g2.gain.setValueAtTime(0.0, t + 0.07);
    g2.gain.linearRampToValueAtTime(0.22, t + 0.075);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc2.connect(g2); connect(g2);
    osc2.start(t + 0.07); osc2.stop(t + 0.19);
  }

  // ── BOTÃO START (tela inicial) ────────────────────────
  // Acorde majestoso curto — estilo início de jornada
  function btnStart() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const freqs = [261.6, 329.6, 392.0, 523.2]; // C4 E4 G4 C5
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const delay = i * 0.04;
      g.gain.setValueAtTime(0.0, t + delay);
      g.gain.linearRampToValueAtTime(0.15, t + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.4);
      osc.connect(g); connect(g);
      osc.start(t + delay); osc.stop(t + delay + 0.45);
    });
  }

  // ── NAVEGAÇÃO (setas, menu) ───────────────────────────
  // Tick neutro
  function btnNav() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.10, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(g); connect(g);
    osc.start(t); osc.stop(t + 0.07);
  }

  // ── SOCO NORMAL ───────────────────────────────────────
  // Impacto com punch — ataque rápido + decay de grave
  function socoNormal() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;

    // Componente de impacto (noise burst)
    const bufLen = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.5);
    }
    const noise  = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseG = ctx.createGain();
    const noiseF = ctx.createBiquadFilter();
    noiseF.type = 'bandpass';
    noiseF.frequency.value = 800;
    noiseF.Q.value = 1.2;
    noiseG.gain.setValueAtTime(1.2, t);
    noiseG.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(noiseF); noiseF.connect(noiseG); connect(noiseG);
    noise.start(t);

    // Componente grave (body do soco)
    const osc  = ctx.createOscillator();
    const oscG = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
    oscG.gain.setValueAtTime(0.0, t);
    oscG.gain.linearRampToValueAtTime(0.55, t + 0.008);
    oscG.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(oscG); connect(oscG);
    osc.start(t); osc.stop(t + 0.15);
  }

  // ── SOCO FORTE (golpe especial) ───────────────────────
  // Mais pesado, com reverb sintético e distorção leve
  function socoForte() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;

    // Noise burst mais longo e forte
    const bufLen = ctx.sampleRate * 0.10;
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.8);
    }
    const noise  = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseG = ctx.createGain();
    const noiseF = ctx.createBiquadFilter();
    noiseF.type = 'bandpass';
    noiseF.frequency.value = 600;
    noiseF.Q.value = 0.8;
    noiseG.gain.setValueAtTime(2.0, t);
    noiseG.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
    noise.connect(noiseF); noiseF.connect(noiseG); connect(noiseG);
    noise.start(t);

    // Grave profundo
    const osc  = ctx.createOscillator();
    const oscG = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.20);
    oscG.gain.setValueAtTime(0.0, t);
    oscG.gain.linearRampToValueAtTime(0.7, t + 0.01);
    oscG.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(oscG); connect(oscG);
    osc.start(t); osc.stop(t + 0.23);

    // Eco (delay sintético)
    const osc2  = ctx.createOscillator();
    const osc2G = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(80, t + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(30, t + 0.22);
    osc2G.gain.setValueAtTime(0.0, t + 0.08);
    osc2G.gain.linearRampToValueAtTime(0.3, t + 0.09);
    osc2G.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc2.connect(osc2G); connect(osc2G);
    osc2.start(t + 0.08); osc2.stop(t + 0.26);
  }

  // ── RECEBER DANO ─────────────────────────────────────
  // Som de "levar golpe" — impacto + tom descendente
  function danoCausado() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;

    const bufLen = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
    }
    const noise  = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseG = ctx.createGain();
    noiseG.gain.setValueAtTime(0.9, t);
    noiseG.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    noise.connect(noiseG); connect(noiseG);
    noise.start(t);

    const osc  = ctx.createOscillator();
    const oscG = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
    oscG.gain.setValueAtTime(0.0, t);
    oscG.gain.linearRampToValueAtTime(0.35, t + 0.005);
    oscG.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(oscG); connect(oscG);
    osc.start(t); osc.stop(t + 0.17);
  }

  // ── VITÓRIA ───────────────────────────────────────────
  // Fanfarra curta ascendente
  function vitoria() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const notas = [
      {f:392, d:0.00, dur:0.12},
      {f:392, d:0.12, dur:0.12},
      {f:392, d:0.24, dur:0.12},
      {f:523, d:0.36, dur:0.30},
      {f:440, d:0.36, dur:0.30},
      {f:523, d:0.66, dur:0.50},
    ];
    notas.forEach(n => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = n.f;
      g.gain.setValueAtTime(0.0, t + n.d);
      g.gain.linearRampToValueAtTime(0.18, t + n.d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + n.d + n.dur);
      osc.connect(g); connect(g);
      osc.start(t + n.d); osc.stop(t + n.d + n.dur + 0.01);
    });
  }

  // ── DERROTA ───────────────────────────────────────────
  // Descida cromática triste
  function derrota() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const notas = [
      {f:440, d:0.00, dur:0.18},
      {f:392, d:0.18, dur:0.18},
      {f:349, d:0.36, dur:0.18},
      {f:294, d:0.54, dur:0.40},
    ];
    notas.forEach(n => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = n.f;
      g.gain.setValueAtTime(0.0, t + n.d);
      g.gain.linearRampToValueAtTime(0.15, t + n.d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + n.d + n.dur);
      osc.connect(g); connect(g);
      osc.start(t + n.d); osc.stop(t + n.d + n.dur + 0.01);
    });
  }

  // ── AVANÇAR DIÁLOGO ───────────────────────────────────
  // Tick de texto — como máquina de escrever
  function dialogoAvancar() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(g); connect(g);
    osc.start(t); osc.stop(t + 0.045);
  }

  // ── MISSÃO DESBLOQUEADA ───────────────────────────────
  // Arpejo ascendente brilhante
  function missaoDesbloqueada() {
    if (!iniciado) return;
    resume();
    const t = ctx.currentTime;
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const d = i * 0.07;
      g.gain.setValueAtTime(0.0, t + d);
      g.gain.linearRampToValueAtTime(0.20, t + d + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.35);
      osc.connect(g); connect(g);
      osc.start(t + d); osc.stop(t + d + 0.36);
    });
  }

  // API pública
  return {
    init,
    btnHover,
    btnClick,
    btnStart,
    btnNav,
    socoNormal,
    socoForte,
    danoCausado,
    vitoria,
    derrota,
    dialogoAvancar,
    missaoDesbloqueada,
  };
})();

// ── AUTO-INIT no primeiro gesto ───────────────────────
document.addEventListener('click',     () => GZ_Audio.init(), { once: true });
document.addEventListener('keydown',   () => GZ_Audio.init(), { once: true });
document.addEventListener('touchstart',() => GZ_Audio.init(), { once: true });
