document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const eventSelect = document.getElementById('eventSelect');
    const gymOptions = document.getElementById('gymOptions');
    const dropZone = document.getElementById('dropZone');
    const manualDropZone = document.getElementById('manualDropZone');
    const fileInput = document.getElementById('fileInput');
    const manualFileInput = document.getElementById('manualFileInput');
    const getRecommendationsBtn = document.getElementById('getRecommendations');
    const recommendationsSection = document.getElementById('recommendations');
    const recommendationsGrid = document.getElementById('recommendationsGrid');

    // Local Storage Keys
    const STORAGE_KEY = 'outfitRecommendations';

    // Event Listeners
    eventSelect.addEventListener('change', handleEventSelection);
    dropZone.addEventListener('click', () => fileInput.click());
    manualDropZone.addEventListener('click', () => manualFileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    manualDropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    manualDropZone.addEventListener('drop', handleManualDrop);
    fileInput.addEventListener('change', handleFileSelection);
    manualFileInput.addEventListener('change', handleManualFileSelection);
    getRecommendationsBtn.addEventListener('click', generateRecommendations);

    // Event Handlers
    function handleEventSelection(e) {
        const selectedEvent = e.target.value;
        gymOptions.classList.toggle('hidden', selectedEvent !== 'gym');
        
        localStorage.setItem('selectedEvent', selectedEvent);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'var(--neon-primary)';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'var(--neon-secondary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFile(files[0], false);
        }
    }

    function handleManualDrop(e) {
        e.preventDefault();
        e.currentTarget.style.borderColor = 'var(--neon-secondary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUploadedFile(files[0], true);
        }
    }

    function handleFileSelection(e) {
        const file = e.target.files[0];
        if (file) {
            handleUploadedFile(file, false);
        }
    }

    function handleManualFileSelection(e) {
        const file = e.target.files[0];
        if (file) {
            handleUploadedFile(file, true);
        }
    }

    function handleUploadedFile(file, isManual) {
        const reader = new FileReader();
        reader.onload = (e) => {
            localStorage.setItem('uploadedImage', e.target.result);
            if (isManual) {
                generateManualRecommendations();
            } else {
                generateRecommendations();
            }
        };
        reader.readAsDataURL(file);
    }

    function generateRecommendations() {
        const selectedEvent = eventSelect.value;
        if (!selectedEvent) {
            alert('Please select an event first');
            return;
        }

        const mockRecommendations = getMockRecommendations(selectedEvent);
        displayRecommendations(mockRecommendations);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRecommendations));
    }

    function generateManualRecommendations() {
        const mockRecommendations = getMockRecommendations('manual');
        displayRecommendations(mockRecommendations);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRecommendations));
    }

    function getMockRecommendations(event) {
        // This would be replaced with actual ML model recommendations
        return [
            { imageUrl: 'https://example.com/outfit1.jpg', description: 'Outfit 1' },
            { imageUrl: 'https://example.com/outfit2.jpg', description: 'Outfit 2' },
            { imageUrl: 'https://example.com/outfit3.jpg', description: 'Outfit 3' },
            { imageUrl: 'https://example.com/outfit4.jpg', description: 'Outfit 4' },
            { imageUrl: 'https://example.com/outfit5.jpg', description: 'Outfit 5' }
        ];
    }

    function displayRecommendations(recommendations) {
        recommendationsSection.classList.remove('hidden');
        recommendationsGrid.innerHTML = '';

        recommendations.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <img src="${rec.imageUrl}" alt="${rec.description}">
                <p>${rec.description}</p>
            `;
            recommendationsGrid.appendChild(card);
        });
    }

    // Load saved state
    const savedEvent = localStorage.getItem('selectedEvent');
    if (savedEvent) {
        eventSelect.value = savedEvent;
        handleEventSelection({ target: eventSelect });
    }

    const savedRecommendations = localStorage.getItem(STORAGE_KEY);
    if (savedRecommendations) {
        displayRecommendations(JSON.parse(savedRecommendations));
    }
});