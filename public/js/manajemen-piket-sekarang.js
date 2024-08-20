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

    // Event listener for the "Rekap" button
    document.getElementById('rekapBtn').addEventListener('click', function () {
        const authToken = localStorage.getItem('authToken');
        fetch('/v1/recap-task', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            alert('Rekap berhasil dilakukan');
            console.log(data); // Optional: log data for debugging
        })
        .catch(error => {
            alert('Gagal membuat rekap!');
            console.error('Error:', error); // Log error for debugging
        });
    });

    // Event handler for changing place
    document.querySelectorAll('.change-place-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const tempatText = document.getElementById('tempat-' + index);
            const tempatDropdown = document.getElementById('dropdown-' + index);
            const saveChangesBtn = document.getElementById('validasiAllBtn');

            if (tempatDropdown.classList.contains('d-none')) {
                // Show dropdown and hide text
                tempatText.classList.add('d-none');
                tempatDropdown.classList.remove('d-none');
                this.textContent = 'Simpan Tempat';

                tempatDropdown.addEventListener('change', () => {
                    const selectedTempat = tempatDropdown.value;
                    if (selectedTempat !== tempatText.textContent.trim()) {
                        this.classList.add('btn-danger'); // Mark as unsaved
                        hasUnsavedChanges = true; // Mark as having unsaved changes
                    } else {
                        this.classList.remove('btn-danger'); // Unmark if no changes
                    }
                });

            } else {
                const selectedTempat = tempatDropdown.value;
                tempatText.textContent = selectedTempat;
                tempatText.classList.remove('d-none');
                tempatDropdown.classList.add('d-none');
                this.textContent = 'Ubah Tempat';
                this.classList.remove('btn-danger'); // Reset color after save

                tempData[index] = {
                    tempat: selectedTempat,
                    id: button.dataset.id,
                    status: document.getElementById('status-' + index).textContent.trim()
                };

                alert(`Tempat berhasil diubah!`);
                hasUnsavedChanges = true; // Mark as having unsaved changes
            }
        });
    });

    // Event handler for validation buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const statusCell = document.getElementById('status-' + index);
            const currentStatus = statusCell.textContent.trim();
            const saveChangesBtn = document.getElementById('validasiAllBtn');

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

            tempData[index] = {
                id: button.dataset.id,
                tempat: document.getElementById('tempat-' + index).textContent.trim(),
                status: statusCell.textContent.trim(),
            };

            saveChangesBtn.classList.add('btn-danger');
            hasUnsavedChanges = true; // Mark as having unsaved changes
        });
    });

    // Function to send data recursively
    async function sendData(index, dataToSend, authToken) {
        if (index >= dataToSend.length) {
            alert('Validasi berhasil');
            hasUnsavedChanges = false; // All changes saved
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
                console.error('Error:', errorData); // Log error for debugging
            }
        } catch (error) {
            alert('Terjadi kesalahan saat menyimpan perubahan');
            console.error('Error:', error); // Log error for debugging
        }

        sendData(index + 1, dataToSend, authToken);
    }

    // Event handler for saving changes
    document.getElementById('validasiAllBtn').addEventListener('click', function () {
        const authToken = localStorage.getItem('authToken');
        const saveChangesBtn = document.getElementById('validasiAllBtn');

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

            e.preventDefault(); // Standard way to prevent navigation
            e.returnValue = ''; // Standard for most browsers
            return confirmationMessage; // Some browsers may require this return value
        }
    });

    // Initialize date picker and schedule creation
    initializeDatePickerAndSchedule('/v1/generate-schedule-task', localStorage.getItem('authToken'));
});

// Function to initialize the date picker and handle schedule creation
function initializeDatePickerAndSchedule(apiEndpoint, authToken) {
    const buatJdwlBtn = document.getElementById('buatJadwalBtn');
    const datePickerContainer = document.getElementById('datePickerContainer');
    const submitDateBtn = document.getElementById('submitDateBtn');
    const scheduleDateInput = document.getElementById('scheduleDate');

    // Event listener for Buat Jadwal button
    buatJdwlBtn.addEventListener('click', function () {
        datePickerContainer.classList.remove('d-none'); // Show the date picker
    });

    // Event listener for Submit Tanggal button
    submitDateBtn.addEventListener('click', function () {
        const selectedDate = scheduleDateInput.value;
        if (selectedDate) {
            // Hide the date picker after the date is selected
            datePickerContainer.classList.add('d-none');

            // Execute the API with the selected date
            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tanggal: selectedDate
                })
            })
            .then(response => response.json())
            .then(data => {
                alert('Jadwal berhasil dibuat');
                console.log(data); // Optional: log data for debugging
            })
            .catch(error => {
                alert('Gagal membuat jadwal!');
                console.error('Error:', error); // Log error for debugging
            });
        } else {
            alert('Silakan pilih tanggal terlebih dahulu.');
        }
    });
}
