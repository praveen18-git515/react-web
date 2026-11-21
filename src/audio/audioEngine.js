import { useSyncExternalStore } from "react";

const listeners = new Set();
const initialState = Object.freeze({
  bikeId: null,
  running: false,
  starting: false,
  throttle: 0.12,
  muted: false,
  volume: 0.55,
  mode: "idle",
  error: "",
});

let state = initialState;
let audioContext;
let masterGain;
let activeSound;
let startTimer;
let revTimer;

function publish(next) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function requireFinite(value, label) {
  if (!Number.isFinite(value)) throw new Error(`Invalid ${label} for sound simulation.`);
  return value;
}

function setParamValue(param, value, label) {
  param.value = requireFinite(value, label);
}

function setParamTarget(param, value, context, timeConstant, label) {
  param.setTargetAtTime(
    requireFinite(value, label),
    requireFinite(context.currentTime, "audio clock"),
    requireFinite(timeConstant, "audio transition"),
  );
}

function ensureContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    setParamValue(masterGain.gain, state.muted ? 0 : state.volume, "master volume");
    masterGain.connect(audioContext.destination);
  }
  return audioContext;
}

function frequencyFor(bike) {
  if (bike.fuel === "Electric") return 72 + Math.min(Number.parseFloat(bike.power) || 7, 30) * 1.7;
  const displacement = Number.parseInt(String(bike.engine).replace(/,/g, ""), 10) || 400;
  return 25 + Math.min(displacement, 2000) * 0.035;
}

function stopNodes(sound, fade = true) {
  if (!sound || sound.stopped) return;
  sound.stopped = true;
  const context = audioContext;
  const now = context?.currentTime ?? 0;
  try {
    sound.gain.gain.cancelScheduledValues(now);
    setParamTarget(sound.gain.gain, 0, context, fade ? 0.045 : 0.005, "stop gain");
    sound.oscillators.forEach((node) => {
      try {
        node.stop(now + (fade ? 0.2 : 0.01));
      } catch {
        // Oscillator may already have stopped.
      }
    });
    window.setTimeout(() => sound.nodes.forEach((node) => {
      try { node.disconnect(); } catch { /* Already disconnected. */ }
    }), fade ? 260 : 20);
    window.setTimeout(() => sound.gain.disconnect(), fade ? 260 : 20);
  } catch (error) {
    console.error("Could not stop the motorcycle sound simulation.", error);
  }
}

function buildSound(bike) {
  const context = ensureContext();
  const profile = bike.audio.profile;
  const baseFrequency = requireFinite(frequencyFor(bike) * profile.pitch, "engine frequency");
  requireFinite(profile.harmonic, "sound profile harmonic");
  requireFinite(profile.texture, "sound profile texture");
  requireFinite(profile.cylinders, "sound profile cylinder count");
  if (profile.cylinders <= 0) throw new Error("Invalid sound profile cylinder count.");
  const soundGain = context.createGain();
  const filter = context.createBiquadFilter();
  filter.type = bike.fuel === "Electric" ? "lowpass" : "lowpass";
  setParamValue(filter.frequency, bike.fuel === "Electric" ? 850 : 480, "filter frequency");
  setParamValue(filter.Q, 0.7, "filter resonance");
  setParamValue(soundGain.gain, 0, "engine gain");
  filter.connect(soundGain);
  soundGain.connect(masterGain);

  const nodes = [filter];
  const oscillators = [];
  if (bike.fuel === "Electric") {
    const motor = context.createOscillator();
    const overtone = context.createOscillator();
    const motorGain = context.createGain();
    const overtoneGain = context.createGain();
    motor.type = "sine";
    overtone.type = "triangle";
    setParamValue(motor.frequency, baseFrequency, "motor frequency");
    setParamValue(overtone.frequency, baseFrequency * profile.harmonic, "motor overtone");
    setParamValue(motorGain.gain, 0.72, "motor level");
    setParamValue(overtoneGain.gain, 0.16, "motor overtone level");
    motor.connect(motorGain).connect(filter);
    overtone.connect(overtoneGain).connect(filter);
    motor.start();
    overtone.start();
    oscillators.push(motor, overtone);
    nodes.push(motor, overtone, motorGain, overtoneGain);
  } else {
    const fundamental = context.createOscillator();
    const harmonic = context.createOscillator();
    const pulse = context.createOscillator();
    const fundamentalGain = context.createGain();
    const harmonicGain = context.createGain();
    const pulseGain = context.createGain();
    fundamental.type = profile.wave;
    harmonic.type = "sawtooth";
    pulse.type = "sine";
    setParamValue(fundamental.frequency, baseFrequency, "engine frequency");
    setParamValue(harmonic.frequency, baseFrequency * profile.harmonic, "engine harmonic");
    setParamValue(pulse.frequency, Math.max(8, baseFrequency / profile.cylinders), "engine pulse");
    setParamValue(fundamentalGain.gain, 0.42, "engine level");
    setParamValue(harmonicGain.gain, profile.texture, "engine texture");
    setParamValue(pulseGain.gain, Math.min(0.13, profile.texture * 0.36), "engine pulse level");
    pulse.connect(pulseGain).connect(fundamental.frequency);
    fundamental.connect(fundamentalGain).connect(filter);
    harmonic.connect(harmonicGain).connect(filter);
    fundamental.start();
    harmonic.start();
    pulse.start();
    oscillators.push(fundamental, harmonic, pulse);
    nodes.push(fundamental, harmonic, pulse, fundamentalGain, harmonicGain, pulseGain);
  }

  if (bike.fuel === "Electric") {
    setParamValue(filter.frequency, 1250, "electric filter frequency");
  }
  return { bikeId: bike.id, bike, profile, baseFrequency, gain: soundGain, filter, nodes, oscillators, stopped: false };
}

function updateSound(sound, throttle, smooth = true) {
  if (!sound || sound.stopped) return;
  const context = audioContext;
  const value = Math.max(0, Math.min(1, throttle));
  const factor = 1 + value * (sound.bike.fuel === "Electric" ? 2.4 : 2.8);
  setParamTarget(sound.oscillators[0].frequency, sound.baseFrequency * factor, context, smooth ? 0.08 : 0.01, "engine frequency");
  setParamTarget(sound.oscillators[1].frequency, sound.baseFrequency * sound.profile.harmonic * factor, context, smooth ? 0.08 : 0.01, "engine harmonic");
  setParamTarget(sound.filter.frequency, (sound.bike.fuel === "Electric" ? 700 : 300) + value * (sound.bike.fuel === "Electric" ? 3400 : 3600), context, 0.1, "filter frequency");
  const level = sound.bike.fuel === "Electric" ? 0.12 + value * 0.12 : 0.09 + value * 0.2;
  setParamTarget(sound.gain.gain, level, context, 0.12, "engine output level");
}

function startBikeSound(bike) {
  if (!bike.audio?.profile) {
    publish({ error: "Sound sample unavailable." });
    return false;
  }
  if (activeSound?.bikeId === bike.id && !activeSound.stopped) {
    stopBikeSound();
    return false;
  }
  window.clearTimeout(revTimer);
  if (activeSound) stopNodes(activeSound);
  window.clearTimeout(startTimer);
  let startingSound;
  try {
    const context = ensureContext();
    if (context.state === "suspended") context.resume().catch((error) => {
      publish({ error: `Audio could not start: ${error.message}` });
    });
    startingSound = buildSound(bike);
    activeSound = startingSound;
    const sound = startingSound;
    const initialThrottle = bike.fuel === "Electric" ? 0.04 : 0.08;
    updateSound(sound, 0, false);
    publish({ bikeId: bike.id, running: true, starting: true, throttle: initialThrottle, mode: "starting", error: "" });
    startTimer = window.setTimeout(() => {
      if (activeSound === sound) {
        publish({ starting: false, mode: "idle" });
        updateSound(sound, initialThrottle);
      }
    }, bike.fuel === "Electric" ? 180 : 720);
    return true;
  } catch (error) {
    if (startingSound) stopNodes(startingSound, false);
    activeSound = null;
    publish({ bikeId: null, running: false, starting: false, error: error.message || "Sound simulation could not start." });
    return false;
  }
}

function stopBikeSound() {
  window.clearTimeout(startTimer);
  window.clearTimeout(revTimer);
  if (activeSound) stopNodes(activeSound);
  activeSound = null;
  publish({ bikeId: null, running: false, starting: false, throttle: 0.12, mode: "idle", error: "" });
}

function setThrottle(value, preserveRevTimer = false) {
  if (!preserveRevTimer) window.clearTimeout(revTimer);
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    publish({ error: "Throttle value must be a finite number." });
    return;
  }
  const throttle = Math.max(0, Math.min(1, numericValue));
  if (!activeSound || activeSound.stopped) return;
  publish({ throttle, mode: throttle > 0.25 ? "revving" : "idle" });
  updateSound(activeSound, throttle);
}

function revBikeSound() {
  if (!activeSound || activeSound.stopped) return false;
  window.clearTimeout(revTimer);
  setThrottle(0.88);
  const target = activeSound.bike.fuel === "Electric" ? 0.14 : 0.12;
  const sound = activeSound;
  revTimer = window.setTimeout(() => {
    if (activeSound === sound) setThrottle(target, true);
  }, 850);
  return true;
}

function setMuted(muted) {
  if (!audioContext || !masterGain) {
    publish({ muted });
    return;
  }
  setParamTarget(masterGain.gain, muted ? 0 : state.volume, audioContext, 0.04, "master volume");
  publish({ muted });
}

function setVolume(volume) {
  const numericVolume = Number(volume);
  if (!Number.isFinite(numericVolume)) {
    publish({ error: "Volume value must be a finite number." });
    return;
  }
  const nextVolume = Math.max(0, Math.min(1, numericVolume));
  if (audioContext && masterGain) setParamTarget(masterGain.gain, state.muted ? 0 : nextVolume, audioContext, 0.04, "master volume");
  publish({ volume: nextVolume });
}

export function useAudioEngine() {
  return {
    ...useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
    startBikeSound,
    stopBikeSound,
    setThrottle,
    revBikeSound,
    setMuted,
    setVolume,
  };
}

export { startBikeSound, stopBikeSound, setThrottle, revBikeSound, setMuted, setVolume };
