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

// Function to open the modal with image details
const openModal = (item) => {
  // Log the clicked item to the console
  console.log(`Gallery item clicked: ${item.title}`);

  // Ensure the modal elements are populated with the correct data
  modalImage.src = item.url;
  modalImage.alt = item.title;
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;

  // Remove the 'hidden' class to display the modal
  modal.classList.remove('hidden');

  // Log to confirm the modal is being shown
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

// Function to fetch and display images from NASA's APOD API
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

    // Fetch data from the API
    const response = await fetch(url);
    const data = await response.json();

    // Clear the gallery
    gallery.innerHTML = '';

    // Check if data is an array (multiple images) or a single object
    if (Array.isArray(data)) {
      // Loop through the images and create gallery items
      data.forEach((item) => {
        if (item.media_type === 'image') {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <p><strong>${item.title}</strong></p>
            <p>${item.date}</p>
          `;
          // Add click event listener to open the modal
          galleryItem.addEventListener('click', () => openModal(item));
          gallery.appendChild(galleryItem);
        }
      });
    } else {
      // Handle single image response
      if (data.media_type === 'image') {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
          <img src="${data.url}" alt="${data.title}" />
          <p><strong>${data.title}</strong></p>
          <p>${data.date}</p>
        `;
        // Add click event listener to open the modal
        galleryItem.addEventListener('click', () => openModal(data));
        gallery.appendChild(galleryItem);
      }
    }

    // Show a placeholder if no images are available
    if (!gallery.hasChildNodes()) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">🚫</div>
          <p>No images available for the selected date range.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Failed to load images. Please try again later.</p>
      </div>
    `;
  }
};

// Add event listener to the button
const button = document.querySelector('.filters button');
button.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  fetchImages(startDate, endDate);
});
