document.addEventListener("DOMContentLoaded", function () {
    let tempData = {}; // Temporary storage for changes

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

            if (tempatDropdown.classList.contains('d-none')) {
                // Show dropdown and hide text
                tempatText.classList.add('d-none');
                tempatDropdown.classList.remove('d-none');
                this.textContent = 'Simpan Tempat';
            } else {
                // Change place and hide dropdown
                const selectedTempat = tempatDropdown.value;
                tempatText.textContent = selectedTempat;
                tempatText.classList.remove('d-none');
                tempatDropdown.classList.add('d-none');
                this.textContent = 'Ubah Tempat';

                // Save the change to tempData
                tempData[index] = {
                    tempat: selectedTempat,
                    id: button.dataset.id,
                    status: document.getElementById('status-' + index).textContent.trim()
                };
                console.log(`Temp data at index ${index}:`, tempData[index]);
            }
        });
    });

    // Event handler for validation button
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const statusCell = document.getElementById('status-' + index);
            const currentStatus = statusCell.textContent.trim();

            if (currentStatus === 'sudah') {
                statusCell.textContent = 'Belum';
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
        });
    });

    // Function to send data recursively
    async function sendData(index, dataToSend, authToken) {
        if (index >= dataToSend.length) {
            alert('Semua perubahan berhasil disimpan');
            location.reload();  // Optionally reload the page to see updates
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
                console.error('Failed to save:', errorData);
                alert('Gagal menyimpan data: ' + errorData.message);
            } else {
                console.log('Data berhasil dikirim:', dataToSend[index]);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menyimpan perubahan');
        }

        // Rekursif ke data berikutnya
        sendData(index + 1, dataToSend, authToken);
    }

    // Event handler for saving changes
    document.getElementById('save-changes-btn').addEventListener('click', function() {
        const authToken = localStorage.getItem('authToken');

        const dataToSend = Object.keys(tempData).map(index => ({
            id: tempData[index].id,
            tempatPiket: tempData[index].tempat,
            status: tempData[index].status,
        }));

        sendData(0, dataToSend, authToken);  // Mulai dari data pertama
    });
});
