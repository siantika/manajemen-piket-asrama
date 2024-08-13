document.addEventListener("DOMContentLoaded", function () {
        // Ambil semua tombol Ubah Tempat
        const changePlaceButtons = document.querySelectorAll('.change-place-btn');

        changePlaceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const tempatText = document.getElementById('tempat-' + index);
                const tempatDropdown = document.getElementById('dropdown-' + index);

                if (tempatDropdown.classList.contains('d-none')) {
                    // Menampilkan dropdown dan menyembunyikan teks
                    tempatText.classList.add('d-none');
                    tempatDropdown.classList.remove('d-none');
                    this.textContent = 'Simpan Tempat';
                } else {
                    // Mengubah tempat dan menyembunyikan dropdown
                    const selectedTempat = tempatDropdown.value;
                    tempatText.textContent = selectedTempat;
                    tempatText.classList.remove('d-none');
                    tempatDropdown.classList.add('d-none');
                    this.textContent = 'Ubah Tempat';

                    // Optional: Kirim perubahan tempat ke server dengan AJAX atau form submission
                }
            });
        });

        // Tombol Validasi
        const validateButtons = document.querySelectorAll('.edit-btn');

        validateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const statusCell = document.getElementById('status-' + index);
                const currentStatus = statusCell.textContent.trim();

                if (currentStatus === 'Sudah') {
                    // Batalkan validasi
                    statusCell.textContent = 'Belum';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-warning');
                    this.innerHTML = '<i class="bi bi-pencil"></i> Validasi';
                } else {
                    // Validasi
                    statusCell.textContent = 'Sudah';
                    this.classList.remove('btn-warning');
                    this.classList.add('btn-success');
                    this.innerHTML = '<i class="bi bi-x"></i> Batalkan Validasi';
                }
            });
        });
    });
