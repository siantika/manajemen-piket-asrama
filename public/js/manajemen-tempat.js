document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const editButtons = document.querySelectorAll('.edit-btn');
    const saveButtons = document.querySelectorAll('.save-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const form = this.closest('form');
            const tempatId = form.getAttribute('data-id');
            const authToken = localStorage.getItem('authToken');

            if (confirm('Apakah Anda yakin ingin menghapus tempat ini?')) {
                try {
                    const response = await fetch(`/v1/places/${tempatId}`, {
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
                    alert("Terjadi kesalahan saat mencoba menghapus tempat: " + error.message);
                }
            }
        });
    });

// Menangani tombol Edit
editButtons.forEach((button) => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const nameDisplay = row.querySelector('.name-display');
        const nameInput = row.querySelector('.name-input');
        const saveButton = row.querySelector('.save-btn');
        const statusDisplay = row.querySelector('.status-display');
        const statusInput = row.querySelector('.status-input');

        // Tampilkan input teks dan tombol Simpan, sembunyikan nama dan tombol Edit
        nameDisplay.classList.add('d-none');
        nameInput.classList.remove('d-none');
        statusDisplay.classList.add('d-none');
        statusInput.classList.remove('d-none');
        saveButton.classList.remove('d-none');
        
        this.classList.add('d-none'); // Sembunyikan tombol Edit
    });
});

// Menangani tombol Simpan
saveButtons.forEach((button) => {
    button.addEventListener('click', async function () {
        const row = this.closest('tr');
        const nameInput = row.querySelector('.name-input');
        const statusInput = row.querySelector('.status-input');
        const memberIdSelected = row.querySelector('.delete-form').getAttribute('data-id');
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`/v1/places`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ placeId: memberIdSelected, placeName: nameInput.value, placeStatus: statusInput.value })
            });

            const data = await response.json();

            if (response.ok) {
                // Jika berhasil, perbarui tampilan nama dan sembunyikan input
                row.querySelector('.name-display').textContent = nameInput.value;
                row.querySelector('.status-display').textContent = statusInput.options[statusInput.selectedIndex].text;
                nameInput.classList.add('d-none');
                row.querySelector('.name-display').classList.remove('d-none');
                statusInput.classList.add('d-none');
                row.querySelector('.status-display').classList.remove('d-none');
                this.classList.add('d-none'); // Sembunyikan tombol Simpan
                row.querySelector('.edit-btn').classList.remove('d-none'); // Tampilkan tombol Edit kembali
                alert("Data berhasil diperbarui!");
            } else {
                alert(`Gagal memperbarui data: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Terjadi kesalahan saat mencoba memperbarui data.");
        }
    });
});


    // Handle Add Person
    addPersonForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Mencegah form submit default

        const formData = new FormData(addPersonForm);
        const authToken = localStorage.getItem('authToken');

        fetch('/v1/members', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                memberName: formData.get('memberName'),
            })
        })
            .then(response => {
                if (!response.ok) {
                    // Jika respons tidak dalam rentang 200-299
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Mengurai JSON dari respons
            })
            .then(data => {

                const { message, data: personData } = data;

                if (personData) {
                    // Tambah baris baru ke tabel
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
              <td>
                <strong class="name-display">${personData.memberName}</strong>
                <input type="text" class="form-control name-input d-none" value="${personData.memberName}" />
              </td>
              <td>${personData.memberRole}</td>
              <td>
                <button type="button" class="btn btn-warning btn-sm edit-btn">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button type="button" class="btn btn-success btn-sm save-btn d-none">
                  <i class="bi bi-check"></i> Simpan
                </button>
                <form class="delete-form" data-id="${personData.memberId}" style="display:inline;">
                  <button type="button" class="btn btn-danger btn-sm delete-btn">
                    <i class="bi bi-trash"></i> Hapus
                  </button>
                </form>
              </td>
            `;
                    document.querySelector('table tbody').appendChild(newRow);

                    alert(`"${personData.memberName}" berhasil ditambahkan!`);
                    // Reset form
                    addPersonForm.reset();

                    // Tutup modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addPersonModal'));
                    modal.hide();
                } else {
                    alert('Gagal menambah orang: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menambah orang.');
            });
    });
});
