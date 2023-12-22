const getModules = input => {
  const modules = input.trim().split('\n').reduce((map, line) => {
    const [first, last] = line.split(' -> ');
    // The broadcaster module will be named `roadcaster` and have type `b`, but
    // who cares?
    map[first.slice(1)] = {
      type: first[0],
      outputs: last.split(', '),
      inputs: [],
      state: first[0] === '%' ? false : first[0] === '&' ? {} : null
    }
    return map;
  }, {});

  // We add the final module rx
  modules.rx = { type: '*', outputs: [], inputs: [], state: null };

  // Then we track the inputs of each module
  for (const [name, {outputs}] of Object.entries(modules)) {
    for (const to of outputs) {
      if (modules[to].type === '&') modules[to].state[name] = false;
      modules[to].inputs.push(name);
    }
  }

  return modules;
};

const simulate = (modules, pushCount) => {
  // Keep track of how many low and high pulses are emitted
  let low = 0;
  let high = 0;
  /**
   * This is for the 2nd part.
   * Module rx receives a pulse from a single conunction module, which receives
   * pulses from other 4 (at least in my case) conjunction modules. These 4 are
   * our `sources`, and mark the end module of 4 separate sub-machines that
   * all have the broadcaster module as the other common point.
   */
  const sources = modules[modules.rx.inputs[0]].inputs;
  /**
   * We need to know when the `sources` modules send a high pulse. This happens
   * cyclically, so we need the lengths of those cycles to know when they all
   * emit a high pulse.
   */
  const sourcesHighEmits = {};

  for (let count = 0; count < pushCount; count++) {
    let sentPulses = modules.roadcaster.outputs.map(to => ({ from: 'roadcaster', to, high: false }));
    low += 1 + sentPulses.length;
    while (sentPulses.length) {
      const nextPulses = [];
      for (const pulse of sentPulses) {
        const module = modules[pulse.to];
        if (module.type === '%') {
          if (pulse.high) continue;
          module.state = !module.state;
          for (const to of module.outputs) {
            nextPulses.push({ from: pulse.to, to, high: module.state });
          }
        } else if (module.type === '&') {
          module.state[pulse.from] = pulse.high;
          const allHigh = !Object.values(module.state).includes(false);
          if (sources.includes(pulse.to) && !allHigh && !(pulse.to in sourcesHighEmits)) {
            // It's the first time a high pulse from one of the source has been
            // sent, so we keep track of this. This *should* be the length of
            // the cycle of the sub-machine that end with this module.
            sourcesHighEmits[pulse.to] = count + 1;
          }
          for (const to of module.outputs) {
            nextPulses.push({ from: pulse.to, to, high: !allHigh });
          }
        }
      }
      const lowPulses = nextPulses.filter(({ high }) => !high);
      low += lowPulses.length;
      high += nextPulses.length - lowPulses.length;
      sentPulses = nextPulses;
    }
  }

  // Hopefully, all the cycle lengths are all coprimes. Or even all primes (as
  // in my case), so we won't need to compute the least common multiple.
  const firstRxLowPulse = Object.values(sourcesHighEmits).reduce((prod, count) => prod * count, 1);
  return { low, high, firstRxLowPulse };
};

// Actually pressing 1000 times is probably inefficient but eh, fast enough.
const { low, high } = simulate(getModules(input), 1000);
console.log(low * high);

const { firstRxLowPulse } = simulate(getModules(input), 5000);
console.log(firstRxLowPulse);
