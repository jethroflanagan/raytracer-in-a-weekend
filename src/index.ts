import { create as createTestScene } from 'src/demo/testScene';
import { create as createDemoScene } from 'src/demo/demoScene';
import { create as createBookCoverScene } from 'src/demo/bookCoverScene';
import { Renderer } from 'src/Renderer';
import "src/style.css";

// TODO: add to scene and move render code into renderer
function render(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const aspectRatio = width / height;

  const { scene, camera } = createDemoScene({ aspectRatio, width, height });
  // const { scene, camera } = createTestScene({ aspectRatio, width, height });
  // const { scene, camera } = createBookCoverScene({ aspectRatio, width, height });
  const renderer = new Renderer({ canvas, camera, scene });

  // renderer.render({
  //   antialias: { numSamples: 5, blurRadius: .5, isUniform: false },
  //   quality: 5,
  //   resolution: 1,
  // });

  renderer.render({
    antialias: { numSamples: 5, blurRadius: .5, isUniform: false },
    quality: 5,
    resolution: 1,
    time: 200, timeIncrement: 5,
  });
  // renderer.render({ quality: 1, resolution: .5, time: 500, timeIncrement: 50 });
}

(function run() {
  render(document.getElementById('render'));
})();
