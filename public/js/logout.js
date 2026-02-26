document.getElementById('logoutLink').addEventListener('click', async function(event) {
    event.preventDefault(); // Mencegah aksi default dari tautan

    try {
        await fetch('/v1/logout-admin', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Error during logout:', error);
    }

    // Ganti halaman saat ini dalam riwayat dengan halaman login
    window.history.replaceState({}, document.title, "/");

    // Arahkan ke halaman login atau halaman utama setelah logout
    window.location.href = '/login-admin';  // Sesuaikan dengan rute yang Anda inginkan
});

// Tambahkan pemeriksaan status autentikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    authorize();
});

// Tambahkan event listener untuk menangani navigasi 'back' (popstate)
window.addEventListener('popstate', function(event) {
    authorize();
});
