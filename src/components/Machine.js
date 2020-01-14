import React, { useEffect } from 'react';
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

import Sample from './Sample';
import AudioUnit from './AudioUnit';
import Button from './Button';

/* eslint-disable no-undef */
export default function Machine() {
  const bass = new p5.Oscillator();
  //const metronome;

  const DIM = { x: 1050, y: 640 };
  const FPS = 60;
  const SAMPLES = 16;

  const params = {
    bpm: 120,
    step: 0,
    clickables: {
      samples: [],
      buttons: [],
      encoders: [],
    },
    muted: false,
    paused: false,
    focused: 0
  };

  function sketch(p5) {
    let kick;
    p5.preload = () => {
      // p5.soundFormats('mp3', 'wav');
      // kick = new p5.loadSound('/sounds/kick.wav');
    }
    p5.mousePressed = () => {
      for (const key in params.clickables) {
        for (const click of params.clickables[key]) {
          click.select();
        }
      }
    }
    p5.keyPressed = () => {
      if (p5.keyCode === p5.LEFT_ARROW || p5.keyCode === p5.RIGHT_ARROW) {
        // create temp var
        params.clickables.samples[params.focused].focused = false;
        if (p5.keyCode === p5.LEFT_ARROW) {
          if (params.focused === 0) {
            params.focused = SAMPLES - 1;
          } else {
            params.focused--;
          }
        } else {
          if (params.focused === SAMPLES - 1) {
            params.focused = 0;
          } else {
            params.focused++;
          }
        }
        params.clickables.samples[params.focused].focused = true;

      }
    }
    p5.setup = () => {
      p5.frameRate(FPS);
      p5.createCanvas(window.innerWidth, window.innerHeight);
      bass.setType('sine');
      bass.amp(0.5);

      // Create samples
      for (let i = 0; i < SAMPLES; i++) {
        params.clickables.samples.push(
          new Sample(p5, {
            sample: new AudioUnit(bass, {}),
            pattern: SAMPLES,
            x: i * (DIM.x / SAMPLES) + DIM.x / SAMPLES / 4,
            y: DIM.y - DIM.y * .25,
            w: DIM.x / SAMPLES / 2,
            h: DIM.y * .2,
            focused: i === params.focused ? true : false
          })
        );
      }
      // Play / pause
      params.clickables.buttons.push(
        new Button(p5, () => {
          params.paused = !params.paused;
        }, { x: 200, y: 200 })
      );
      console.log(params.clickables.samples);
    }
    p5.draw = () => {
      canvas(p5);

      // Knobs
      p5.circle(DIM.x * .93, DIM.y * .1, 50, 50);


      if (!params.paused && Math.floor(p5.frameCount % (FPS * 60 / params.bpm / 4)) === 0) {
        if (params.step % 4 === 0) {
          // metronome click
        }
        params.step = (params.step + 1) % SAMPLES;
      }

      params.clickables.samples.forEach((e, i) => {
        e.render(i === params.step);
      });
      for (const button of params.clickables.buttons) {
        button.render();
      }
    }
  }

  function canvas(p5) {
    p5.background(255);
    p5.fill(40, 40, 50);
    p5.rect(0, 0, DIM.x, DIM.y);
    p5.stroke(255);
    p5.line(0, DIM.y * .2, DIM.x, DIM.y * .2);
    p5.line(0, DIM.y * .7, DIM.x, DIM.y * .7);
  }

  useEffect(() => {
    new p5(sketch);
  });

  return (
    <div className="Machine">
      <noscript>Please enable JavaScript to use this application</noscript>
    </div>
  );
}