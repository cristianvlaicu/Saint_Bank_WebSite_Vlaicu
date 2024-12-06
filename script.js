'use strict';

/* ******************************************************************************** */

// Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/* ******************************************************************************** */

// Modal window

// Function to open the modal
const openModal = function (e) {
  e.preventDefault(); // Prevent default action of the event
  modal.classList.remove('hidden'); // Remove 'hidden' class from modal
  overlay.classList.remove('hidden'); // Remove 'hidden' class from overlay
};

// Function to close the modal
const closeModal = function () {
  modal.classList.add('hidden'); // Add 'hidden' class to modal
  overlay.classList.add('hidden'); // Add 'hidden' class to overlay
};

// Add click event listener to each button to open the modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Add click event listener to close button to close the modal
btnCloseModal.addEventListener('click', closeModal);

// Add click event listener to the overlay to close the modal
overlay.addEventListener('click', closeModal);

// Add keydown event listener to the document for 'Escape' key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal(); // Close modal if 'Escape' is pressed and modal is not hidden
  }
});

/* ******************************************************************************** */

// Button scrolling
btnScrollTo.addEventListener('click', function () {
  section1.getBoundingClientRect(); // Get bounding rectangle of section1

  section1.scrollIntoView({ inline: 'center', behavior: 'smooth' }); // Smooth scroll to section1
});

/* ******************************************************************************** */

// Page navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default action of the event

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // Get href attribute of the target
    document
      .querySelector(id)
      .scrollIntoView({ inline: 'center', behavior: 'smooth' }); // Smooth scroll to target section
  }
});

/* ******************************************************************************** */

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // Find closest tab element

  // Guard clause
  if (!clicked) return; // If no tab clicked, return

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active')); // Remove active class from all tabs
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  ); // Remove active class from all content

  // Activate tab
  clicked.classList.add('operations__tab--active'); // Add active class to clicked tab

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`) // Find corresponding content
    .classList.add('operations__content--active'); // Add active class to content
});

/* ******************************************************************************** */

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    // Check if target is a navigation link
    const link = e.target; // Get the target link
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // Get all navigation links
    const logo = link.closest('.nav').querySelector('img'); // Get the logo

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // Adjust opacity for non-target links
    });
    logo.style.opacity = this; // Adjust opacity for the logo
  }
};

// Passing a "function argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // Set opacity to 0.5 on hover
nav.addEventListener('mouseout', handleHover.bind(1)); // Reset opacity to 1 on mouse out

/* ******************************************************************************** */

// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header'); // Select header element
// const navHeight = nav.getBoundingClientRect().height; // Get height of navigation

// const stickyNav = function (entries) {
//   const [entry] = entries; // Get the first entry

//   if (entry.isIntersecting) nav.classList.add('sticky'); // Add 'sticky' class if entry is intersecting
//   // "!", else nav.classList.remove('sticky'); // Remove 'sticky' class otherwise
// };

// const headerObserver = new IntersectionObserver(stickyNav, {
//   root: null, // Observe within the viewport
//   threshold: 0, // Trigger at 0% visibility
//   // rootMargin: `-${navHeight}px`, // Offset by navigation height
// });

// headerObserver.observe(header); // Observe the header

/* ******************************************************************************** */

// Reveal sections
const allSections = document.querySelectorAll('.section'); // Select all sections

const revealSection = function (entries, observer) {
  const [entry] = entries; // Get the first entry

  if (!entry.isIntersecting) return; // If entry is not intersecting, return

  entry.target.classList.remove('section--hidden'); // Remove 'hidden' class from the target
  observer.unobserve(entry.target); // Stop observing the target
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, // Observe within the viewport
  threshold: 0.3, // Trigger at 30% visibility
});

allSections.forEach(function (section) {
  sectionObserver.observe(section); // Observe each section
  section.classList.add('section--hidden'); // Add 'hidden' class to each section
});

/* ******************************************************************************** */

// Lazy loading images

// Select all image elements with the attribute 'data-src'
const imgTargets = document.querySelectorAll('img[data-src]');

// Function to load images when they intersect
const loadImg = function (entries, observer) {
  const [entry] = entries; // Get the first entry

  if (!entry.isIntersecting) return; // If not intersecting, return

  // Replace 'src' with 'data-src'
  entry.target.src = entry.target.dataset.src;

  // Remove 'lazy-img' class after the image has loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target); // Stop observing the image
};

// Create IntersectionObserver to load images
const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // Observe within the viewport
  threshold: 0, // Trigger when 0% of the image is visible
  rootMargin: '200px', // Load images 200px before they appear
});

// Observe each target image
imgTargets.forEach(img => imgObserver.observe(img));

/* ******************************************************************************** */

// Slider functionality
const slider = function () {
  const slides = document.querySelectorAll('.slide'); // Select all slide elements
  const btnLeft = document.querySelector('.slider__btn--left'); // Select left button
  const btnRight = document.querySelector('.slider__btn--right'); // Select right button
  const dotContainer = document.querySelector('.dots'); // Select dot container

  let curSlide = 0; // Current slide index
  const maxSlide = slides.length; // Total number of slides

  // Function to create dots for navigation
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend', // Add dots to the end of the container
        `<button class="dots__dot" data-slide="${i}"></button>` // Add a button for each slide
      );
    });
  };

  // Function to activate a specific dot
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot') // Select all dots
      .forEach(dot => dot.classList.remove('dots__dot--active')); // Remove active class from all dots

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) // Select the current dot
      .classList.add('dots__dot--active'); // Add active class to the current dot
  };

  // Function to move slides
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`) // Move each slide relative to the current slide
    );
  };

  // Move to the next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      // If on the last slide
      curSlide = 0; // Go to the first slide
    } else {
      curSlide++; // Otherwise, go to the next slide
    }

    goToSlide(curSlide); // Move to the current slide
    activateDot(curSlide); // Activate the corresponding dot
  };

  // Move to the previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      // If on the first slide
      curSlide = maxSlide - 1; // Go to the last slide
    } else {
      curSlide--; // Otherwise, go to the previous slide
    }
    goToSlide(curSlide); // Move to the current slide
    activateDot(curSlide); // Activate the corresponding dot
  };

  // Initialize the slider
  const init = function () {
    goToSlide(0); // Start with the first slide
    createDots(); // Create navigation dots
    activateDot(0); // Activate the first dot
  };
  init(); // Call the initialization function

  // Event handlers for navigation
  btnRight.addEventListener('click', nextSlide); // Add event listener for right button
  btnLeft.addEventListener('click', prevSlide); // Add event listener for left button

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide(); // Navigate to the previous slide with the left arrow key
    e.key === 'ArrowRight' && nextSlide(); // Navigate to the next slide with the right arrow key
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // If a dot is clicked
      curSlide = Number(e.target.dataset.slide); // Get the slide index from the clicked dot
      goToSlide(curSlide); // Navigate to the corresponding slide
      activateDot(curSlide); // Activate the corresponding dot
    }
  });
};
slider(); // Initialize the slider

/* ******************************************************************************** */

// Cookies notification
const message = document.createElement('div'); // Create a new div element
message.classList.add('cookieMessage'); // Add class to the div
message.textContent =
  'We use cookied for improved functionality and analytics.'; // Add text content
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; // Add HTML content with a button

header.append(message); // Append the message to the header

// Add event listener to the close button
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove(); // Remove the message (alternative method)
    message.parentElement.removeChild(message); // Remove the message from its parent
  });
