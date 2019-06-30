export class RenderProgress {
  startTime = 0;

  constructor(private element) {
  }

  start() {
    this.startTime = performance.now();
  }
  // TODO: super hack until dom framework integrated (e.g. React)
  update(type, percent) {
    const el = this.element.querySelector(`.progress--${type}`);
    const labelEl = el.querySelector(`.progress-label`);
    const barEl = el.querySelector(`.bar`);
    // labelEl.
    barEl.setAttribute('style', `width:${percent * 100}%`);
    this.updateTime();
  }
  updateTime() {
    const el = this.element.querySelector(`.progress--all`);
    const timeEl = el.querySelector(`.progress-time`);

    let time = (performance.now() - this.startTime) / 1000;
    let suffix = 'seconds';
    if (time > 60) {
      time /= 60;
      suffix = 'minutes'
    }
    time = Math.round(time * 100) / 100;
    timeEl.innerText = `${time} ${suffix}`;
  }
}
