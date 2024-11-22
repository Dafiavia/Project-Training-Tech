import * as THREE from 'three';

class HeroAnimation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        
        this.spheres = [];
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('hero-canvas').appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 30;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        this.scene.add(directionalLight);

        // Create spheres
        this.createSpheres();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Start animation
        this.animate();
    }

    createSpheres() {
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x4CAF50, shininess: 100 }), // Green
            new THREE.MeshPhongMaterial({ color: 0x2196F3, shininess: 100 }), // Blue
            new THREE.MeshPhongMaterial({ color: 0x8BC34A, shininess: 100 })  // Light Green
        ];

        // Create multiple spheres
        for (let i = 0; i < 15; i++) {
            const material = materials[Math.floor(Math.random() * materials.length)];
            const sphere = new THREE.Mesh(sphereGeometry, material);

            // Random position
            sphere.position.x = (Math.random() - 0.5) * 40;
            sphere.position.y = (Math.random() - 0.5) * 40;
            sphere.position.z = (Math.random() - 0.5) * 40;

            // Add velocity for animation
            sphere.velocity = {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            };

            this.spheres.push(sphere);
            this.scene.add(sphere);
        }

        // Add connecting lines
        this.lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x4CAF50,
            transparent: true,
            opacity: 0.3
        });
    }

    drawConnections() {
        // Remove old lines
        this.scene.children = this.scene.children.filter(child => child.type !== 'Line');

        // Draw new connections
        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = i + 1; j < this.spheres.length; j++) {
                const distance = this.spheres[i].position.distanceTo(this.spheres[j].position);
                
                if (distance < 15) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        this.spheres[i].position,
                        this.spheres[j].position
                    ]);
                    const line = new THREE.Line(geometry, this.lineMaterial);
                    this.scene.add(line);
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update sphere positions
        this.spheres.forEach(sphere => {
            sphere.position.x += sphere.velocity.x;
            sphere.position.y += sphere.velocity.y;
            sphere.position.z += sphere.velocity.z;

            // Bounce off boundaries
            if (Math.abs(sphere.position.x) > 20) sphere.velocity.x *= -1;
            if (Math.abs(sphere.position.y) > 20) sphere.velocity.y *= -1;
            if (Math.abs(sphere.position.z) > 20) sphere.velocity.z *= -1;

            // Rotate spheres
            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;
        });

        // Update connections
        this.drawConnections();

        // Rotate camera slowly
        this.camera.position.x = 30 * Math.cos(Date.now() * 0.0005);
        this.camera.position.z = 30 * Math.sin(Date.now() * 0.0005);
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default HeroAnimation;