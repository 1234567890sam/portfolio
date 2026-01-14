// Performance optimization: Reduce animations on slower devices
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Disable heavy animations
        document.body.classList.add('reduce-motion');
    }

    // Detect slower devices (simple heuristic)
    const isSlowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    if (isSlowerDevice) {
        // Reduce particle count further
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
            canvas.style.opacity = '0.1';
        }
    }
});
