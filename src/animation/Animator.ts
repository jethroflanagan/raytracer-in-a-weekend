import { lerp } from 'src/utils/math';

type Animation = {
  item: unknown;
  from: unknown;
  to: unknown;
  ease?: Function;
  duration?: number; // in ms (only need this or endTime)
  startTime?: number; // in ms
  endTime?: number; // in ms (only need this or durationTime)
  delay?: number;
  currentTime?: number;
  update: Function;
};

export class Animator {
  animations: Animation[];
  constructor() {
    this.animations = [];
  }

  animate({ item, from, to, ease = lerp, duration, startTime, endTime, delay = 0, currentTime = 0, update }: Animation) {
    const fromKeys = Object.keys(from);
    const toKeys = Object.keys(to);
    if (fromKeys.length !== toKeys.length) {
      throw new Error(`Animation properties don't match.`);
    }
    for (const prop of fromKeys) {
      if (!Object.hasOwnProperty.call(to, prop)) {
        throw new Error(`Animation properties don't match on ${prop}`);
      }
      if (typeof(fromKeys[prop]) !== typeof(toKeys[prop])) {
        throw new Error(`Animation properties types don't match on ${prop}`);
      }
    }
    if (duration != null) {
      endTime = startTime + duration;
    }
    else if (endTime != null) {
      duration = endTime - startTime;
    }
    this.animations.push({
      item,
      from,
      to,
      ease,
      duration,
      startTime,
      endTime,
      update,
    });
  }

  getPropertiesAtTime({ item, time }: { item: unknown, time: number }) {
    const animation = this.animations.find(i => i.item === item);
    const properties = {};
    const { startTime, endTime, duration } = animation;
    let animationPercent = 0;

    // limit animation
    if (time < startTime) {
      animationPercent = 0;
    }
    else if (time > endTime) {
      animationPercent = 1;
    }
    else {
      animationPercent = (time - startTime) / duration;
    }

    for (const prop of Object.keys(animation.from)) {
      properties[prop] = animation.ease(animation.from[prop], animation.to[prop], animationPercent);
    }
    return properties;
  }

  updateItemsForTime(time: number) {
    for (const animation of this.animations) {
      const { item } = animation;
      const properties = this.getPropertiesAtTime({ item, time });
      animation.update({ item, properties });
    }
  }

  getAnimationTimeRange() {
    let min = Infinity;
    let max = 0;
    for (const animation of this.animations) {
      min = Math.min(min, animation.startTime);
      max = Math.max(max, animation.endTime);
    }
    return { min, max };
  }
}
