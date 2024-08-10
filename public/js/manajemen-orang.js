document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = this.closest('form');
            const memberId = form.getAttribute('data-id');

            if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
                fetch(`/v1/members/${memberId}/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    if (!response.ok) {
                        // Jika response status bukan 2xx, lempar error
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json(); // Mengurai JSON jika response OK
                })
                .then(data => {
                    alert(data.message);
                    location.reload(); // Refresh halaman setelah berhasil menghapus
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Terjadi kesalahan saat mencoba menghapus anggota: " + error.message);
                });
            }
        });
    });
});
