// Attend que le DOM soit entièrement chargé pour exécuter le script
document.addEventListener('DOMContentLoaded', function() {
    let tg = null;
    try {
        tg = window.Telegram.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.setHeaderColor('#1e1e1e');
            tg.setBackgroundColor('#121212');
        } else {
            console.warn("Telegram WebApp script might not be loaded or initialized properly.");
        }
    } catch (error) {
        console.error("Error initializing Telegram WebApp:", error);
    }


    // --- CONFIGURATION ---
    const TARGET_TELEGRAM_USERNAME = 'TON_NOM_D_UTILISATEUR_TELEGRAM'; // !!! REMPLACE PAR LE BON PSEUDO !!!

    // --- DONNÉES DES PROMOTIONS ---
    const promotionsData = [
        {
            id: 'booking',
            name: '',
            categoryImage: 'image/Voyage.png',
            layoutClass: 'full-width',
            description: 'Bénéficiez de -30% sur le prix total de votre réservation Booking.com.',
            procedure: '1. Trouvez votre logement sur Booking.com.\n2. Remplissez le formulaire ci-dessous avec les détails.\n3. Nous vous contacterons pour finaliser la réservation avec la réduction.',
            discountPercent: 30,
            formFields: [
                { id: 'propertyName', label: 'Nom du logement', type: 'text', required: true },
                { id: 'checkInDate', label: 'Date d\'arrivée', type: 'date', required: true },
                { id: 'checkOutDate', label: 'Date de départ', type: 'date', required: true },
                { id: 'bookingPrice', label: 'Prix total sur Booking (€)', type: 'number', required: true, calculateDiscount: true }
            ]
        },
        {
            id: 'carRental',
            name: '',
            categoryImage: 'image/loc.png',
            layoutClass: '',
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
            id: 'autrePromo',
            name: '',
            categoryImage: 'image/Activite.png',
            layoutClass: '',
            description: 'Description de l\'autre promotion.',
            procedure: 'Procédure pour l\'autre promotion.',
            discountPercent: 10,
            formFields: [
                 { id: 'activityName', label: 'Nom de l\'activité', type: 'text', required: true },
            ]
        },
        {
            id: 'boutique',
            name: '',
            categoryImage: 'image/Boutique.png',
            layoutClass: 'full-width',
            subcategories: [
                {
                    id: '-30',
                    name: '',
                    categoryImage: 'image/-30.png',
                    layoutClass: 'full-width',
                    description: 'Profitez de -20% sur une sélection de boutiques de vêtements.',
                    procedure: '1. Choisissez votre boutique préférée.\n2. Indiquez le montant total de votre panier.\n3. Nous vous enverrons le lien de paiement avec la réduction.',
                    discountPercent: 30,
                    formFields: [
                        {
                            id: 'shopName',
                            label: 'Choisissez la boutique',
                            type: 'image-select', // NOUVEAU TYPE
                            required: true,
                            options: [ // Les options sont maintenant des objets
                                // !!! REMPLACE LES URLS PAR LES TIENNES !!!
                                { value: 'IKEA', imageSrc: 'image/IKEA.webp' },
                                { value: 'LEROY MERLIN', imageSrc: 'image/LeroyMerlin.png' },
                                { value: 'Brico Depot', imageSrc: 'image/Brico.avif' },
                                { value: 'SKLUM', imageSrc: 'image/sklum.jpg' },
                                { value: 'CONFORAMA', imageSrc: 'image/Conforama.png' },
                                { value: 'CASTORAMA', imageSrc: 'image/castologo.jpg' },
                                // Tu peux ajouter une option "Autre" si tu veux, mais elle n'aura pas d'image dédiée
                                // { value: 'Autre (préciser)', imageSrc: '[https://placehold.co/100x100/cccccc/000000?text=](https://placehold.co/100x100/cccccc/000000?text=)?' } 
                            ]
                        },
                    ]
                },
                {
                    id: '-35',
                    name: '',
                    categoryImage: 'image/-35.png',
                    layoutClass: 'full-width',
                    description: 'Réductions variables sur les produits High-Tech.',
                    procedure: 'Remplissez le formulaire avec le produit souhaité.',
                    discountPercent: 35,
                    formFields: [
                        {
                            id: 'shopName',
                            label: 'Choisissez la boutique',
                            type: 'image-select', // NOUVEAU TYPE
                            required: true,
                            options: [ // Les options sont maintenant des objets
                                // !!! REMPLACE LES URLS PAR LES TIENNES !!!
                                { value: 'Decathlon', imageSrc: 'image/Decathlon.png' },
                                { value: 'FeuVert', imageSrc: 'image/FeuVert.png' },
                                { value: '3Suisse', imageSrc: 'image/3Suisses.png' },
                                { value: 'Bijourama', imageSrc: 'image/Bijourama.jpg' },
                                { value: 'Mencorner', imageSrc: 'image/mencorner.png' },
                                { value: 'Becquet', imageSrc: 'image/bacquet.jpg' },
                                { value: 'Blancheporte', imageSrc: 'image/Blancheporte.webp' },
                                // Tu peux ajouter une option "Autre" si tu veux, mais elle n'aura pas d'image dédiée
                                // { value: 'Autre (préciser)', imageSrc: '[https://placehold.co/100x100/cccccc/000000?text=](https://placehold.co/100x100/cccccc/000000?text=)?' } 
                            ]
                        },
                    ]
                },
                {
                    id: '-40',
                    name: '',
                    categoryImage: 'image/-40.png',
                    layoutClass: 'full-width',
                    description: 'Réductions variables sur les produits High-Tech.',
                    procedure: 'Remplissez le formulaire avec le produit souhaité.',
                    discountPercent: 40,
                    formFields: [
                        { id: 'productName', label: 'Nom du produit High-Tech', type: 'text', required: true },
                        { id: 'productLink', label: 'Lien vers le produit (si possible)', type: 'text', required: false },
                        { id: 'budget', label: 'Votre budget approximatif (€)', type: 'number', required: false }
                    ]
                }
            ]
        }
    ];

    // --- ÉLÉMENTS DU DOM ---
    const pages = document.querySelectorAll('.page');
    const categoryListPage = document.getElementById('page-home');
    const subcategoryPage = document.getElementById('page-subcategories');
    const promotionPage = document.getElementById('page-promotion');
    const categoryListContainer = document.getElementById('category-list');
    const subcategoryListContainer = document.getElementById('subcategory-list');
    const promoPageTitle = document.getElementById('promo-page-title');
    const subcategoryPageTitle = document.getElementById('subcategory-page-title');
    const promoDescriptionText = document.getElementById('promo-description-text');
    const promoProcedureText = document.getElementById('promo-procedure-text');
    const promoFormFieldsContainer = document.getElementById('promo-form-fields');
    const submitPromoButton = document.getElementById('submit-promo-button');
    const backButtonSubToHome = document.getElementById('back-to-home-from-sub');
    const backButtonPromoPage = document.getElementById('back-to-categories');

    let currentPromotion = null;
    let parentCategory = null;

    // --- NAVIGATION ---
    function showPage(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
            window.scrollTo(0, 0);
        } else {
            console.error(`Page with ID ${pageId} not found.`);
        }
    }

    // --- AFFICHAGE ---
    function renderCategories() {
        if (!categoryListContainer) {
             console.error("Category list container (#category-list) not found!");
             return;
        }
        categoryListContainer.innerHTML = promotionsData.map(promo => {
            const layoutClass = promo.layoutClass || '';
            return `
                <div
                    class="category-card ${layoutClass}"
                    data-promo-id="${promo.id}"
                    style="background-image: url('${promo.categoryImage || ''}');"
                ></div>
            `;
        }).join('');
    }

    function renderSubcategories(categoryId) {
        parentCategory = promotionsData.find(p => p.id === categoryId);
        if (!parentCategory || !parentCategory.subcategories) {
             console.error(`Subcategories for ${categoryId} not found.`);
             return;
        }
        if (!subcategoryPageTitle || !subcategoryListContainer) {
             console.error("Subcategory page elements (#subcategory-page-title or #subcategory-list) not found!");
             return;
        }

        subcategoryPageTitle.innerText = parentCategory.name;
        subcategoryListContainer.innerHTML = parentCategory.subcategories.map(sub => {
             const layoutClass = sub.layoutClass || '';
             return `
                <div
                    class="category-card ${layoutClass}"
                    data-parent-category-id="${categoryId}"
                    data-subcategory-id="${sub.id}"
                    style="background-image: url('${sub.categoryImage || ''}');"
                ></div>
            `;
        }).join('');
        showPage('page-subcategories');
    }

    function renderPromotionPage(promoData) {
        currentPromotion = promoData;
        if (!currentPromotion) return;
    
        if (!promoPageTitle || !promoDescriptionText || !promoProcedureText || !promoFormFieldsContainer) {
            console.error("One or more promotion page elements are missing!");
            return;
        }
    
        promoPageTitle.innerText = currentPromotion.name;
        promoDescriptionText.innerText = currentPromotion.description || "Pas de description.";
        promoProcedureText.innerText = currentPromotion.procedure ? currentPromotion.procedure.replace(/\\n/g, '\n') : 'Aucune procédure spécifiée.';
        promoFormFieldsContainer.innerHTML = '';
    
        if (currentPromotion.formFields) {
            currentPromotion.formFields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                if (field.id === 'otherShop') {
                    formGroup.classList.add('hidden'); // Caché par défaut
                }
    
                const label = document.createElement('label');
                label.setAttribute('for', field.id); // L'attribut 'for' pointera vers l'input caché pour image-select
                label.textContent = field.label + (field.required ? ' *' : '');
                formGroup.appendChild(label);
    
                let inputElement; // Pour stocker la valeur sélectionnée
    
                // NOUVELLE LOGIQUE pour 'image-select'
                if (field.type === 'image-select') {
                    // 1. Crée un conteneur pour les images
                    const imageSelectContainer = document.createElement('div');
                    imageSelectContainer.className = 'image-select-container';
                    imageSelectContainer.id = `container-${field.id}`; // ID unique pour le conteneur
    
                    // 2. Crée un input caché pour stocker la valeur
                    inputElement = document.createElement('input');
                    inputElement.type = 'hidden';
                    inputElement.id = field.id;
                    inputElement.name = field.id;
                    if (field.required) {
                        inputElement.required = true;
                    }
                    formGroup.appendChild(inputElement); // Ajoute l'input caché au groupe
    
                    // 3. Crée les options images cliquables
                    if (field.options) {
                        field.options.forEach(option => {
                            const optionDiv = document.createElement('div');
                            optionDiv.className = 'image-option';
                            optionDiv.style.backgroundImage = `url('${option.imageSrc}')`;
                            optionDiv.dataset.value = option.value; // Stocke la valeur à enregistrer
    
                            // Ajoute l'écouteur de clic pour la sélection
                            optionDiv.addEventListener('click', () => {
                                // Désélectionne les autres options dans ce groupe
                                imageSelectContainer.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('selected'));
                                // Sélectionne l'option cliquée
                                optionDiv.classList.add('selected');
                                // Met à jour la valeur de l'input caché
                                inputElement.value = option.value;
                                // Déclenche un événement 'input' sur l'input caché pour la validation
                                inputElement.dispatchEvent(new Event('input', { bubbles: true })); 
                                
                                // Gère l'affichage du champ "Autre boutique" si besoin
                                if (field.id === 'shopName') {
                                    const otherShopGroup = document.getElementById('otherShop')?.closest('.form-group');
                                    if (otherShopGroup) {
                                         otherShopGroup.classList.toggle('hidden', option.value !== 'Autre (préciser)');
                                     }
                                }
                            });
                            imageSelectContainer.appendChild(optionDiv);
                        });
                    }
                    formGroup.appendChild(imageSelectContainer); // Ajoute le conteneur d'images au groupe
    
                } else if (field.type === 'select') { // Laisse le 'select' standard pour d'autres usages
                    inputElement = document.createElement('select');
                    // ... (code existant pour le select standard) ...
                    formGroup.appendChild(inputElement); // Ajoute le select au groupe
                } else if (field.type === 'textarea') {
                    inputElement = document.createElement('textarea');
                    // ... (code existant pour textarea) ...
                    formGroup.appendChild(inputElement); // Ajoute textarea au groupe
                } else { // Cas par défaut (input text, number, date, etc.)
                    inputElement = document.createElement('input');
                     // ... (code existant pour input) ...
                     formGroup.appendChild(inputElement); // Ajoute input au groupe
                }
                 
                // Logique pour le calcul de réduction (inchangée, mais attachée à l'input approprié)
                if (field.calculateDiscount && currentPromotion.discountPercent && inputElement && inputElement.type !== 'hidden') {
                    const discountDisplay = document.createElement('div');
                    discountDisplay.id = `${field.id}-discount`;
                    discountDisplay.className = 'discount-display hidden';
                    formGroup.appendChild(discountDisplay);
                    inputElement.addEventListener('input', () => calculateDiscount(field.id, currentPromotion.discountPercent));
                }
    
                promoFormFieldsContainer.appendChild(formGroup);
            });
        }
    
        if (backButtonPromoPage) {
            backButtonPromoPage.onclick = () => {
                 if (parentCategory) {
                     renderSubcategories(parentCategory.id);
                 } else {
                     showPage('page-home');
                 }
            };
        } else {
            console.error("Back button for promotion page (#back-to-categories) not found!");
        }
    
        checkFormValidity();
        showPage('page-promotion');
    }

    // --- LOGIQUE FORMULAIRE & CALCUL ---
    function calculateDiscount(priceFieldId, discountPercent) {
        const priceInput = document.getElementById(priceFieldId);
        const discountDisplay = document.getElementById(`${priceFieldId}-discount`);
        if (!priceInput || !discountDisplay) return;

        const originalPrice = parseFloat(priceInput.value);

        if (!isNaN(originalPrice) && originalPrice > 0) {
            const discountAmount = (originalPrice * discountPercent) / 100;
            const finalPrice = originalPrice - discountAmount;
            discountDisplay.innerHTML = `Prix après ${discountPercent}% de réduction : <span>${finalPrice.toFixed(2)}€</span>`;
            discountDisplay.classList.remove('hidden');
        } else {
            discountDisplay.classList.add('hidden');
        }
        checkFormValidity();
    }

    function checkFormValidity() {
        if (!currentPromotion || !currentPromotion.formFields) {
            if (submitPromoButton) submitPromoButton.disabled = true;
            return;
        }

        let isFormValid = true;
        currentPromotion.formFields.forEach(field => {
            const input = document.getElementById(field.id);
            if (!input) {
                if (field.id !== 'otherShop') {
                   console.warn(`Element with ID ${field.id} not found for validation.`);
                }
                 return;
            }

            const formGroup = input.closest('.form-group'); // Get parent group
            // Ignore validation for hidden fields (like 'otherShop' when not needed)
            if (formGroup && formGroup.classList.contains('hidden')) {
                 return;
            }

            if (field.required && !input.value.trim()) {
                isFormValid = false;
            }
        });
        if (submitPromoButton) submitPromoButton.disabled = !isFormValid;
    }


    function formatPromoMessage() {
        if (!currentPromotion) return "Erreur: Aucune promotion sélectionnée.";

        const promoTitle = parentCategory ? `${parentCategory.name} - ${currentPromotion.name}` : currentPromotion.name;

        let message = `*Nouvelle demande - ${promoTitle}*\n\n`;
        message += `*Détails de la demande :*\n`;
        let finalPriceInfo = '';

        if (currentPromotion.formFields) {
            currentPromotion.formFields.forEach(field => {
                const input = document.getElementById(field.id);
                 // Check if input exists AND its parent group is not hidden
                const formGroup = input ? input.closest('.form-group') : null;
                if (input && input.value && formGroup && !formGroup.classList.contains('hidden')) {
                    if (field.id === 'shopName' && input.value === 'Autre (préciser)') {
                         const otherShopInput = document.getElementById('otherShop');
                         if (otherShopInput && otherShopInput.value) {
                             message += `- ${field.label}: Autre (${otherShopInput.value})\n`;
                         } else {
                              message += `- ${field.label}: Autre (non précisé)\n`;
                         }
                    } else { // Removed the 'else if (field.id !== 'otherShop')' to include all visible fields
                         message += `- ${field.label}: ${input.value}\n`;
                    }

                    if (field.calculateDiscount && currentPromotion.discountPercent) {
                        const originalPrice = parseFloat(input.value);
                        if (!isNaN(originalPrice) && originalPrice > 0) {
                            const discountAmount = (originalPrice * currentPromotion.discountPercent) / 100;
                            const finalPrice = originalPrice - discountAmount;
                            finalPriceInfo = `*Prix après ${currentPromotion.discountPercent}% réduction:* ${finalPrice.toFixed(2)}€\n`;
                        }
                    }
                } else if (field.required && (!formGroup || !formGroup.classList.contains('hidden'))) {
                    // Log warning only for required fields that are supposed to be visible
                    console.warn(`Champ requis "${field.label}" (ID: ${field.id}) manquant ou caché dans le message.`);
                }
            });
        }


        if (finalPriceInfo) {
            message += `\n${finalPriceInfo}`;
        }
        message += `\n*Promotion Appliquée:* ${currentPromotion.name} (-${currentPromotion.discountPercent || 'N/A'}%)\n`;
        message += `\n_Demande envoyée le ${new Date().toLocaleDateString('fr-FR')}_`;
        return message;
    }


    // --- GESTION DES ÉVÉNEMENTS ---

    // Gère les clics sur la page d'accueil (catégories)
    if (categoryListContainer) {
        categoryListContainer.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const promoId = categoryCard.dataset.promoId;
                const promotion = promotionsData.find(p => p.id === promoId);
                if (promotion) {
                    if (promotion.subcategories && promotion.subcategories.length > 0) {
                        renderSubcategories(promoId);
                    } else {
                        parentCategory = null;
                        renderPromotionPage(promotion);
                    }
                } else {
                     console.error(`Promotion data not found for ID: ${promoId}`);
                }
            }
        });
    } else {
         console.error("Category list container (#category-list) not found!");
    }


    // Gère les clics sur la page des sous-catégories
    if(subcategoryListContainer) {
        subcategoryListContainer.addEventListener('click', (e) => {
            const subcategoryCard = e.target.closest('.category-card');
            if (subcategoryCard) {
                const parentId = subcategoryCard.dataset.parentCategoryId;
                const subId = subcategoryCard.dataset.subcategoryId;
                const parent = promotionsData.find(p => p.id === parentId);
                const subcategory = parent?.subcategories.find(s => s.id === subId);
                if (subcategory) {
                    parentCategory = parent;
                    renderPromotionPage(subcategory);
                } else {
                     console.error(`Subcategory data not found for ID: ${subId} in parent ${parentId}`);
                }
            }
        });
    } else {
        // C'est normal si cette page n'existe pas encore dans le HTML initial
        // console.warn("Subcategory list container (#subcategory-list) not found! Maybe it's created dynamically.");
    }


    // Bouton retour depuis la page des sous-catégories vers l'accueil
    if (backButtonSubToHome) {
        backButtonSubToHome.addEventListener('click', () => {
            showPage('page-home');
            parentCategory = null;
        });
    } else {
         console.error("Back button from subcategories (#back-to-home-from-sub) not found!");
    }
  // AJOUTE CE NOUVEAU BLOC pour le bouton retour de la page promotion
  if (backButtonPromoPage) {
    backButtonPromoPage.addEventListener('click', () => {
        // Vérifie s'il y avait une catégorie parente (on vient d'une sous-catégorie)
        if (parentCategory) {
            renderSubcategories(parentCategory.id); // Retourne à la liste des sous-catégories
        } else {
            showPage('page-home'); // Sinon, retourne à l'accueil
        }
    });
} else {
    console.error("Back button for promotion page (#back-to-categories) not found!");
}

    // Le bouton retour de la page promo est géré dynamiquement dans renderPromotionPage

    // Écouteur pour la validité du formulaire
    if (promoFormFieldsContainer) {
        promoFormFieldsContainer.addEventListener('input', checkFormValidity);
    } else {
        console.error("Promo form fields container (#promo-form-fields) not found!");
    }


    // Bouton d'envoi du formulaire
    if (submitPromoButton) {
        submitPromoButton.addEventListener('click', () => {
            if (!currentPromotion || submitPromoButton.disabled) return;
            const message = formatPromoMessage();
            const encodedMessage = encodeURIComponent(message);
            const telegramUrl = `https://t.me/${TARGET_TELEGRAM_USERNAME}?text=${encodedMessage}`;
             // Vérifie si tg est initialisé avant de l'utiliser
            if (tg) {
                tg.openLink(telegramUrl);
            } else {
                console.error("Telegram WebApp (tg) is not initialized. Cannot open link.");
                 window.open(telegramUrl, '_blank');
            }
        });
    } else {
        console.error("Submit promo button (#submit-promo-button) not found!");
    }


    // --- INITIALISATION ---
    try {
        renderCategories();
        showPage('page-home');
    } catch (error) {
         console.error("Error during initial render:", error);
         // Afficher un message d'erreur à l'utilisateur pourrait être utile ici
         document.body.innerHTML = "<p>Une erreur est survenue lors du chargement de l'application.</p>";
    }


});

