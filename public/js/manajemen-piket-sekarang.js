document.addEventListener("DOMContentLoaded", function () {
    authorize();
    let tempData = {}; 
    let hasUnsavedChanges = false;

    // Initialize validation buttons based on status
    document.querySelectorAll('.edit-btn').forEach(button => {
        const index = button.getAttribute('data-index');
        const statusCell = document.getElementById('status-' + index);
        const currentStatus = statusCell.textContent.trim();

        if (currentStatus === 'sudah') {
            // Set button to already validated state
            button.classList.remove('btn-warning');
            button.classList.add('btn-success');
            button.innerHTML = '<i class="bi bi-x"></i> Batalkan Validasi';
        } else {
            // Set button to unvalidated state
            button.classList.remove('btn-success');
            button.classList.add('btn-warning');
            button.innerHTML = '<i class="bi bi-pencil"></i> Validasi';
        }
    });

    // Event handler for changing place
    document.querySelectorAll('.change-place-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const tempatText = document.getElementById('tempat-' + index);
            const tempatDropdown = document.getElementById('dropdown-' + index);
            const saveChangesBtn = document.getElementById('save-changes-btn');
    
            if (tempatDropdown.classList.contains('d-none')) {
                // Show dropdown and hide text
                tempatText.classList.add('d-none');
                tempatDropdown.classList.remove('d-none');
                this.textContent = 'Simpan Tempat';
    
                tempatDropdown.addEventListener('change', () => {
                    const selectedTempat = tempatDropdown.value;
                    if (selectedTempat !== tempatText.textContent.trim()) {
                        this.classList.add('btn-danger'); // Warna merah jika ada perubahan
                        hasUnsavedChanges = true; // Ada perubahan yang belum disimpan
                    } else {
                        this.classList.remove('btn-danger'); // Kembali ke warna normal jika tidak ada perubahan
                    }
                });
    
            } else {
                const selectedTempat = tempatDropdown.value;
                tempatText.textContent = selectedTempat;
                tempatText.classList.remove('d-none');
                tempatDropdown.classList.add('d-none');
                this.textContent = 'Ubah Tempat';
                this.classList.remove('btn-danger'); // Reset warna setelah menyimpan
    
                tempData[index] = {
                    tempat: selectedTempat,
                    id: button.dataset.id,
                    status: document.getElementById('status-' + index).textContent.trim()
                };

                alert(`Tempat berhasil diubah!`);
                hasUnsavedChanges = true; // Ada perubahan yang belum disimpan
            }
        });
    });
    
    // Event handler for validation button
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const statusCell = document.getElementById('status-' + index);
            const currentStatus = statusCell.textContent.trim();
            const saveChangesBtn = document.getElementById('save-changes-btn');

            if (currentStatus === 'sudah') {
                statusCell.textContent = 'belum';
                button.classList.remove('btn-success');
                button.classList.add('btn-warning');
                button.innerHTML = '<i class="bi bi-pencil"></i> Validasi';
            } else {
                statusCell.textContent = 'sudah';
                button.classList.remove('btn-warning');
                button.classList.add('btn-success');
                button.innerHTML = '<i class="bi bi-x"></i> Batalkan Validasi';
            }

            if (tempData[index]) {
                tempData[index].status = statusCell.textContent.trim();
            } else {
                tempData[index] = {
                    id: button.dataset.id,
                    tempat: document.getElementById('tempat-' + index).textContent.trim(),
                    status: statusCell.textContent.trim(),
                };
            }

            saveChangesBtn.classList.add('btn-danger');
            hasUnsavedChanges = true; // Ada perubahan yang belum disimpan
        });
    });

    // Function to send data recursively
    async function sendData(index, dataToSend, authToken) {
        if (index >= dataToSend.length) {
            alert('validasi berhasil');
            hasUnsavedChanges = false; // Semua perubahan telah disimpan
            location.reload(); 
            return;
        }

        try {
            const response = await fetch('/v1/update/piket-sekarang', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend[index])
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert('Gagal menyimpan data');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menyimpan perubahan');
        }

        sendData(index + 1, dataToSend, authToken);
    }

    // Event handler for saving changes
    document.getElementById('save-changes-btn').addEventListener('click', function() {
        const authToken = localStorage.getItem('authToken');
        const saveChangesBtn = document.getElementById('save-changes-btn');

        const dataToSend = Object.keys(tempData).map(index => ({
            id: tempData[index].id,
            tempatPiket: tempData[index].tempat,
            status: tempData[index].status,
        }));

        sendData(0, dataToSend, authToken).then(() => {
            saveChangesBtn.classList.remove('btn-danger');
            saveChangesBtn.classList.add('btn-success');
        });
    });

    // Event listener for beforeunload
    window.addEventListener('beforeunload', function (e) {
        if (hasUnsavedChanges) {
            const confirmationMessage = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?';
    
            // Standar cara modern untuk menampilkan peringatan sebelum unload
            e.preventDefault();  // Ini hanya diperlukan untuk beberapa browser lama (tidak selalu diperlukan)
            e.returnValue = ''; // Diperlukan untuk memastikan peringatan ditampilkan di beberapa browser
            return confirmationMessage; // Beberapa browser memerlukan pengembalian nilai untuk menampilkan peringatan
        }
    });
    
});
