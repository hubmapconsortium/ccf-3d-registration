This 3D registration prototype was created using three.js (https://threejs.org/).

A rectangular cylinder ("kidney") is created near the origin of the 3D scene. Inside the cylinder, a set amount of spheres is created, each being assigned one our of three colors at random. 
Then, a smaller cylinder ("sliver") is generated. We then determine how many spheres are *completely* inside the larger cylinder, copy those, and add them to the sliver.
The sliver is then translated away from the kidney along the x-axis. All of this happens at startup. 