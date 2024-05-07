async function fetchProjets() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Erreur de récupération des données des travaux:', error);
    throw error; 
  }
}

async function fetchCategories() {
  try {
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();

    return categoriesData;
  } catch (error) {
    console.error('Erreur de récupération des catégories:', error);
    throw error;
  }
}

async function updateGallery(filter = 'all') {
 
  console.log(filter);
  try {
    const projets = await fetchProjets();
    const categories = await fetchCategories();

    const galerie = document.getElementById('gallery');
    galerie.innerHTML = '';

    if (projets && projets.length > 0) {
      const filteredProjets = projets.filter(projet => {
        if (filter === 'all') {
          return true;
        } else {
          return projet.categoryId === parseInt(filter);
        }
      });

      filteredProjets.forEach(projet => {
        const figure = document.createElement('figure');
        figure.id = "figure" + projet.id;
        const image = document.createElement('img');
        image.src = projet.imageUrl;
        image.alt = projet.title;
        figure.appendChild(image);
       
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = projet.title;
        figure.appendChild(figcaption);

        galerie.appendChild(figure);
      });
    } else {
      console.warn('Aucun projet trouvé.');
    }

    const menu = document.querySelector('.centre');
    menu.innerHTML = '';

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const tousLesTravauxOption = document.createElement('button');
      tousLesTravauxOption.classList.add('button');
      tousLesTravauxOption.dataset.filter = 'all';
      tousLesTravauxOption.textContent = 'Tous';
      menu.appendChild(tousLesTravauxOption);

      tousLesTravauxOption.addEventListener('click', () => {
        updateGallery('all');
        document.querySelectorAll('.button').forEach(btn => {
          btn.classList.add('active');
        });
        tousLesTravauxOption.classList.remove('active');
      });

      categories.forEach(categorie => {
        const option = document.createElement('button');
        option.classList.add('button');
        option.dataset.filter = categorie.id;
        option.textContent = categorie.name;
        menu.appendChild(option);

        option.addEventListener('click', () => {
          updateGallery(option.dataset.filter);
          document.querySelectorAll('.button').forEach(btn => {
            btn.classList.add('active');
          });
        //  option.classList.remove('active');
        });
      });
    } else {
      console.warn('Aucune catégorie trouvée.');
    }

    enableBlackBar();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la galerie:', error);
  }
}



const filterButtons = document.querySelectorAll('.button');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    updateGallery(button.dataset.filter);
  });
});

async function enableBlackBar() {
  try {
    const isUserLoggedIn = sessionStorage.getItem('token') !== null;
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    const modifierButton2 = document.getElementById('modifierButton2');
    const filterButtons = document.querySelectorAll('.button'); 

    if (loginLogoutLink) {
      if (isUserLoggedIn) {
        loginLogoutLink.textContent = 'logout';
        loginLogoutLink.addEventListener('click', logout);
      } else {
        loginLogoutLink.textContent = 'login';
        loginLogoutLink.removeEventListener('click', logout);
      }
    }

    if (isUserLoggedIn) {
      const blackBar = document.createElement('div');
      blackBar.classList.add('black-bar');
      blackBar.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode Édition </p>';
      document.body.insertBefore(blackBar, document.body.firstChild);

      
      if (filterButtons && filterButtons.length > 0) {
        filterButtons.forEach(button => {
          button.style.display = 'none';
        });
      }

      if (modifierButton2) {
        modifierButton2.style.display = 'block';
      }
    }

    if (modifierButton2) {
      modifierButton2.style.display = isUserLoggedIn ? 'block' : 'none';
    }
  } catch (error) {
    console.error('Erreur lors de l\'activation de la barre noire:', error);
  }
}



function logout() {
  sessionStorage.removeItem('token');
  window.location.reload(); 
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    await updateGallery();
    await enableBlackBar();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la galerie ou de la barre noire:', error);
  }
});
