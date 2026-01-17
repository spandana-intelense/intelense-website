/**
 * Intelense Visuals Engine
 * High-performance interactive graphics for the Intelense platform.
 */

class NeuralCore {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: null, y: null };
        this.nodeCount = 80;
        this.connectionDistance = 150;

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.resize();
        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.nodes = [];
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw nodes
        this.nodes.forEach((node, i) => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 113, 227, 0.4)';
            this.ctx.fill();

            // Connections
            for (let j = i + 1; j < this.nodes.length; j++) {
                const other = this.nodes[j];
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.strokeStyle = `rgba(0, 113, 227, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse interaction
            if (this.mouse.x) {
                const mdx = node.x - this.mouse.x;
                const mdy = node.y - this.mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 200) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    const mopacity = 1 - (mdist / 200);
                    this.ctx.strokeStyle = `rgba(0, 113, 227, ${mopacity * 0.15})`;
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

class CameraLens {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        const lensContainer = document.createElement('div');
        lensContainer.className = 'lens-graphic';
        lensContainer.style.cssText = 'position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center;';

        // Create concentric rings
        for (let i = 0; i < 4; i++) {
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: absolute;
                border: 1px solid rgba(139, 92, 246, ${0.1 + (i * 0.05)});
                border-radius: 50%;
                width: ${150 + (i * 60)}px;
                height: ${150 + (i * 60)}px;
                animation: rotateLens ${20 + (i * 10)}s linear infinite ${i % 2 === 0 ? '' : 'reverse'};
            `;
            lensContainer.appendChild(ring);

            // Add lens "marks"
            const marks = 4;
            for (let j = 0; j < marks; j++) {
                const mark = document.createElement('div');
                const angle = (j / marks) * Math.PI * 2;
                mark.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 1px;
                    background: rgba(139, 92, 246, 0.3);
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) rotate(${angle}rad) translateX(${(150 + (i * 60)) / 2}px);
                `;
                ring.appendChild(mark);
            }
        }

        // Add aperture shape
        const aperture = document.createElement('div');
        aperture.style.cssText = `
            width: 100px;
            height: 100px;
            border: 2px dashed rgba(139, 92, 246, 0.2);
            border-radius: 50%;
            animation: pulseLens 4s ease-in-out infinite;
        `;
        lensContainer.appendChild(aperture);

        this.container.appendChild(lensContainer);

        // Add keyframes if not present
        if (!document.getElementById('lens-animations')) {
            const style = document.createElement('style');
            style.id = 'lens-animations';
            style.textContent = `
                @keyframes rotateLens { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulseLens { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.5; } }
            `;
            document.head.appendChild(style);
        }
    }
}

class Scanner {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.container.style.position = 'absolute';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.zIndex = '1';
        this.container.style.overflow = 'hidden';

        const line = document.createElement('div');
        line.className = 'scanner-line';
        this.container.appendChild(line);

        // Add subtle bounding boxes centered behind
        for (let i = 0; i < 4; i++) {
            this.createBox();
        }
    }

    createBox() {
        const box = document.createElement('div');
        box.className = 'scanner-box';
        const size = Math.random() * 80 + 40;
        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        box.style.left = `${Math.random() * 60 + 20}%`;
        box.style.top = `${Math.random() * 60 + 20}%`;
        box.style.opacity = '0.15';
        this.container.appendChild(box);

        setTimeout(() => {
            box.style.opacity = '0';
            setTimeout(() => {
                box.remove();
                this.createBox();
            }, 1000);
        }, Math.random() * 3000 + 2000);
    }
}

class WaveVisual {
    constructor(containerId, color = 'rgba(0, 113, 227, 0.2)') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.color = color;
        this.init();
    }

    init() {
        this.container.style.position = 'absolute';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.zIndex = '1';

        for (let i = 0; i < 4; i++) {
            const wave = document.createElement('div');
            wave.className = 'pulse-wave';
            wave.style.borderColor = this.color;
            wave.style.width = '200px';
            wave.style.height = '200px';
            wave.style.animationDelay = `${i * 1.5}s`;
            this.container.appendChild(wave);
        }
    }
}

class SensorNetwork {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        const nodeCount = 10;
        const radius = 140;
        const centerX = this.container.offsetWidth / 2 || 200;
        const centerY = this.container.offsetHeight / 2 || 200;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const node = document.createElement('div');
            node.className = 'iot-node';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.width = '8px';
            node.style.height = '8px';
            node.style.animationDelay = `${Math.random() * 2}s`;
            this.container.appendChild(node);

            const line = document.createElement('div');
            line.className = 'iot-line';
            line.style.left = `${centerX}px`;
            line.style.top = `${centerY}px`;
            line.style.width = `${radius}px`;
            line.style.transform = `rotate(${angle}rad)`;
            line.style.opacity = '0.05';
            this.container.appendChild(line);
        }
    }
}

class RoboticPath {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        for (let i = 0; i < 5; i++) {
            this.createEntity(i);
        }
    }

    createEntity(index) {
        const entity = document.createElement('div');
        entity.className = 'floating-robot';
        entity.innerHTML = `<i data-lucide="bot" style="width:18px; color:var(--accent-primary)"></i>`;
        entity.style.opacity = '0.4';
        this.container.appendChild(entity);
        lucide.createIcons();

        const radius = 120 + (index * 35);
        const duration = 15 + (index * 8);

        entity.style.animation = `orbit-${index} ${duration}s linear infinite`;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbit-${index} {
                from { transform: translate(-50%, -50%) rotate(0deg) translateX(${radius}px) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg) translateX(${radius}px) rotate(-360deg); }
            }
        `;
        document.head.appendChild(style);

        // Centering helper
        entity.style.position = 'absolute';
        entity.style.left = '50%';
        entity.style.top = '50%';
    }
}

class FieldGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const node = document.createElement('div');
            node.className = 'plant-node';
            node.style.opacity = '0.3';
            node.innerHTML = `<i data-lucide="sprout" style="width:14px;"></i>`;
            this.container.appendChild(node);
            if (Math.random() > 0.6) node.classList.add('active');
        }
        lucide.createIcons();
    }
}

class HomeNodes {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        const icons = ['home', 'shield', 'wifi', 'thermometer', 'lock'];
        for (let i = 0; i < 8; i++) {
            const node = document.createElement('div');
            node.className = 'home-node';
            node.style.position = 'absolute';
            node.style.left = `${Math.random() * 80 + 10}%`;
            node.style.top = `${Math.random() * 80 + 10}%`;
            node.style.opacity = '0.3';
            node.innerHTML = `<i data-lucide="${icons[i % icons.length]}" style="width:14px;"></i>`;
            this.container.appendChild(node);

            // Random movement
            node.animate([
                { transform: 'translate(0,0)' },
                { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)` }
            ], {
                duration: 3000 + Math.random() * 3000,
                direction: 'alternate',
                iterations: Infinity
            });
        }
        lucide.createIcons();
    }
}

class SafetyPins {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        for (let i = 0; i < 6; i++) {
            const pin = document.createElement('div');
            pin.className = 'safety-pin';
            pin.style.position = 'absolute';
            pin.style.left = `${Math.random() * 80 + 10}%`;
            pin.style.top = `${Math.random() * 80 + 10}%`;
            pin.style.opacity = '0.4';
            this.container.appendChild(pin);
        }
    }
}

// Initialize all visuals when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-hero-canvas')) new NeuralCore('home-hero-canvas');
    if (document.getElementById('iot-hero-visual')) new SensorNetwork('iot-hero-visual');
    if (document.getElementById('robotics-visual')) new RoboticPath('robotics-visual');
    if (document.getElementById('agri-grid')) new FieldGrid('agri-grid');
    if (document.getElementById('home-visual-nodes')) new HomeNodes('home-visual-nodes');
    if (document.getElementById('safety-visual-nodes')) new SafetyPins('safety-visual-nodes');
    if (document.getElementById('vision-lens-visual')) new CameraLens('vision-lens-visual');

    // Backward compatibility or generic scanner
    document.querySelectorAll('.visual-scanner:not(#vision-lens-visual)').forEach(el => {
        new Scanner(el.id || (el.id = 'scan-' + Math.random().toString(36).substr(2, 9)));
    });

    document.querySelectorAll('.visual-pulse').forEach(el => {
        new WaveVisual(el.id || (el.id = 'pulse-' + Math.random().toString(36).substr(2, 9)));
    });

    lucide.createIcons();
});
