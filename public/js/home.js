document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body');
  const paginationControls = document.getElementById('pagination-controls');
  const filterNama = document.getElementById('filter-nama');
  const filterTempat = document.getElementById('filter-tempat');
  const filterStatus = document.getElementById('filter-status');
  const filterBtn = document.getElementById('filter-btn');

  let currentPage = 1;
  const itemsPerPage = 10;
  let piketHistoris = [];

  function renderTable(data) {
      tableBody.innerHTML = data.length
          ? data.map(item => `
              <tr>
                  <td>${item.tanggalPiket}</td>
                  <td>${item.nama}</td>
                  <td>${item.tempat}</td>
                  <td>${item.statusPiket}</td>
              </tr>
          `).join('')
          : `<tr><td colspan="4" class="text-center">Tidak ada data piket </td></tr>`;
  }

  function setupPagination(data) {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      let paginationHTML = '';

      if (currentPage > 1) {
          paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage - 1}">&laquo; Prev</a></li>`;
      }

      for (let i = 1; i <= totalPages; i++) {
          paginationHTML += `
              <li class="page-item ${i === currentPage ? 'active' : ''}">
                  <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
          `;
      }

      if (currentPage < totalPages) {
          paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${currentPage + 1}">Next &raquo;</a></li>`;
      }

      paginationControls.innerHTML = paginationHTML;

      paginationControls.querySelectorAll('.page-link').forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const page = parseInt(e.target.dataset.page, 10);
              if (page && page !== currentPage) {
                  currentPage = page;
                  updateTable();
              }
          });
      });
  }

  function updateTable() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const filteredData = applyFilters(piketHistoris);
      const paginatedData = filteredData.slice(start, end);
      renderTable(paginatedData);
      setupPagination(filteredData);
  }

  function applyFilters(data) {
      const namaFilter = filterNama.value.toLowerCase();
      const tempatFilter = filterTempat.value.toLowerCase();
      const statusFilter = filterStatus.value.toLowerCase();

      return data.filter(item =>
          (!namaFilter || item.nama.toLowerCase().includes(namaFilter)) &&
          (!tempatFilter || item.tempat.toLowerCase().includes(tempatFilter)) &&
          (!statusFilter || item.statusPiket.toLowerCase().includes(statusFilter))
      );
  }

  function populateFilters(data) {
      const uniqueNames = [...new Set(data.map(item => item.nama))];
      const uniqueTempat = [...new Set(data.map(item => item.tempat))];
      const uniqueStatuses = [...new Set(data.map(item => item.statusPiket))];

      filterNama.innerHTML = `<option value="">-- Filter Nama --</option>` +
          uniqueNames.map(name => `<option value="${name}">${name}</option>`).join('');

      filterTempat.innerHTML = `<option value="">-- Filter Tempat --</option>` +
          uniqueTempat.map(tempat => `<option value="${tempat}">${tempat}</option>`).join('');

      filterStatus.innerHTML = `<option value="">-- Filter Status --</option>` +
          uniqueStatuses.map(status => `<option value="${status}">${status}</option>`).join('');
  }

  // Fetch initial data and set up the page
  async function fetchData() {
      try {
          const response = await fetch('/v1/piket-sekarang');
          const result = await response.json();
          console.log(response);
          piketHistoris = result.data;
          populateFilters(piketHistoris);
          updateTable();
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  // Set up event listener for filter button
  filterBtn.addEventListener('click', () => {
      currentPage = 1;  // Reset to first page on new filter
      updateTable();
  });

  // Fetch data on page load
  fetchData();
});
