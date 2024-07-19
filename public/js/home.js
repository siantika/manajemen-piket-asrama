$(document).ready(function() {
    $('#searchInput').on('keyup', function() {
      let value = $(this).val().toLowerCase();
      $('#cardsContainer .card').filter(function() {
        $(this).toggle($(this).find('.card-title').text().toLowerCase().indexOf(value) > -1);
      });
    });
  });
  