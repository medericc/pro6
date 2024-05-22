document.addEventListener("DOMContentLoaded", () => {
    const aside = document.querySelector('#modall');
    const modalAjout = document.getElementById('modalAjoutPhoto');
    const closeButton = document.querySelectorAll('.close');
    const ferme = document.getElementById('ferme');
    let modalShouldClose = true;

    // Fermer la modale
    ferme.addEventListener('click', closeModal);

    // Formulaire ajout photo
    const submitButton = document.getElementById('butAdd');
    const fileInput = document.getElementById('pictureProjet');
    const titleInput = document.getElementById('titrePhoto');
    const categoryInput = document.getElementById('categoriePhoto');
    const output = document.getElementById('output');
    const field = document.querySelector('.field');

    function checkFormCompletion() {
        if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && categoryInput.value.trim() !== "") {
            submitButton.disabled = false;
            submitButton.classList.add('enabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.remove('enabled');
        }
    }

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            output.src = URL.createObjectURL(file);
            output.onload = function() {
                URL.revokeObjectURL(output.src);
            }
            field.classList.add('visible');
        } else {
            field.classList.remove('visible');
        }
        checkFormCompletion();
    });

    titleInput.addEventListener('change', checkFormCompletion);
    categoryInput.addEventListener('change', checkFormCompletion);

   
    const modifier = document.getElementById('modifierProjetLink');
    modifier.addEventListener('click', () => {
        aside.classList.remove("dnone");
    });

    function openModal(e) {
        document.getElementById('overlay').style.display = 'block';
        e.preventDefault();

        const target = document.querySelector(e.target.getAttribute('href'));
        if (!target) {
            console.error("L'élément cible n'existe pas dans le DOM.");
            return;
        }

        modal = target;

        const modifier = document.getElementById('ajouterProjetLink');
        modifier.addEventListener('click', modalAjoutPhoto);

        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                closeModal(e);
            }
        });
    }

    Array.from(closeButton).forEach(element => {
        element.addEventListener('click', closeModal);
    });

    function closeModal() {
        document.getElementById('overlay').style.display = 'none';
        aside.classList.add("dnone");
        modalAjout.classList.add("dnone");
    }

    async function modalGal() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            const data = await response.json();
            await populateModalWithData(data);
            await populateMainGallery(data);  
            return data;
        } catch (error) {
            console.error('Erreur de récupération des données des travaux:', error);
            throw error;
        }
    }

    async function populateModalWithData(data) {
        const modaleSectionProjets = document.querySelector('#gallery-modal');
        modaleSectionProjets.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const div = document.createElement("div");
            modaleSectionProjets.appendChild(div);

            const img = document.createElement("img");
            img.src = data[i].imageUrl;
            img.alt = data[i].title;
            div.appendChild(img);
            div.classList.add("imageGallery");

            const deleteButton = document.createElement("div");
            deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
            deleteButton.classList.add("deleteButton");
            deleteButton.addEventListener("click", async (event) => {
                event.stopPropagation();
                modalShouldClose = false;
                try {
                    const token = sessionStorage.getItem('token');
                    if (!token) {
                        throw new Error("L'utilisateur n'est pas authentifié.");
                    }
                    const response = await fetch(`http://localhost:5678/api/works/${data[i].id}`, {
                        method: "DELETE",
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error("La suppression du travail a échoué.");
                    }
                    div.remove();
                    document.getElementById('figure' + data[i].id).remove();
                } catch (error) {
                    console.error("Erreur lors de la suppression du travail :", error);
                } finally {
                    modalShouldClose = true;
                }
            });
            div.appendChild(deleteButton);
        }
    }

    async function populateMainGallery(data) {
        const galerie = document.getElementById('gallery');
        galerie.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            const figure = document.createElement('figure');
            figure.id = 'figure' + data[i].id;
            const image = document.createElement('img');
            image.src = data[i].imageUrl;
            image.alt = data[i].title;
            figure.appendChild(image);
            const figcaption = document.createElement('figcaption');
            figcaption.textContent = data[i].title;
            figure.appendChild(figcaption);
            galerie.appendChild(figure);
        }
    }

    async function modalAjoutPhoto() {
        aside.classList.add("dnone");
        modalAjout.classList.remove("dnone");
    
        const formAjoutPhoto = document.getElementById('formAjoutPhoto');
        const backButton = modalAjout.querySelector('#retourGalerie');
        const submitButton = document.getElementById('butAdd');
        const fileInput = document.getElementById('pictureProjet');
        const titleInput = document.getElementById('titrePhoto');
        const categoryInput = document.getElementById('categoriePhoto');
        const output = document.getElementById('output');
        const field = document.querySelector('.field');
    
        backButton.addEventListener('click', function(event) {
            event.preventDefault();
            aside.classList.remove("dnone");
            modalAjout.classList.add("dnone");
        });
    
        formAjoutPhoto.addEventListener('submit', async function(event) {
            event.preventDefault();
            submitButton.disabled = true;
            const formData = new FormData();
            const titrePhoto = titleInput.value;
            const catPhoto = categoryInput.value;
            const imgPhoto = fileInput.files[0];
            formData.append('image', imgPhoto);
            formData.append('title', titrePhoto);
            formData.append('category', catPhoto);
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch('http://localhost:5678/api/works', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                if (!response.ok) {
                    throw new Error("Échec de l'ajout de la photo.");
                }
                const data = await response.json();
                await modalGal(); 
    
               
                formAjoutPhoto.reset();
                output.src = '#';
                field.classList.remove('visible');
                checkFormCompletion();
    
                aside.classList.remove("dnone");
                modalAjout.classList.add("dnone");
            } catch (error) {
                console.error("Erreur lors de l'ajout de la photo :", error);
            }
        });
    }

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    const loadFile = function(event) {
        const output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
            URL.revokeObjectURL(output.src);
        };
    };

    fileInput.addEventListener('change', loadFile);

    modalGal(); 
});
