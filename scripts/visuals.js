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

class Scanner {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';

        const line = document.createElement('div');
        line.className = 'scanner-line';
        this.container.appendChild(line);

        // Add some random bounding boxes
        for (let i = 0; i < 3; i++) {
            this.createBox();
        }
    }

    createBox() {
        const box = document.createElement('div');
        box.className = 'scanner-box';
        const size = Math.random() * 50 + 30;
        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        box.style.left = `${Math.random() * 80}%`;
        box.style.top = `${Math.random() * 80}%`;
        this.container.appendChild(box);

        setTimeout(() => {
            box.style.opacity = '0';
            setTimeout(() => {
                box.remove();
                this.createBox();
            }, 1000);
        }, Math.random() * 2000 + 1000);
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
        this.container.style.position = 'relative';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'pulse-wave';
            wave.style.borderColor = this.color;
            wave.style.animationDelay = `${i * 1}s`;
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
        const nodeCount = 8;
        const radius = 120;
        const centerX = this.container.offsetWidth / 2;
        const centerY = this.container.offsetHeight / 2;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const node = document.createElement('div');
            node.className = 'iot-node';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.animationDelay = `${Math.random() * 2}s`;
            this.container.appendChild(node);

            const line = document.createElement('div');
            line.className = 'iot-line';
            line.style.left = `${centerX}px`;
            line.style.top = `${centerY}px`;
            line.style.width = `${radius}px`;
            line.style.transform = `rotate(${angle}rad)`;
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
        for (let i = 0; i < 4; i++) {
            this.createEntity(i);
        }
    }

    createEntity(index) {
        const entity = document.createElement('div');
        entity.className = 'floating-robot';
        entity.innerHTML = `<i data-lucide="bot" style="width:20px; color:var(--accent-blue)"></i>`;
        this.container.appendChild(entity);
        lucide.createIcons();

        const radius = 100 + (index * 40);
        const duration = 10 + (index * 5);

        entity.style.animation = `orbit-${index} ${duration}s linear infinite`;

        // Create style for dynamic orbit
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbit-${index} {
                from { transform: rotate(0deg) translateX(${radius}px) rotate(0deg); }
                to { transform: rotate(360deg) translateX(${radius}px) rotate(-360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

class FieldGrid {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        for (let i = 0; i < 25; i++) {
            const node = document.createElement('div');
            node.className = 'plant-node';
            node.innerHTML = `<i data-lucide="sprout" style="width:16px;"></i>`;
            this.container.appendChild(node);

            // Randomly activate nodes
            if (Math.random() > 0.7) {
                node.classList.add('active');
            }
        }
        lucide.createIcons();
    }
}


class PrivacyFlow {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        const grid = this.container.querySelector('.privacy-grid');
        if (!grid) return;

        // Add dynamic particles flowing from left to right
        setInterval(() => {
            this.createParticle(grid);
        }, 1000);
    }

    createParticle(parent) {
        const particle = document.createElement('div');
        particle.className = 'privacy-particle';
        particle.innerHTML = `<i data-lucide="lock" style="width:12px; color:var(--accent-blue)"></i>`;
        parent.appendChild(particle);
        lucide.createIcons();

        const duration = 3000;
        particle.style.animation = `flow-right ${duration}ms ease-in-out forwards`;

        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}

class CommandSphere {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '400px';
        this.container.style.display = 'flex';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';

        const sphere = document.createElement('div');
        sphere.className = 'sphere-core';
        this.container.appendChild(sphere);

        // Add orbiting rings
        for (let i = 0; i < 3; i++) {
            const ring = document.createElement('div');
            ring.className = `sphere-ring ring-${i}`;
            this.container.appendChild(ring);
        }

        // Add icons for products
        const icons = ['camera', 'cpu', 'bot', 'sprout', 'home', 'shield'];
        icons.forEach((icon, index) => {
            const iconEl = document.createElement('div');
            iconEl.className = 'sphere-icon';
            iconEl.innerHTML = `<i data-lucide="${icon}" style="width:18px;"></i>`;
            iconEl.style.animation = `float-icon-${index} 20s linear infinite`;
            this.container.appendChild(iconEl);

            const angle = (index / icons.length) * Math.PI * 2;
            const radius = 150;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes float-icon-${index} {
                    from { transform: rotate(${angle}rad) translateX(${radius}px) rotate(-${angle}rad); }
                    to { transform: rotate(${angle + Math.PI * 2}rad) translateX(${radius}px) rotate(-${angle + Math.PI * 2}rad); }
                }
            `;
            document.head.appendChild(style);
        });

        lucide.createIcons();
    }
}

class UIMockup {
    constructor(containerId, type) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.type = type;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.background = '#050505';
        this.container.style.overflow = 'hidden';

        switch (this.type) {
            case 'heatmap': this.createHeatmap(); break;
            case 'dwell': this.createDwell(); break;
            case 'demographics': this.createDemographics(); break;
            case 'alert': this.createAlert(); break;
            case 'network': this.createNetwork(); break;
        }
        lucide.createIcons();
    }

    createHeatmap() {
        // Create a fake grid with glowing spots
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid; grid-template-columns: repeat(10,1fr); gap:2px; width:100%; height:100%; opacity:0.3;';
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.style.background = 'rgba(255,255,255,0.05)';
            grid.appendChild(cell);
        }
        this.container.appendChild(grid);

        for (let i = 0; i < 5; i++) {
            const spot = document.createElement('div');
            spot.className = 'heatmap-spot';
            spot.style.left = `${Math.random() * 80 + 10}%`;
            spot.style.top = `${Math.random() * 80 + 10}%`;
            spot.style.width = `${Math.random() * 100 + 50}px`;
            spot.style.height = spot.style.width;
            spot.style.animationDelay = `${Math.random() * 2}s`;
            this.container.appendChild(spot);
        }
    }

    createDwell() {
        const circle = document.createElement('div');
        circle.className = 'dwell-circle';
        this.container.appendChild(circle);

        const label = document.createElement('div');
        label.className = 'mockup-label';
        label.innerHTML = `<i data-lucide="clock" style="width:12px;"></i> 14m 22s`;
        label.style.left = '60%';
        label.style.top = '40%';
        this.container.appendChild(label);
    }

    createDemographics() {
        const stats = [
            { label: 'Male', val: '64%', color: '#00D1FF' },
            { label: 'Female', val: '36%', color: '#FF00E5' }
        ];
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'display:flex; gap:20px; align-items:flex-end; height:60px;';
        stats.forEach(s => {
            const col = document.createElement('div');
            col.style.cssText = `width:30px; height:${s.val}; background:${s.color}; border-radius:4px 4px 0 0; position:relative;`;
            const t = document.createElement('span');
            t.innerText = s.val;
            t.style.cssText = 'position:absolute; top:-20px; left:0; font-size:10px; color:#FFF;';
            col.appendChild(t);
            wrapper.appendChild(col);
        });
        this.container.appendChild(wrapper);
    }

    createAlert() {
        const box = document.createElement('div');
        box.className = 'alert-box-mockup';
        box.innerHTML = `<div class="tag" style="color:#FF3B30; margin-bottom:5px;">WARNING</div><div>Unauthorized Entry</div>`;
        this.container.appendChild(box);

        const scanner = document.createElement('div');
        scanner.className = 'scanner-line';
        this.container.appendChild(scanner);
    }

    createNetwork() {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;';

        // Central node
        const core = document.createElement('div');
        core.style.cssText = 'width:20px; height:20px; background:var(--accent-blue); border-radius:50%; box-shadow:0 0 20px var(--accent-blue); z-index:2;';
        wrapper.appendChild(core);

        // Orbiting nodes
        for (let i = 0; i < 6; i++) {
            const node = document.createElement('div');
            node.style.cssText = `position:absolute; width:6px; height:6px; background:rgba(255,255,255,0.5); border-radius:50%; animation: orbit-mockup-${i} ${3 + i}s linear infinite;`;
            wrapper.appendChild(node);

            const radius = 60 + (i * 10);
            const style = document.createElement('style');
            style.textContent = `
                @keyframes orbit-mockup-${i} {
                    from { transform: rotate(0deg) translateX(${radius}px); }
                    to { transform: rotate(360deg) translateX(${radius}px); }
                }
            `;
            document.head.appendChild(style);
        }
        this.container.appendChild(wrapper);
    }
}

// Initialize all visuals when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('home-hero-canvas')) new NeuralCore('home-hero-canvas');
    if (document.getElementById('iot-hero-visual')) new SensorNetwork('iot-hero-visual');
    if (document.getElementById('robotics-visual')) new RoboticPath('robotics-visual');
    if (document.getElementById('agri-grid')) new FieldGrid('agri-grid');
    if (document.getElementById('command-sphere')) new CommandSphere('command-sphere');
    if (document.getElementById('privacy-flow')) new PrivacyFlow('privacy-flow');

    // Auto-init based on data attributes or classes
    document.querySelectorAll('.visual-scanner').forEach(el => {
        new Scanner(el.id || (el.id = 'scan-' + Math.random().toString(36).substr(2, 9)));
    });

    document.querySelectorAll('.visual-pulse').forEach(el => {
        new WaveVisual(el.id || (el.id = 'pulse-' + Math.random().toString(36).substr(2, 9)));
    });

    document.querySelectorAll('.visual-mockup').forEach(el => {
        const type = el.getAttribute('data-type');
        new UIMockup(el.id || (el.id = 'mockup-' + Math.random().toString(36).substr(2, 9)), type);
    });

    lucide.createIcons();
});
