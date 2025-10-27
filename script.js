// Attend que le DOM soit entièrement chargé pour exécuter le script
document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#1e1e1e');
    tg.setBackgroundColor('#121212');

    // --- CONFIGURATION ---
    const TARGET_TELEGRAM_USERNAME = '@plugsBotOfficiel'; // !!! REMPLACE PAR LE BON PSEUDO !!!

    // --- DONNÉES DES PROMOTIONS ---
    const promotions = [
        {
            id: 'booking',
            name: 'Booking',
            icon: '🏨',
            description: 'Bénéficiez de -30% sur le prix total de votre réservation Booking.com.',
            procedure: '1. Trouvez votre logement sur Booking.com.\n2. Remplissez le formulaire ci-dessous avec les détails.\n3. Nous vous contacterons pour finaliser la réservation avec la réduction.',
            discountPercent: 30, // Pourcentage de réduction
            formFields: [
                { id: 'propertyName', label: 'Nom du logement', type: 'text', required: true },
                { id: 'checkInDate', label: 'Date d\'arrivée', type: 'date', required: true },
                { id: 'checkOutDate', label: 'Date de départ', type: 'date', required: true },
                { id: 'bookingPrice', label: 'Prix total sur Booking (€)', type: 'number', required: true, calculateDiscount: true } // Champ spécial pour le calcul
            ]
        },
        {
            id: 'carRental',
            name: 'Location Voiture',
            icon: '🚗',
            description: 'Obtenez 15% de réduction sur votre location de voiture.',
            procedure: '1. Remplissez le formulaire avec vos besoins.\n2. Nous vous enverrons un devis personnalisé avec la réduction appliquée.',
            discountPercent: 15,
            formFields: [
                { id: 'carType', label: 'Type de voiture souhaité', type: 'text', required: true },
                { id: 'pickupDate', label: 'Date de prise en charge', type: 'date', required: true },
                { id: 'returnDate', label: 'Date de retour', type: 'date', required: true },
                { id: 'location', label: 'Lieu (Ville/Aéroport)', type: 'text', required: true },
                { id: 'estimatedPrice', label: 'Prix estimé sans réduction (€)', type: 'number', required: false }
            ]
        },

        {
            id: 'Plane',
            name: 'Billets D\'avion',
            icon: '✈️',
            description: 'Obtenez 30% de réduction sur vos billets d\avion.',
            procedure: '1. Remplissez le formulaire avec vos besoins.\n2. Nous vous enverrons un devis personnalisé avec la réduction appliquée.',
            discountPercent: 30,
            formFields: [
                { id: 'stardandend', label: 'Depart et Arrivé', type: 'text', required: true },
                { id: 'compagnie', label: 'Compagnie', type: 'text', required: true },
                { id: 'dayPlane', label: 'Date du vol', type: 'date', required: true },
                { id: 'hourePlane', label: 'Heure du vol', type: 'time', required: true },
                { id: 'estimatedPrice', label: 'Prix estimé sans réduction (€)', type: 'number', required: false }
            ]
        },
        // Ajoute d'autres promotions ici
    ];

    // --- ÉLÉMENTS DU DOM ---
    const pages = document.querySelectorAll('.page');
    const categoryListPage = document.getElementById('page-home');
    const promotionPage = document.getElementById('page-promotion');
    const categoryListContainer = document.getElementById('category-list');
    const promoPageTitle = document.getElementById('promo-page-title');
    const promoDescriptionText = document.getElementById('promo-description-text');
    const promoProcedureText = document.getElementById('promo-procedure-text');
    const promoFormFieldsContainer = document.getElementById('promo-form-fields');
    const submitPromoButton = document.getElementById('submit-promo-button');
    const backToHomeButton = document.getElementById('back-to-home');

    let currentPromotion = null; // Garde en mémoire la promotion active

    // --- NAVIGATION ---
    function showPage(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
            window.scrollTo(0, 0); // Remonte en haut de la page
        }
    }

    // --- AFFICHAGE ---
    function renderCategories() {
        categoryListContainer.innerHTML = promotions.map(promo => `
            <div class="category-card" data-promo-id="${promo.id}">
                <div class="icon">${promo.icon}</div>
                <div class="name">${promo.name}</div>
            </div>
        `).join('');
    }

    function renderPromotionPage(promoId) {
        currentPromotion = promotions.find(p => p.id === promoId);
        if (!currentPromotion) return;

        promoPageTitle.innerText = currentPromotion.name;
        promoDescriptionText.innerText = currentPromotion.description;
        promoProcedureText.innerText = currentPromotion.procedure.replace(/\\n/g, '\n'); // Remplace les \n par de vrais sauts de ligne si besoin
        promoFormFieldsContainer.innerHTML = ''; // Vide l'ancien formulaire

        // Génère les champs du formulaire dynamiquement
        currentPromotion.formFields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label + (field.required ? ' *' : '');
            formGroup.appendChild(label);

            let inputElement;
            if (field.type === 'textarea') {
                inputElement = document.createElement('textarea');
            } else {
                inputElement = document.createElement('input');
                inputElement.type = field.type;
                if (field.type === 'number') {
                    inputElement.step = '0.01'; // Permet les centimes
                    inputElement.min = '0';
                }
            }
            inputElement.id = field.id;
            inputElement.name = field.id;
            if (field.required) {
                inputElement.required = true;
            }
            formGroup.appendChild(inputElement);

            // Ajoute l'affichage de la réduction si nécessaire
            if (field.calculateDiscount && currentPromotion.discountPercent) {
                const discountDisplay = document.createElement('div');
                discountDisplay.id = `${field.id}-discount`;
                discountDisplay.className = 'discount-display hidden'; // Caché par défaut
                formGroup.appendChild(discountDisplay);

                // Ajoute l'écouteur pour calculer la réduction
                inputElement.addEventListener('input', () => calculateDiscount(field.id, currentPromotion.discountPercent));
            }

            promoFormFieldsContainer.appendChild(formGroup);
        });

        // Réinitialise et affiche la page
        checkFormValidity(); // Vérifie si le bouton doit être activé
        showPage('page-promotion');
    }

    // --- LOGIQUE FORMULAIRE & CALCUL ---
    function calculateDiscount(priceFieldId, discountPercent) {
        const priceInput = document.getElementById(priceFieldId);
        const discountDisplay = document.getElementById(`${priceFieldId}-discount`);
        const originalPrice = parseFloat(priceInput.value);

        if (discountDisplay && !isNaN(originalPrice) && originalPrice > 0) {
            const discountAmount = (originalPrice * discountPercent) / 100;
            const finalPrice = originalPrice - discountAmount;
            discountDisplay.innerHTML = `Prix après ${discountPercent}% de réduction : <span>${finalPrice.toFixed(2)}€</span>`;
            discountDisplay.classList.remove('hidden');
        } else if (discountDisplay) {
            discountDisplay.classList.add('hidden');
        }
        checkFormValidity(); // Met à jour l'état du bouton
    }

    // Vérifie si tous les champs requis sont remplis
    function checkFormValidity() {
        if (!currentPromotion) return;
        let isFormValid = true;
        currentPromotion.formFields.forEach(field => {
            if (field.required) {
                const input = document.getElementById(field.id);
                if (!input || !input.value.trim()) {
                    isFormValid = false;
                }
            }
        });
        submitPromoButton.disabled = !isFormValid;
    }

    // Met en forme le message pour Telegram
    function formatPromoMessage() {
        if (!currentPromotion) return "Erreur: Aucune promotion sélectionnée.";

        let message = `*Nouvelle demande - ${currentPromotion.name}*\n\n`;
        message += `*Détails de la demande :*\n`;

        let finalPriceInfo = ''; // Pour stocker le prix réduit s'il existe

        currentPromotion.formFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && input.value) {
                message += `- ${field.label}: ${input.value}\n`;

                // Si c'est le champ avec calcul de réduction, prépare l'info
                if (field.calculateDiscount && currentPromotion.discountPercent) {
                    const originalPrice = parseFloat(input.value);
                    if (!isNaN(originalPrice) && originalPrice > 0) {
                        const discountAmount = (originalPrice * currentPromotion.discountPercent) / 100;
                        const finalPrice = originalPrice - discountAmount;
                        finalPriceInfo = `*Prix après ${currentPromotion.discountPercent}% réduction:* ${finalPrice.toFixed(2)}€\n`;
                    }
                }
            }
        });

        // Ajoute le prix réduit à la fin s'il a été calculé
        if (finalPriceInfo) {
            message += `\n${finalPriceInfo}`;
        }

        message += `\n*Promotion Appliquée:* ${currentPromotion.name} (-${currentPromotion.discountPercent || 'N/A'}%)\n`;
        message += `\n_Demande envoyée le ${new Date().toLocaleDateString('fr-FR')}_`;

        return message;
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    categoryListContainer.addEventListener('click', (e) => {
        const categoryCard = e.target.closest('.category-card');
        if (categoryCard) {
            renderPromotionPage(categoryCard.dataset.promoId);
        }
    });

    backToHomeButton.addEventListener('click', () => {
        showPage('page-home');
        currentPromotion = null; // Réinitialise la promotion active
    });

    // Ajoute un écouteur sur le conteneur du formulaire pour gérer les 'input'
    promoFormFieldsContainer.addEventListener('input', checkFormValidity);

    submitPromoButton.addEventListener('click', () => {
        if (!currentPromotion || submitPromoButton.disabled) return;

        const message = formatPromoMessage();
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/${TARGET_TELEGRAM_USERNAME}?text=${encodedMessage}`;

        tg.openLink(telegramUrl);

        // Optionnel : revenir à l'accueil après envoi
        // setTimeout(() => {
        //     showPage('page-home');
        //     currentPromotion = null;
        // }, 500);
    });

    // --- INITIALISATION ---
    renderCategories();

});

