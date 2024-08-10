document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = this.closest('form');
            const memberId = form.getAttribute('data-id');
            const authToken = localStorage.getItem('authToken');

            if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
                fetch(`/v1/members/${memberId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
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

document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll('.edit-btn');
    const saveButtons = document.querySelectorAll('.save-btn');

    editButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const nameDisplay = row.querySelector('.name-display');
            const nameInput = row.querySelector('.name-input');
            const saveButton = row.querySelector('.save-btn');

            // Tampilkan input teks dan tombol Simpan, sembunyikan nama dan tombol Edit
            nameDisplay.classList.add('d-none');
            nameInput.classList.remove('d-none');
            saveButton.classList.remove('d-none');
            this.classList.add('d-none'); // Sembunyikan tombol Edit
        });
    });

    saveButtons.forEach((button, index) => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const nameInput = row.querySelector('.name-input');
            const memberId = row.querySelector('.delete-form').getAttribute('data-id');

            // Kirim perubahan ke server dengan AJAX
            fetch(`/people/${memberId}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ memberName: nameInput.value })
            })
            .then(response => response.json())
            .then(data => {
                if (response.ok) {
                    // Jika berhasil, perbarui tampilan nama dan sembunyikan input
                    row.querySelector('.name-display').textContent = nameInput.value;
                    nameInput.classList.add('d-none');
                    row.querySelector('.name-display').classList.remove('d-none');
                    this.classList.add('d-none'); // Sembunyikan tombol Simpan
                    row.querySelector('.edit-btn').classList.remove('d-none'); // Tampilkan tombol Edit kembali
                    alert("Nama berhasil diperbarui!");
                } else {
                    alert(`Gagal memperbarui nama: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Terjadi kesalahan saat mencoba memperbarui nama.");
            });
        });
    });
});
