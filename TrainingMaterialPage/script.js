// Get all elements with the class "guide-card"
var guideCards = document.querySelectorAll('.guide-card');

// Loop through each guide card
guideCards.forEach(function(card) {
    // Add click event listener to each guide card
    card.addEventListener('click', function() {
        // Find the hidden link within the clicked guide card
        var link = card.querySelector('.guide-card-link');
        // Get the href attribute value of the link
        var href = link.getAttribute('href');
        // Open the link in a new tab
        window.open(href, '_blank');
    });
});
