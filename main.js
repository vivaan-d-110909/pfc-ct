document.addEventListener('DOMContentLoaded', function() {
    // Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const alert = this.parentElement.querySelector('.alert');
            if(alert) {
                alert.classList.remove('d-none');
                this.reset();
            }
        });
    });

    // Scroll Animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if(elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'btn btn-primary rounded-circle floating-top-btn';
    backToTop.style.display = 'none';
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '20px';
    backToTop.style.right = '20px';
    backToTop.style.width = '50px';
    backToTop.style.height = '50px';
    backToTop.style.fontSize = '1.5rem';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Dynamic Copyright Year
    document.querySelectorAll('.copyright-year').forEach(element => {
        element.textContent = new Date().getFullYear();
    });
});

// PawBuddy ChatGPT Integration
const pawBuddy = {
    init() {
        this.chatForm = document.getElementById('chat-form');
        this.userInput = document.getElementById('user-input');
        this.chatMessages = document.getElementById('chat-messages');
        
        if(this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        const message = this.userInput.value.trim();
        if(!message) return;

        this.addMessage(message, 'user');
        this.userInput.value = '';

        try {
            const response = await this.getChatResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            this.addMessage("Oops! I'm having trouble connecting. Try again later.", 'bot');
        }
    },

    async getChatResponse(message) {
        const response = await fetch('YOUR_BACKEND_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "You are PawBuddy, a friendly assistant for CollegeTips.in's Pet-Friendly City campaign..."
                }, {
                    role: "user",
                    content: message
                }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    },

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => pawBuddy.init());
