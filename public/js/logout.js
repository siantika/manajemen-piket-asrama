document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault(); // Mencegah aksi default dari tautan

    // Hapus token dari localStorage
    localStorage.removeItem('authToken');

    // Ganti halaman saat ini dalam riwayat dengan halaman login
    window.history.replaceState({}, document.title, "/");

    // Arahkan ke halaman login atau halaman utama setelah logout
    window.location.href = '/';  // Sesuaikan dengan rute yang Anda inginkan
});

// Tambahkan pemeriksaan status autentikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    
    // Jika token tidak ada, redirect ke halaman login
    if (!authToken) {
        window.location.href = '/';  // Sesuaikan dengan rute login Anda
    }
});

// Tambahkan event listener untuk menangani navigasi 'back' (popstate)
window.addEventListener('popstate', function(event) {
    const authToken = localStorage.getItem('authToken');

    // Jika tidak ada token, redirect ke halaman login
    if (!authToken) {
        window.location.href = '/';  // Sesuaikan dengan rute login Anda
    }
});
