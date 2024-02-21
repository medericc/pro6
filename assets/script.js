$(function() { 
	
	const slides = [
	{
	  "image": "slide1.jpg",
	  "tagLine": "Impressions tous formats <span>en boutique et en ligne</span>"
	},
	{
	  "image": "slide2.jpg",
	  "tagLine": "Tirages haute définition grand format <span>pour vos bureaux et events</span>"
	},
	{
	  "image": "slide3.jpg",
	  "tagLine": "Grand choix de couleurs <span>de CMJN aux pantones</span>"
	},
	{
	  "image": "slide4.png",
	  "tagLine": "Autocollants <span>avec découpe laser sur mesure</span>"
	}
  ];
 
 
 	const dotsContainer = $('.dots');

	$("#banner .arrow_left").click( function () {

		// Point switch
		var currentDot = $('.dots .dot_selected');
		// Si pas de précédent, revenir au dernier
		var previousDot = currentDot.prev('.dot').length ? currentDot.prev('.dot') : $('.dots .dot').last();
		currentDot.removeClass('dot_selected');
		previousDot.addClass('dot_selected');

		// Récupérer l'index de la diapo précédente
		var previousSlideIndex = $('.dots .dot').index(previousDot);

		// Changer l'image
		var slideImage = $('.banner-img');
		slideImage.attr('src', `./assets/images/slideshow/${slides[previousSlideIndex].image}`);

		// Aussi pour le paragraphe
		var tagLine = $('#banner p');
		// Modifier le contenu du paragraphe
		tagLine.html(slides[previousSlideIndex].tagLine);

}
)

	$("#banner .arrow_right").click( function () {

		// Point switch
		var currentDot = $('.dots .dot_selected');
		// Si pas de précédent, revenir au dernier
		var previousDot = currentDot.next('.dot').length ? currentDot.next('.dot') : $('.dots .dot').first();
		currentDot.removeClass('dot_selected');
		previousDot.addClass('dot_selected');

		// Récupérer l'index de la diapo précédente
		var previousSlideIndex = $('.dots .dot').index(previousDot);

		// Changer l'image
		var slideImage = $('.banner-img');
		slideImage.attr('src', `./assets/images/slideshow/${slides[previousSlideIndex].image}`);

		// Pour le paragraphe aussi
		var tagLine = $('#banner p');
		// Modifier le contenu du paragraphe
		tagLine.html(slides[previousSlideIndex].tagLine);

}
)

	$(".dots").click(function(e){

		if (e.target.classList.contains('dot')) {
			//recuperer index
		const clickedIndex = parseInt(e.target.getAttribute('data-index'), 10);
		currentSlideIndex = clickedIndex;
		
		}
})

	// Parcourir chaque diapositive
	$.each(slides, function(index, slide) {
		
		// Créer un élément div pour le point
		var dot = $('<div>').addClass('dot').attr('data-index', index);
	
		// Ajouter la classe 'dot_selected' au premier point
		if (index === 0) {
			dot.addClass('dot_selected');
		}
	
		// Ajouter le point au conteneur de points
		dotsContainer.append(dot);
});



});