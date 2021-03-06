export default function Sample(p5, {
  sample, x, y, w, h, bgOn = [199, 185, 110], focused, seqLen,
}) {
  const bgOff = [149, 134, 58];
  const bgSelectedOn = [0, 0, 0];
  const bgSelectedOff = [255, 255, 255];

  return {
    focused,
    sample,
    isDragged: false,
    isClicked: false,
    selected: false,
    on: false,
    pattern: Array(seqLen).fill(false),
    temp: false,
    render(step, i) {
      p5.noStroke();
      if (step) {
        p5.fill(...this.selected ? bgSelectedOn : bgOn);
      } else {
        p5.fill(...this.selected ? bgSelectedOff : bgOff);
      }
      p5.rect(x, y, w, h);
      if (this.pattern[i] && !this.on) {
        this.sample.start();
        this.on = true;
      }

      if (this.focused) {
        p5.fill(100);
        p5.circle(x + w / 2, y + h + 15, 10, 10);
      }
    },
    select() {
      if (p5.mouseX >= x && p5.mouseX <= x + w && p5.mouseY >= y && p5.mouseY <= y + h) {
        this.selected = !this.selected;
        return true;
      }
      return false;
    },
    drag() {
      if (!this.isClicked) {
        if (p5.mouseX >= x && p5.mouseX <= x + w && p5.mouseY >= y && p5.mouseY <= y + h) {
          // this.selected = !this.selected;
          this.isDragged = true;
        } else if (this.isDragged) {
          this.selected = !this.selected;
          this.isDragged = false;
        }
      }
      return this.selected;
    },
  };
}
