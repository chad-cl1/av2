document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos Comunes ---
    const passwordInput = document.getElementById('password-input');
    const unlockButton = document.getElementById('unlock-button');
    const passwordScreen = document.getElementById('password-screen');
    const mainContent = document.getElementById('main-content');
    const passwordMessage = document.getElementById('password-message');
    const secretSong = document.getElementById('secret-song');

    const CORRECT_PASSWORD = "0306";

    // --- Variables de estado para funcionalidades ---
    let mainFeaturesInitialized = false;
    let countdownInterval;

    // --- Lógica de la Clave y Desbloqueo ---
    if (unlockButton && passwordInput) {
        unlockButton.addEventListener('click', checkPassword);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    function initializeMainFeatures() {
        if (mainFeaturesInitialized) return;
        mainFeaturesInitialized = true;
        console.log("Attempting to initialize main features (carousels, countdown, puzzle).");

        initializeAllCarousels();
        updateCountdown();
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(updateCountdown, 1000);
        initPetPuzzle(); // Inicializa el puzzle de mascotas

        if (secretSong && passwordScreen && passwordScreen.style.display === 'none') {
            secretSong.play().catch(error => {
                console.error("Error al intentar reproducir la canción:", error);
            });
        }
        console.log("Main features initialized.");
    }

    function checkPassword() {
        if (!passwordInput) return;
        if (passwordInput.value === CORRECT_PASSWORD) {
            if (passwordScreen) {
                passwordScreen.style.animation = 'fadeOut 1s forwards';
                passwordScreen.addEventListener('animationend', () => {
                    passwordScreen.style.display = 'none';
                    if (mainContent) {
                        mainContent.classList.remove('hidden');
                        mainContent.classList.add('visible');
                        document.body.style.overflowY = 'auto';
                        initializeMainFeatures();
                        celebrationEffect();
                    }
                }, { once: true });
            }
        } else {
            if (passwordMessage) {
                passwordMessage.textContent = "Clave incorrecta. Intenta de nuevo.";
                passwordMessage.classList.add('show');
                setTimeout(() => {
                    passwordMessage.classList.remove('show');
                }, 3000);
            }
            passwordInput.value = '';
        }
    }

    // --- Lógica del Teclado Numérico ---
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    const clearPasswordBtn = document.getElementById('clearPasswordBtn');
    if (keypadButtons.length > 0 && passwordInput) {
        keypadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const value = this.dataset.value;
                const action = this.dataset.action;
                if (value) {
                    if (passwordInput.value.length < passwordInput.maxLength) {
                        passwordInput.value += value;
                    }
                } else if (action === 'backspace') {
                    passwordInput.value = passwordInput.value.slice(0, -1);
                }
            });
        });
    }
    if (clearPasswordBtn && passwordInput) {
        clearPasswordBtn.addEventListener('click', function() {
            passwordInput.value = '';
        });
    }

    // --- Lógica para la Cuenta Regresiva ---
    const nextAnniversaryDate = new Date(2026, 5, 3, 0, 0, 0).getTime(); // Mes 5 es Junio
    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const anniversaryMessageElement = document.getElementById('anniversary-message');
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        if (!daysSpan || !hoursSpan || !minutesSpan || !secondsSpan || !countdownElement || !anniversaryMessageElement) {
            if (mainContent && mainContent.classList.contains('hidden') && passwordScreen && passwordScreen.style.display !== 'none') {
                return;
            }
            return;
        }
        const now = new Date().getTime();
        const distance = nextAnniversaryDate - now;
        if (distance < 0) {
            if (countdownInterval) clearInterval(countdownInterval);
            if(countdownElement) countdownElement.style.display = 'none';
            if(anniversaryMessageElement) anniversaryMessageElement.classList.remove('hidden');
            document.body.style.background = 'linear-gradient(135deg, #FFEFD5, #E0BBE4)';
            celebrationEffect();
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if(daysSpan) daysSpan.innerHTML = String(days).padStart(2, '0');
        if(hoursSpan) hoursSpan.innerHTML = String(hours).padStart(2, '0');
        if(minutesSpan) minutesSpan.innerHTML = String(minutes).padStart(2, '0');
        if(secondsSpan) secondsSpan.innerHTML = String(seconds).padStart(2, '0');
    }

    // --- Lógica para las secciones desplegables ---
    const collapsibles = document.getElementsByClassName("collapsible");
    if (collapsibles.length > 0) {
        for (let i = 0; i < collapsibles.length; i++) {
            collapsibles[i].addEventListener("click", function() {
                this.classList.toggle("active");
                const content = this.nextElementSibling;
                if (content && (content.classList.contains('collapsible-carousel-container') || content.classList.contains('content-gallery'))) {
                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                        if(content.classList.contains('collapsible-carousel-container')) {
                            content.style.paddingTop = "0";
                            content.style.paddingBottom = "0";
                        }
                    } else {
                        if(content.classList.contains('collapsible-carousel-container')) {
                            content.style.paddingTop = "15px";
                            content.style.paddingBottom = "15px";
                        }
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                }
            });
        }
    }

    // --- Efecto de celebración con confeti ---
    function celebrationEffect() {
        const confettiContainer = document.body;
        if (!confettiContainer) return;
        const colors = ['#FFDAB9', '#ADD8E6', '#98FB98', '#FFB6C1', '#D8BFD8'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `${Math.random() * -50 - 10}vh`;
            confetti.style.animationDuration = `${Math.random() * 3 + 5}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
            confettiContainer.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove());
        }
    }
    
    // --- Lógica del Puzzle de Mascotas ---
    const puzzleBoardElement = document.getElementById('pet-puzzle-board');
    const shufflePuzzleBtn = document.getElementById('shufflePuzzleBtn');
    const puzzleVictoryMessage = document.getElementById('puzzle-victory-message');
    const puzzleImageChoiceButtons = document.querySelectorAll('.puzzle-img-choice-btn');

    const PUZZLE_DIMENSION = 3; 
    const EMPTY_TILE_REPRESENTATION = (PUZZLE_DIMENSION * PUZZLE_DIMENSION) - 1; 
    let currentPuzzleTiles = []; 
    
    // ¡¡¡IMPORTANTE!!! REEMPLAZA ESTAS RUTAS CON LAS TUYAS Y ASEGÚRATE QUE LAS IMÁGENES SEAN CUADRADAS
    const petPuzzleImageOptions = [
        { name: "Blanquito", src: "images/blanqui2.jpeg" }, 
        { name: "Firulai", src: "images/firu1.jpeg" },
        { name: "Meche", src: "images/meche.jpeg" },
        { name: "Pepe", src: "images/pepe.jpeg" }
    ];
    let selectedPetImageUrl = petPuzzleImageOptions[0].src; // Imagen por defecto

    let pieceSize = 100; 
    let boardSize = PUZZLE_DIMENSION * pieceSize;
    let currentPuzzleImageUrlForRender = ''; 

    function initPetPuzzle() {
        if (!puzzleBoardElement || !shufflePuzzleBtn || !puzzleVictoryMessage || puzzleImageChoiceButtons.length === 0) {
            console.warn("Elementos del puzzle de mascotas no encontrados o no hay botones de selección. El puzzle no se inicializará.");
            if(shufflePuzzleBtn) shufflePuzzleBtn.disabled = true;
            return;
        }

        // Configurar botones de selección de imagen
        let defaultImageFound = false;
        puzzleImageChoiceButtons.forEach((button, index) => {
            const choiceData = petPuzzleImageOptions.find(opt => opt.src === button.dataset.imageSrc || opt.name === button.dataset.petName);
            if (choiceData) {
                button.dataset.imageSrc = choiceData.src; // Asegurar que el data-attribute tenga la fuente correcta del array
                button.textContent = choiceData.name; // Usar el nombre del array
                
                if (button.classList.contains('active')) {
                    selectedPetImageUrl = choiceData.src;
                    defaultImageFound = true;
                }

                button.addEventListener('click', function() {
                    selectedPetImageUrl = this.dataset.imageSrc;
                    puzzleImageChoiceButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    startNewPuzzleGame();
                });
            } else {
                console.warn(`Botón de imagen ${button.textContent} no coincide con opciones definidas. Ocultando.`);
                button.style.display = 'none';
            }
        });

        // Si no se encontró un botón activo por defecto, activar el primero visible
        if (!defaultImageFound) {
            const firstVisibleChoice = Array.from(puzzleImageChoiceButtons).find(btn => btn.style.display !== 'none');
            if (firstVisibleChoice) {
                firstVisibleChoice.classList.add('active');
                selectedPetImageUrl = firstVisibleChoice.dataset.imageSrc;
            } else {
                console.error("No hay imágenes válidas para el puzzle. Deshabilitando.");
                shufflePuzzleBtn.disabled = true;
                return; // No se puede iniciar el puzzle sin imágenes.
            }
        }

        // Ajustar tamaño del tablero y piezas responsive
        const parentWidth = puzzleBoardElement.parentElement.clientWidth;
        const basePieceSizeForMobile = Math.floor((parentWidth * 0.85) / PUZZLE_DIMENSION); // 85% del ancho del padre para el tablero

        if (window.innerWidth < 480) {
            pieceSize = (basePieceSizeForMobile < 50) ? 50 : basePieceSizeForMobile;
        } else if (window.innerWidth < 768) {
            pieceSize = (basePieceSizeForMobile < 70) ? 70 : basePieceSizeForMobile;
            if (pieceSize > 90) pieceSize = 90; // Limitar un poco en tablets
        }
        else {
            pieceSize = 100; 
        }
        boardSize = PUZZLE_DIMENSION * pieceSize;

        puzzleBoardElement.style.width = `${boardSize}px`;
        puzzleBoardElement.style.height = `${boardSize}px`;
        puzzleBoardElement.style.gridTemplateColumns = `repeat(${PUZZLE_DIMENSION}, ${pieceSize}px)`;
        puzzleBoardElement.style.gridTemplateRows = `repeat(${PUZZLE_DIMENSION}, ${pieceSize}px)`;

        shufflePuzzleBtn.disabled = false; // Habilitar botón
        shufflePuzzleBtn.addEventListener('click', startNewPuzzleGame);
        startNewPuzzleGame(); 
        console.log("Puzzle de mascotas inicializado con piezas de " + pieceSize + "px.");
    }

    function startNewPuzzleGame() {
        if (!selectedPetImageUrl) {
            console.error("Puzzle: No hay imagen seleccionada.");
            return;
        }
        console.log(`Iniciando nuevo juego de puzzle con imagen: ${selectedPetImageUrl}`);
        currentPuzzleImageUrlForRender = selectedPetImageUrl; 
        
        currentPuzzleTiles = Array.from({ length: PUZZLE_DIMENSION * PUZZLE_DIMENSION }, (_, i) => i);
        shufflePuzzle(currentPuzzleTiles);
        renderPuzzleBoard();
        if(puzzleVictoryMessage) puzzleVictoryMessage.classList.add('hidden');
        puzzleBoardElement.style.pointerEvents = 'auto'; 
    }

    function shufflePuzzle(tiles) {
        let emptyIndex = tiles.indexOf(EMPTY_TILE_REPRESENTATION);
        if (emptyIndex === -1) { 
            tiles[tiles.length -1] = EMPTY_TILE_REPRESENTATION;
            emptyIndex = tiles.length -1;
        }
        for (let i = 0; i < (PUZZLE_DIMENSION * PUZZLE_DIMENSION * 15); i++) { // Aumentar movimientos para mejor mezcla
            const validMovesIndices = getValidMovesForEmptyTile(emptyIndex);
            if (validMovesIndices.length > 0) {
                const randomMoveIndex = validMovesIndices[Math.floor(Math.random() * validMovesIndices.length)];
                [tiles[emptyIndex], tiles[randomMoveIndex]] = [tiles[randomMoveIndex], tiles[emptyIndex]];
                emptyIndex = randomMoveIndex; 
            }
        }
    }

    function getValidMovesForEmptyTile(emptyTileBoardIndex) {
        const moves = [];
        const row = Math.floor(emptyTileBoardIndex / PUZZLE_DIMENSION);
        const col = emptyTileBoardIndex % PUZZLE_DIMENSION;
        if (row > 0) moves.push(emptyTileBoardIndex - PUZZLE_DIMENSION);
        if (row < PUZZLE_DIMENSION - 1) moves.push(emptyTileBoardIndex + PUZZLE_DIMENSION);
        if (col > 0) moves.push(emptyTileBoardIndex - 1);
        if (col < PUZZLE_DIMENSION - 1) moves.push(emptyTileBoardIndex + 1);
        return moves;
    }

    function renderPuzzleBoard() {
        if (!puzzleBoardElement) return;
        puzzleBoardElement.innerHTML = ''; 
        currentPuzzleTiles.forEach((tileValue, boardIndex) => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('puzzle-piece');
            pieceElement.style.width = `${pieceSize}px`; 
            pieceElement.style.height = `${pieceSize}px`;
            
            if (tileValue === EMPTY_TILE_REPRESENTATION) {
                pieceElement.classList.add('empty');
            } else {
                const originalCol = tileValue % PUZZLE_DIMENSION;
                const originalRow = Math.floor(tileValue / PUZZLE_DIMENSION);
                pieceElement.style.backgroundImage = `url(${currentPuzzleImageUrlForRender})`;
                pieceElement.style.backgroundSize = `${boardSize}px ${boardSize}px`;
                pieceElement.style.backgroundPosition = `-${originalCol * pieceSize}px -${originalRow * pieceSize}px`;
                pieceElement.addEventListener('click', () => handlePieceClick(boardIndex));
            }
            puzzleBoardElement.appendChild(pieceElement);
        });
    }

    function handlePieceClick(clickedPieceBoardIndex) {
        if (puzzleBoardElement.style.pointerEvents === 'none') return; 
        const emptyTileBoardIndex = currentPuzzleTiles.indexOf(EMPTY_TILE_REPRESENTATION);
        const validMovesForEmpty = getValidMovesForEmptyTile(emptyTileBoardIndex);
        if (validMovesForEmpty.includes(clickedPieceBoardIndex)) {
            [currentPuzzleTiles[clickedPieceBoardIndex], currentPuzzleTiles[emptyTileBoardIndex]] = 
                [currentPuzzleTiles[emptyTileBoardIndex], currentPuzzleTiles[clickedPieceBoardIndex]];
            renderPuzzleBoard(); 
            checkWinCondition();
        }
    }

    function checkWinCondition() {
        for (let i = 0; i < currentPuzzleTiles.length; i++) {
            if (currentPuzzleTiles[i] !== i) return false; 
        }
        console.log("¡Puzzle resuelto!"); 
        if(puzzleVictoryMessage) puzzleVictoryMessage.classList.remove('hidden');
        puzzleBoardElement.style.pointerEvents = 'none'; 
        return true;
    }

    // --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
    if (mainContent && !mainContent.classList.contains('hidden') && 
        (!passwordScreen || passwordScreen.style.display === 'none' || passwordScreen.classList.contains('hidden'))) {
        initializeMainFeatures();
    }
}); // Fin del DOMContentLoaded principal


// ===================================================================================
// LÓGICA GENERALIZADA PARA CARRUSELES
// ===================================================================================
function setupCarouselControls(carouselElement) {
    const isMainCarousel = carouselElement.id === 'photoCarousel';
    const slideContainerSelector = isMainCarousel ? '.carousel-slides-container' : '.mini-carousel-slides-container';
    const slideSelector = isMainCarousel ? '.carousel-slide' : '.mini-carousel-slide';
    const prevBtnSelector = isMainCarousel ? '#prevPhotoBtn' : '.mini-prev-btn';
    const nextBtnSelector = isMainCarousel ? '#nextPhotoBtn' : '.mini-next-btn';

    const slidesContainer = carouselElement.querySelector(slideContainerSelector);
    const prevButton = isMainCarousel ? document.getElementById(prevBtnSelector.substring(1)) : carouselElement.querySelector(prevBtnSelector);
    const nextButton = isMainCarousel ? document.getElementById(nextBtnSelector.substring(1)) : carouselElement.querySelector(nextBtnSelector);

    if (!slidesContainer) {
        console.error("Error Carrusel: Contenedor de slides no encontrado en:", carouselElement.id || "un mini-carrusel");
        return;
    }
    const slides = Array.from(slidesContainer.children).filter(child => child.matches(slideSelector));
    if (slides.length === 0) {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
        return;
    }
    
    let currentIndex = 0;
    const initiallyActiveSlideIndex = slides.findIndex(s => s.classList.contains('active-slide'));
    if (initiallyActiveSlideIndex !== -1) {
        currentIndex = initiallyActiveSlideIndex;
    } else if (slides.length > 0) {
        slides[0].classList.add('active-slide');
    }

    function showSlide(index) {
        slides.forEach((slideEl, i) => {
            slideEl.classList.toggle('active-slide', i === index);
        });
        if (prevButton) prevButton.disabled = (index === 0 || slides.length === 0);
        if (nextButton) nextButton.disabled = (index === slides.length - 1 || slides.length === 0);
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showSlide(currentIndex);
            }
        });
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                showSlide(currentIndex);
            }
        });
    }
    showSlide(currentIndex);
}

function initializeAllCarousels() {
    // console.log("initializeAllCarousels llamada"); // DEBUG
    const mainCarouselElement = document.getElementById('photoCarousel');
    if (mainCarouselElement) {
        setupCarouselControls(mainCarouselElement);
    }

    const miniCarousels = document.querySelectorAll('.mini-carousel');
    miniCarousels.forEach((miniCar) => {
        setupCarouselControls(miniCar);
    });
}