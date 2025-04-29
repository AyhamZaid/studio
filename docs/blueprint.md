# **App Name**: Interactive Catalogs

## Core Features:

- Catalog Grid Display: Displays a grid of catalogs with cover images and titles, allowing users to select a catalog to view.
- Flipbook Viewer: Presents the selected catalog in a flipbook format, with navigation controls to turn pages.
- Modal Presentation: Provides a modal overlay for viewing the flipbook, with a close button and navigation buttons for easy control.

## Style Guidelines:

- Background color: Light grey (#f2f2f2) to provide a clean and neutral backdrop.
- Primary color: White (#fff) for content containers to ensure readability.
- Accent color: Teal (#008080) for interactive elements like buttons and highlights.
- Grid layout for catalog previews to display multiple catalogs in an organized manner.
- Modal overlay for the flipbook viewer to provide a focused viewing experience.
- Simple, intuitive icons for navigation controls (previous, next, close).
- Subtle scaling animation on catalog previews to indicate interactivity.

## Original User Request:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>كتالوجات PDF تفاعلية</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f2f2f2;
      padding: a20px;
      text-align: center;
      direction: rtl;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .book-preview {
      background: #fff;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .book-preview:hover {
      transform: scale(1.05);
    }
    .book-preview img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 6px;
    }
    .modal {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }
    .modal.hidden {
      display: none;
    }
    #closeModal {
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 28px;
      color: white;
      cursor: pointer;
      z-index: 101;
    }
    .flipbook-container {
      width: 90%;
      height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flipbook {
      background: white;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
      margin: 0 auto;
    }
    .page {
      background-color: white;
    }
    .loading-message {
      color: white;
      font-size: 24px;
      text-align: center;
    }
    .controls {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 20px;
    }
    .control-btn {
      background: rgba(255,255,255,0.7);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .control-btn:hover {
      background: white;
    }
  </style>

  <!-- Libraries with correct CDN paths -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://www.turnjs.com/lib/turn.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/3/turn.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
  
</head>
<body>

<h1>📚 كتالوجات PDF تفاعلية</h1>

<div class="grid" id="pdfGrid"></div>

<div id="viewerModal" class="modal hidden">
  <span id="closeModal">✖</span>
  <div class="flipbook-container">
    <div id="loading" class="loading-message">جاري تحميل الكتالوج...</div>
    <div id="flipbook" class="flipbook"></div>
  </div>
  <div class="controls">
    <button class="control-btn" id="prevBtn">◀</button>
    <button class="control-btn" id="nextBtn">▶</button>
  </div>
</div>

<script>
  // Set PDF.js worker path
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  // Mock catalog data - replace with your actual PDF paths
  const pdfList = [
    { title: "كتالوج 1", file: "AceHacker-Syllabus.pdf", cover: "https://fanutrition.pl/fa__billionaire_en/files/thumb/0.jpg" },
    { title: "كتالوج 2", file: "235_7-English-Grammar-in-Use.-Murphy-R.-2019-5th-394p-.pdf", cover: "https://fanutrition.pl/fa__core_en/files/thumb/0.jpg" },
    { title: "كتالوج 3", file: "catalog3.pdf", cover: "https://fanutrition.pl/fa__bad_ass_en/files/thumb/1.jpg" },
  ];

  const grid = document.getElementById("pdfGrid");
  const flipbookElement = document.getElementById("flipbook");
  const modal = document.getElementById("viewerModal");
  const closeModal = document.getElementById("closeModal");
  const loadingMessage = document.getElementById("loading");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  let currentFlipbook = null;

  // Create catalog grid
  pdfList.forEach((item) => {
    const div = document.createElement("div");
    div.className = "book-preview";
    div.innerHTML = `
      <img src="${item.cover}" alt="${item.title}">
      <h3>${item.title}</h3>
    `;
    div.onclick = () => openCatalog(item.file);
    grid.appendChild(div);
  });



  const pageCount = pdf.numPages;

$('#flipbook').turn({
  width: 800,
  height: 600,
  autoCenter: true,
  display: 'double',
  when: {
    turning: function(event, page) {
      if (!$('#page' + page).html()) {
        renderPage(page);
      }
    }
  }
});
  // Close modal and destroy flipbook
  closeModal.onclick = () => {
    if (currentFlipbook) {
      $(flipbookElement).turn("destroy");
      currentFlipbook = null;
    }
    flipbookElement.innerHTML = '';
    modal.classList.add('hidden');
  };

  // Navigation buttons
  prevBtn.onclick = () => {
    if (currentFlipbook) {
      $(flipbookElement).turn("previous");
    }
  };
  
  nextBtn.onclick = () => {
    if (currentFlipbook) {
      $(flipbookElement).turn("next");
    }
  };

  // Open catalog function
  async function openCatalog(pdfUrl) {
    modal.classList.remove('hidden');
    flipbookElement.innerHTML = '';
    loadingMessage.style.display = 'block';
    
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      
      // Create pages
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        
        const canvas = document.createElement('canvas');
        pageDiv.appendChild(canvas);
        
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        flipbookElement.appendChild(pageDiv);
      }
      
      // Initialize turn.js after all pages are loaded
      loadingMessage.style.display = 'none';
      
      // Calculate dimensions based on the first page size
      const firstPage = flipbookElement.firstChild;
      const pageWidth = firstPage.offsetWidth;
      const pageHeight = firstPage.offsetHeight;
      
      currentFlipbook = $(flipbookElement).turn({
        width: pageWidth * 2,
        height: pageHeight,
        autoCenter: true,
        display: 'double',
        acceleration: true,
        elevation: 50,
        gradients: true,
        when: {
          turning: function(e, page, view) {
            const book = $(this);
            const currentPage = book.turn('page');
            
           
          }
        }
      });
      
    } catch (error) {
      console.error('Error loading PDF:', error);
      loadingMessage.textContent = 'خطأ في تحميل الملف. يرجى المحاولة مرة أخرى.';
    }
  }
  
  // Handle keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!currentFlipbook) return;
    
    if (e.keyCode == 37) { // left arrow
      $(flipbookElement).turn('previous');
    } else if (e.keyCode == 39) { // right arrow
      $(flipbookElement).turn('next');
    }
  });
</script>

</body>
</html>         fix all problam in this code
  