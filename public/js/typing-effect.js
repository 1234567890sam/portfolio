// Typing Effect for Hero Section
class TypingEffect {
    constructor(element, phrases, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
        this.element = element;
        this.phrases = phrases;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseDuration = pauseDuration;
        this.currentPhraseIndex = 0;
        this.currentText = '';
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isDeleting) {
            this.currentText = currentPhrase.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentPhrase.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.currentText === currentPhrase) {
            // Pause at end of phrase
            typeSpeed = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // Move to next phrase
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            typeSpeed = 500; // Pause before starting new phrase
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'Web Developer',
        'Cybersecurity Enthusiast',
        'Digital Architect',
        'Full-Stack Engineer',
        'Problem Solver'
    ];

    new TypingEffect(typingElement, phrases);
});
