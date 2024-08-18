document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the link

    localStorage.removeItem('authToken');
    window.location.href = '/';  // Adjust the path as needed
});
