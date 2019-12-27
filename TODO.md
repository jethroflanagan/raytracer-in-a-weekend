# features not in Raytracer guide
- tone mapping
- reflectance maps instead of numbers
- ui + scene editor
- inverse square lighting
- add proper rotation / reposition to camera
- hard (quick/clean) shadows -> ray to light with intersection = in shadow
- denoise setup for https://github.com/OpenImageDenoise/oidn (PFM support)

# optimization
- Change `for of` to normal `for i` loops with len calc'd in step 1
- bvh

# scene ideas
- flipped normals on sphere or cube with scene inside. Cube is reflective
