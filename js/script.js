// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA API key (replace 'YOUR_API_KEY' with your actual API key)
const API_KEY = 'Uiz92ggzSuMx6IAT58wW1GXUr1FZDkSISeUZIefw';

// Get the gallery container
const gallery = document.getElementById('gallery');

// Get modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeModal = document.getElementById('closeModal');

// Function to open the modal with image or video details
const openModal = (item) => {
  console.log(`Gallery item clicked: ${item.title}`);

  if (item.media_type === 'image') {
    // Handle image entries
    modalImage.src = item.url;
    modalImage.alt = item.title;
    modalImage.style.display = 'block'; // Ensure the image is visible
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalExplanation.textContent = item.explanation;
  } else if (item.media_type === 'video') {
    // Handle video entries
    modalImage.style.display = 'none'; // Hide the image element
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalExplanation.innerHTML = `
      ${item.explanation}
      <br />
      <a href="${item.url}" target="_blank" style="color: #1e90ff;">Watch Video</a>
    `;
  }

  // Reset the scroll position of the explanation paragraph to the top
  modalExplanation.scrollTop = 0;

  modal.classList.remove('hidden');
  console.log('Modal is now visible');
};

// Function to close the modal
const closeModalHandler = () => {
  // Add the 'hidden' class to hide the modal
  modal.classList.add('hidden');

  // Log to confirm the modal is being hidden
  console.log('Modal is now hidden');
};

// Add event listener to close button
closeModal.addEventListener('click', closeModalHandler);

// Add event listener to close modal when clicking outside the content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModalHandler();
  }
});

// Function to fetch and display images or videos from NASA's APOD API
const fetchImages = async (startDate, endDate) => {
  try {
    // Show a loading message
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔄</div>
        <p>Loading space photos…</p>
      </div>
    `;

    // Build the API URL
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();

    // Clear the gallery
    gallery.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        if (item.media_type === 'image') {
          // Handle image entries
          galleryItem.innerHTML = `
            <div class="image-container">
              <img src="${item.url}" alt="${item.title}" />
            </div>
            <p><strong>${item.title}</strong></p>
            <p>${item.date}</p>
          `;
        } else if (item.media_type === 'video') {
          // Handle video entries
          galleryItem.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background-color: #000; color: #fff; padding: 20px; text-align: center;">
              <p style="margin-bottom: 10px; font-size: 18px; font-weight: bold;">${item.title}</p>
              <p style="margin-bottom: 10px; font-size: 14px;">${item.date}</p>
              <a href="${item.url}" target="_blank" style="color: #1e90ff; font-size: 16px; text-decoration: underline;">Watch Video</a>
            </div>
          `;
        }

        // Add click event listener to open the modal
        galleryItem.addEventListener('click', () => openModal(item));
        gallery.appendChild(galleryItem);
      });
    } else {
      if (data.media_type === 'image' || data.media_type === 'video') {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        if (data.media_type === 'image') {
          galleryItem.innerHTML = `
            <div class="image-container">
              <img src="${data.url}" alt="${data.title}" />
            </div>
            <p><strong>${data.title}</strong></p>
            <p>${data.date}</p>
          `;
        } else if (data.media_type === 'video') {
          galleryItem.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; background-color: #000; color: #fff; padding: 20px; text-align: center;">
              <p style="margin-bottom: 10px; font-size: 18px; font-weight: bold;">${data.title}</p>
              <p style="margin-bottom: 10px; font-size: 14px;">${data.date}</p>
              <a href="${data.url}" target="_blank" style="color: #1e90ff; font-size: 16px; text-decoration: underline;">Watch Video</a>
            </div>
          `;
        }

        // Add click event listener to open the modal
        galleryItem.addEventListener('click', () => openModal(data));
        gallery.appendChild(galleryItem);
      }
    }

    // Show a placeholder if no images or videos are available
    if (!gallery.hasChildNodes()) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">🚫</div>
          <p>No images or videos available for the selected date range.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Failed to load content. Please try again later.</p>
      </div>
    `;
  }
};

// Array of fun space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Neutron stars are so dense that a sugar-cube-sized amount of their material would weigh a billion tons.",
  "Saturn's moon Titan has a thick atmosphere and is the only moon in the solar system with clouds.",
  "The largest volcano in the solar system is Olympus Mons on Mars.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 350 years.",
  "The Milky Way galaxy will collide with the Andromeda galaxy in about 4.5 billion years.",
  "Scientists estimate there could be as many as 40 billion Earth-like planets in the Milky Way galaxy.",
  "The Sun accounts for 99.86% of the mass in our solar system.",
  "A teaspoon of a neutron star would weigh about 6 billion tons.",
  "Mars has the largest dust storms in the solar system, lasting for months and covering the entire planet.",
  "If two pieces of the same type of metal touch in space, they will bond and become permanently stuck together.",
  "The universe is expanding at a rate faster than the speed of light."
];

// Function to display a random space fact
const displayRandomFact = () => {
  const factElement = document.getElementById('spaceFact');
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  // Set the fact text with a newline after the question mark using <br> for HTML
  factElement.innerHTML = `Did You Know?<br><br>${randomFact}`;
};

// Call the function to display a random fact when the app loads
displayRandomFact();

// Add event listener to the button
const button = document.querySelector('.filters button');
button.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  fetchImages(startDate, endDate);
});

// Function to open the image in full screen
const openFullScreenImage = () => {
  // Create a full-screen container
  const fullScreenContainer = document.createElement('div');
  fullScreenContainer.className = 'full-screen-container';

  // Create the full-screen image element
  const fullScreenImage = document.createElement('img');
  fullScreenImage.src = modalImage.src;
  fullScreenImage.alt = modalImage.alt;
  fullScreenImage.className = 'full-screen-image';

  // Create the close button
  const closeFullScreenButton = document.createElement('span');
  closeFullScreenButton.className = 'close-full-screen';
  closeFullScreenButton.textContent = '×';

  // Add event listener to close the full-screen view
  closeFullScreenButton.addEventListener('click', () => {
    document.body.removeChild(fullScreenContainer);
  });

  // Append elements to the full-screen container
  fullScreenContainer.appendChild(fullScreenImage);
  fullScreenContainer.appendChild(closeFullScreenButton);

  // Append the full-screen container to the body
  document.body.appendChild(fullScreenContainer);
};

// Add event listener to the modal image to open it in full screen
modalImage.addEventListener('click', openFullScreenImage);
