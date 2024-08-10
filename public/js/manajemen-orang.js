document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const saveButtons = document.querySelectorAll('.save-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const form = this.closest('form');
            const memberId = form.getAttribute('data-id');
            const authToken = localStorage.getItem('authToken');

            if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
                try {
                    const response = await fetch(`/v1/members/${memberId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }

                    const data = await response.json();
                    alert(data.message);
                    location.reload(); // Refresh halaman setelah berhasil menghapus
                } catch (error) {
                    console.error('Error:', error);
                    alert("Terjadi kesalahan saat mencoba menghapus anggota: " + error.message);
                }
            }
        });
    });

    editButtons.forEach((button) => {
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

    saveButtons.forEach((button) => {
        button.addEventListener('click', async function () {
            const row = this.closest('tr');
            const nameInput = row.querySelector('.name-input');
            const memberIdSelected = row.querySelector('.delete-form').getAttribute('data-id');
            const authToken = localStorage.getItem('authToken');

            try {
                const response = await fetch(`/v1/members`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ memberId:memberIdSelected, memberName: nameInput.value })
                });

                const data = await response.json();

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
            } catch (error) {
                console.error('Error:', error);
                alert("Terjadi kesalahan saat mencoba memperbarui nama.");
            }
        });
    });
});
