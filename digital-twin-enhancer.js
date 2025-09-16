// Digital Twin Enhancer Bookmarklet
// Adds professional contact modal, social media links, and UI improvements
// to your live website without redeployment

(function() {
    'use strict';
    
    // Check if already enhanced
    if (document.getElementById('dt-enhancer-active')) {
        alert('✨ Digital Twin already enhanced!');
        return;
    }
    
    // Mark as enhanced
    const marker = document.createElement('div');
    marker.id = 'dt-enhancer-active';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    // Add enhanced CSS styles
    const styles = `
        <style id="dt-enhancer-styles">
            /* Contact Modal Styles */
            .dt-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.8);
                backdrop-filter: blur(5px);
                animation: dt-fadeIn 0.3s ease-out;
            }
            
            .dt-modal-content {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                margin: 5% auto;
                padding: 0;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                animation: dt-slideUp 0.4s ease-out;
                position: relative;
                overflow: hidden;
            }
            
            .dt-modal-header {
                background: rgba(255,255,255,0.1);
                padding: 25px 30px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                text-align: center;
            }
            
            .dt-modal-header h2 {
                color: white;
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .dt-modal-body {
                padding: 30px;
                text-align: center;
                color: white;
            }
            
            .dt-close {
                position: absolute;
                right: 20px;
                top: 20px;
                color: white;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                background: rgba(255,255,255,0.1);
            }
            
            .dt-close:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            
            .dt-social-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 20px;
                margin-top: 25px;
            }
            
            .dt-social-item {
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 20px;
                text-decoration: none;
                color: white;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .dt-social-item:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(255,255,255,0.4);
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            }
            
            .dt-social-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .dt-social-item:hover::before {
                left: 100%;
            }
            
            .dt-social-icon {
                font-size: 24px;
                margin-bottom: 10px;
                display: block;
            }
            
            .dt-social-name {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
            }
            
            /* Enhanced UI Improvements */
            .dt-enhancement-badge {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 12px;
                font-weight: 600;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                animation: dt-pulse 2s infinite;
            }
            
            .dt-floating-contact {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                transition: all 0.3s ease;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .dt-floating-contact:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(59, 130, 246, 0.6);
            }
            
            /* Mobile Improvements */
            @media (max-width: 768px) {
                .dt-modal-content {
                    width: 95%;
                    margin: 10% auto;
                }
                
                .dt-modal-header h2 {
                    font-size: 24px;
                }
                
                .dt-social-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .dt-floating-contact {
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                }
            }
            
            /* Animations */
            @keyframes dt-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes dt-slideUp {
                from { 
                    opacity: 0; 
                    transform: translateY(50px) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            
            @keyframes dt-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            /* Enhanced existing elements */
            body {
                transition: all 0.3s ease !important;
            }
            
            /* Smooth scroll enhancement */
            html {
                scroll-behavior: smooth !important;
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', styles);
    
    // Create contact modal HTML
    const modalHTML = `
        <div id="dt-contact-modal" class="dt-modal">
            <div class="dt-modal-content">
                <div class="dt-modal-header">
                    <span class="dt-close">&times;</span>
                    <h2>🤝 Let's Connect!</h2>
                </div>
                <div class="dt-modal-body">
                    <p style="margin-bottom: 25px; font-size: 16px; opacity: 0.9;">
                        Ready to discuss opportunities? Let's connect through any of these platforms:
                    </p>
                    
                    <div class="dt-social-grid">
                        <a href="https://facebook.com/earl.pacho.5" target="_blank" class="dt-social-item" title="Connect on Facebook">
                            <span class="dt-social-icon">📘</span>
                            <p class="dt-social-name">Facebook</p>
                        </a>
                        
                        <a href="https://instagram.com/earl.pacho" target="_blank" class="dt-social-item" title="Follow on Instagram">
                            <span class="dt-social-icon">📷</span>
                            <p class="dt-social-name">Instagram</p>
                        </a>
                        
                        <a href="https://linkedin.com/in/earl-pacho" target="_blank" class="dt-social-item" title="Connect professionally">
                            <span class="dt-social-icon">💼</span>
                            <p class="dt-social-name">LinkedIn</p>
                        </a>
                        
                        <a href="https://github.com/earl092004" target="_blank" class="dt-social-item" title="View my code">
                            <span class="dt-social-icon">💻</span>
                            <p class="dt-social-name">GitHub</p>
                        </a>
                        
                        <a href="mailto:pachoearlsean@gmail.com" class="dt-social-item" title="Send me an email">
                            <span class="dt-social-icon">✉️</span>
                            <p class="dt-social-name">Email</p>
                        </a>
                        
                        <a href="tel:+639123456789" class="dt-social-item" title="Call me">
                            <span class="dt-social-icon">📞</span>
                            <p class="dt-social-name">Phone</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add floating contact button
    const floatingButton = `
        <button id="dt-floating-contact" class="dt-floating-contact" title="Contact Me">
            💬
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', floatingButton);
    
    // Add enhancement badge
    const badge = `
        <div class="dt-enhancement-badge">
            ✨ Enhanced UI Active
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', badge);
    
    // Add event listeners
    const modal = document.getElementById('dt-contact-modal');
    const floatingBtn = document.getElementById('dt-floating-contact');
    const closeBtn = document.querySelector('.dt-close');
    
    // Open modal functions
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    floatingBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Enhance existing contact link if it exists
    const existingContactLink = document.querySelector('a[href="#contact"]');
    if (existingContactLink) {
        existingContactLink.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Show success notification
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.innerHTML = '🎉 Digital Twin Enhanced Successfully!';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: 600;
            font-size: 16px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            animation: dt-slideUp 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'dt-fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }, 500);
    
    console.log('🚀 Digital Twin Enhanced Successfully!');
    console.log('✨ Features added: Contact Modal, Social Links, Enhanced UI');
    console.log('💡 Click the floating button or "Contact" link to try it out!');
    
})();