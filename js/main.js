gsap.registerPlugin(ScrollTrigger);

// Set initial state to prevent FOUC
gsap.set(".reveal-text", { visibility: "visible" });

// Utility function for text reveal animation
function createTextReveal(element, delay = 0) {
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    return gsap.from(element, {
        yPercent: 100,
        duration: 1.2,
        ease: "power2.out",
        delay: delay,
        force3D: true,
        willChange: "transform"
    });
}

// Hero section animation
function initHeroAnimations() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top center",
            toggleActions: "play none none none"
        },
        defaults: {
            force3D: true,
            willChange: "transform"
        }
    });

    // Animate the main title
    tl.to("h1", {
        y: "0%",
        duration: 1.5,
        ease: "power2.out"
    });

    // Animate the hero image
    tl.to(".hero-image", {
        height: "40vh",
        duration: 1.5,
        ease: "expo.out"
    })
    .from(".hero-image img", {
        scale: 1.5,
        filter: "blur(10px)",
        duration: 1,
        ease: "expo.out"
    }, "<");

    // Animate all text elements with reveal effect
    const textElements = document.querySelectorAll('.reveal-text');
    textElements.forEach((element, index) => {
        createTextReveal(element, 0.1 * index + 0.5);
    });
}

// Initialize animations when DOM is loaded
function initGridAnimation() {
    const gridContainer = document.querySelector('.perspective-grid');
    gridContainer.innerHTML = '';

    // Create vertical lines with absolute positioning
    for(let i = 0; i <= 20; i++) {
        const vLine = document.createElement('div');
        vLine.className = 'grid-line-vertical';
        vLine.style.left = `${(i / 20) * 100}vw`;
        gridContainer.appendChild(vLine);
    }

    // Create horizontal lines with absolute positioning
    for(let i = 0; i <= 20; i++) {
        const hLine = document.createElement('div');
        hLine.className = 'grid-line-horizontal';
        hLine.style.top = `${(i / 20) * 100}vw`;
        gridContainer.appendChild(hLine);
    }

    // Animate lines with ScrollTrigger
    gsap.fromTo('.grid-line-vertical', 
        { height: '0%' },
        {
            height: '100%',
            duration: 1.2,
            stagger: 0.03,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: '.perspective-grid',
                start: 'top center',
                toggleActions: 'play none none none'
            }
        }
    );

    gsap.fromTo('.grid-line-horizontal', 
        { width: '0%' },
        {
            width: '100%',
            duration: 1.2,
            stagger: 0.03,
            ease: 'power2.inOut',
            delay: 0.3,
            scrollTrigger: {
                trigger: '.perspective-grid',
                start: 'top center',
                toggleActions: 'play none none none'
            }
        }
    );
}

// Add this to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initGridAnimation();
});

// Text Line-by-line Animation
(function() {
    let textAnim;
    const textSplitters = [];
  
    const doTextLines = () => {
      textAnim && textAnim.progress(1);
      
      // Clear previous instances
      textSplitters.forEach(splitter => splitter.revert());
      textSplitters.length = 0;
  
      // Process each text element individually
      document.querySelectorAll("[data-split='lines']").forEach(element => {
        // Split text for animation
        const typeSplit = new SplitText(element, { 
          types: "lines", 
          linesClass: "lineChild"
        });
        
        // Create mask for smooth effect
        const maskSplit = new SplitText(element, { 
          types: "lines", 
          linesClass: "lineParent"
        });
        
        textSplitters.push(typeSplit, maskSplit);
  
        // Animation setup for this element
        gsap.set(typeSplit.lines, { opacity: 1 });
        
        textAnim = gsap.fromTo(typeSplit.lines, { yPercent: 200 }, {
          yPercent: 0,
          duration: 1,
          stagger: 0.08,
          delay: -0.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "bottom 20%",
            markers: false
          }
        });
      });
    };
  
    // DOM Ready Event
    document.addEventListener("DOMContentLoaded", () => {
      doTextLines();  // Lines animation with mask
    });
  
    // Resize event - Debounced
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        doTextLines();  // Lines animation refresh
      }, 0.1); 
    });
  })();
  

//   44444

gsap.timeline({
    scrollTrigger: {
        trigger: ".eng-image",
        start: "top center",
        toggleActions: "play none none none"
    }
})
.to(".eng-image", {
    height: "40vh",
    duration: 1.5,
    ease: "expo.out"
})
.from(".eng-image img", {
    scale: 1.5,
    filter: "blur(10px)",
    duration: 1,
    ease: "expo.out"
}, "<");

