document.addEventListener("DOMContentLoaded", (event) => {
    

const aside = document.querySelector('#modall');
const modalAjout = document.getElementById('modalAjoutPhoto');
const closeButton = document.querySelector('.close');
const ferme = document.getElementById('ferme');
let modalShouldClose = true;
modalGal();

//fermer modale
ferme.addEventListener('click', function () {
    closeModal()
});

//show button
const modifier = document.getElementById('modifierProjetLink');
modifier.addEventListener('click', function () {
    aside.classList.remove("dnone");
});

function openModal(e) {
    e.preventDefault();
    document.body.classList.add("modal-open");
    // modall
    const target = document.querySelector(e.target.getAttribute('href'));
   

    const modifier = document.getElementById('ajouterProjetLink');
    modifier.addEventListener('click', function () {
        modalAjoutPhoto();
        return;
    });
 
    if (!target) {
        console.error("L'élément cible n'existe pas dans le DOM.");
        return;
    }

    modal = target;

    
   /* const modalCloseButton = modal.querySelector('.js-modal-close');
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }

  
    const modalStopButton = modal.querySelector('.js-modal-stop');
    if (modalStopButton) {
        modalStopButton.addEventListener('click', stopPropagation);
    } */

  
    // window.addEventListener('click', outsideClickHandler);
}


/* function outsideClickHandler(event) {
    if (modal && !modal.contains(event.target) && event.target !== modal) {
        if (modalShouldClose) {
            closeModal(event);
        }
    }
}
*/

Array.from(closeButton).forEach(element => {
    element.addEventListener('click',closeModal())
});

function closeModal() {
    document.body.classList.remove("modal-open");
    aside.classList.add("dnone");
    modalAjout.classList.add("dnone");
    // if (modal === null) return;
    // e.preventDefault();

    // const closeButton = modal.querySelector('.js-modal-close');

    /* if (closeButton) {
        closeButton.removeEventListener('click', closeModal);
    } */

    //modal.style.display = 'none';
    //modal.setAttribute('aria-hidden', 'true');
    //modal.removeAttribute('aria-modal');
    // modal.removeEventListener('click', closeModal);
    // modal = null;

   
   // window.removeEventListener('click', outsideClickHandler);
}

// create modal gallery project
const modaleSectionProjets = document.querySelector('#gallery-modal');
async function populateModalWithData(data) {
    modaleSectionProjets.innerHTML='';
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

async function modalGal() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        

      
        await populateModalWithData(data);

        return data;
    } catch (error) {
        console.error('Erreur de récupération des données des travaux:', error);
        throw error;
    }
}


const stopPropagation = function (e) {
    e.stopPropagation();
}


document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
});


window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }
});
// Définition de la fonction loadFile
const loadFile = function(event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src); // libérer la mémoire
    };
};

// Associer la fonction loadFile à l'événement onchange de l'input de type file
const fileInput = document.getElementById('pictureProjet');
fileInput.addEventListener('change', loadFile);

async function modalAjoutPhoto() {
    aside.classList.add("dnone");
    modalAjout.classList.remove("dnone");
    
    // add project form
    const formAjoutPhoto = document.getElementById('formAjoutPhoto');

    const backButton = modalAjout.querySelector('#retourGalerie');
    

   // Ajouter la fonction loadFile pour afficher l'image
   const loadFile = function(event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src); // free memory
    };
};

// Associer la fonction loadFile à l'événement onchange de l'input de type file
const fileInput = document.getElementById('pictureProjet');
fileInput.addEventListener('change', loadFile);



    
    backButton.addEventListener('click', function() {
        event.preventDefault();
       
        aside.classList.remove("dnone");
        modalAjout.classList.add("dnone");
        
       
    });

   
    // modalAjout.style.display = 'block';
    // modalAjout.removeAttribute('aria-hidden');
    // modalAjout.removeAttribute('aria-modal', 'true');


    const modalCloseButton = document.getElementById(ferme)
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }

    
    const modalStopButton = document.getElementById(ferme)
    if (modalStopButton) {
        modalStopButton.addEventListener('click', stopPropagation);
    }

  
    //window.addEventListener('click', outsideClickHandler);

  
    formAjoutPhoto.addEventListener('submit', async function (event) {
        event.preventDefault(); 
        
        document.querySelector('#butAdd') //.disabled=true
        
        const formData = new FormData(); 
       
      const titrePhoto = document.getElementById('titrePhoto').value
      const catPhoto = document.getElementById('categoriePhoto').value
      const imgPhoto = document.getElementById('pictureProjet').files
       formData.append('image',imgPhoto[0])
       formData.append('title',titrePhoto)
       formData.append('category',catPhoto)
       
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
            
            if (response.ok) {
                const data = await response.json();
                const galerie = document.getElementById('gallery');

                const figure = document.createElement('figure');

                const image = document.createElement('img');
                image.src = 'http://localhost:5678/images/'+imgPhoto[0].name;
                
                image.alt = data.title;
                figure.appendChild(image);
      
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = data.title;
                figure.appendChild(figcaption);
      
                galerie.appendChild(figure);
                this.reset();
                document.getElementById('titrePhoto').value = '';
                //edit
                await updateGallery();
                await modalGal();

                // return modal gallery
                aside.classList.remove("dnone");
                modalAjout.classList.add("dnone");
            }
         

            
            //closeModal();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la photo :", error); 
        } 
    });
}
});