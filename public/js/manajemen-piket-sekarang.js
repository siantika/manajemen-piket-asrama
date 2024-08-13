document.addEventListener("DOMContentLoaded", function () {
  // Ambil semua tombol validasi
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
