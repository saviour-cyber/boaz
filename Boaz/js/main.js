document.addEventListener('DOMContentLoaded', function() {
    // Load user data if on dashboard
    if (document.querySelector('.dashboard-container')) {
        loadDashboardData();
    }
    
    // Milk recording page functionality
    if (document.getElementById('milkRecordsTable')) {
        setupMilkRecordingPage();
    }
    
    // Modal functionality
    setupModals();
});

function loadDashboardData() {
    // Load user info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const userNameElement = document.getElementById('userName');
        const farmNameElement = document.getElementById('farmName');
        
        if (userNameElement) userNameElement.textContent = user.fullName || 'Farmer Name';
        if (farmNameElement) farmNameElement.textContent = user.farmName || 'Farm Name';
    }
    
    // Load dashboard widgets data
    const milkRecords = getMilkRecords();
    const today = new Date().toISOString().split('T')[0];
    const todayMilk = milkRecords
        .filter(record => record.date === today)
        .reduce((sum, record) => sum + (record.morning || 0) + (record.evening || 0), 0);
    
    document.getElementById('todayMilk').textContent = todayMilk.toFixed(1);
    document.getElementById('totalAnimals').textContent = getAnimals().length;
    document.getElementById('feedStock').textContent = getInventory()
        .filter(item => item.category === 'feed')
        .reduce((sum, item) => sum + item.quantity, 0);
    
    // Financial data - in a real app this would be calculated properly
    document.getElementById('monthlyRevenue').textContent = '108,000';
    
    // Load charts
    renderCharts();
    
    // Load recent activities
    loadRecentActivities();
}

function renderCharts() {
    // Milk production chart
    const milkCtx = document.getElementById('milkChart').getContext('2d');
    const milkData = getMilkProductionData();
    
    new Chart(milkCtx, {
        type: 'line',
        data: {
            labels: milkData.labels,
            datasets: [{
                label: 'Milk Production (L)',
                data: milkData.amounts,
                backgroundColor: 'rgba(44, 123, 229, 0.2)',
                borderColor: 'rgba(44, 123, 229, 1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // Financial chart
    const financeCtx = document.getElementById('financeChart').getContext('2d');
    const financeData = getFinancialData();
    
    new Chart(financeCtx, {
        type: 'bar',
        data: {
            labels: financeData.labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: financeData.revenue,
                    backgroundColor: 'rgba(0, 217, 126, 0.7)',
                    borderColor: 'rgba(0, 217, 126, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: financeData.expenses,
                    backgroundColor: 'rgba(230, 55, 87, 0.7)',
                    borderColor: 'rgba(230, 55, 87, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

function loadRecentActivities() {
    const activities = getRecentActivities();
    const activityList = document.getElementById('activityList');
    
    if (activityList) {
        activityList.innerHTML = '';
        
        activities.forEach(activity => {
            const li = document.createElement('li');
            
            let iconClass = 'icon-milk';
            if (activity.type === 'health') iconClass = 'icon-health';
            if (activity.type === 'feed') iconClass = 'icon-feed';
            
            li.innerHTML = `
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <small class="activity-time">${activity.time}</small>
                </div>
            `;
            
            activityList.appendChild(li);
        });
    }
}

function setupMilkRecordingPage() {
    // Load animals for dropdown
    const animals = getAnimals();
    const animalSelects = document.querySelectorAll('select[id$="Animal"]');
    
    animalSelects.forEach(select => {
        select.innerHTML = '<option value="all">All Animals</option>' + 
            animals.map(animal => 
                `<option value="${animal.id}">${animal.name} (${animal.id})</option>`
            ).join('');
    });
    
    // Load milk records table
    loadMilkRecordsTable();
    
    // Setup filter functionality
    document.getElementById('applyFilter').addEventListener('click', loadMilkRecordsTable);
    document.getElementById('resetFilter').addEventListener('click', function() {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterAnimal').value = 'all';
        loadMilkRecordsTable();
    });
    
    // Setup modal functionality
    document.getElementById('addMilkRecord').addEventListener('click', function() {
        openMilkRecordModal();
    });
}

function loadMilkRecordsTable() {
    const filterDate = document.getElementById('filterDate').value;
    const filterAnimal = document.getElementById('filterAnimal').value;
    
    const records = getMilkRecords({
        date: filterDate,
        animalId: filterAnimal
    });
    
    const tableBody = document.querySelector('#milkRecordsTable tbody');
    tableBody.innerHTML = '';
    
    records.forEach(record => {
        const total = (record.morning || 0) + (record.evening || 0);
        const qualityClass = `quality-${record.quality}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(record.date)}</td>
            <td>${record.animalId}</td>
            <td>${record.animalName}</td>
            <td>${record.morning ? record.morning.toFixed(1) : '-'}</td>
            <td>${record.evening ? record.evening.toFixed(1) : '-'}</td>
            <td>${total.toFixed(1)}</td>
            <td><span class="${qualityClass}">${record.quality}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${record.id}">Edit</button>
                <button class="delete-btn" data-id="${record.id}">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            openMilkRecordModal(recordId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this milk record?')) {
                deleteMilkRecord(recordId);
                loadMilkRecordsTable();
            }
        });
    });
}

function openMilkRecordModal(recordId = null) {
    const modal = document.getElementById('milkRecordModal');
    const form = document.getElementById('milkRecordForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (recordId) {
        // Edit existing record
        modalTitle.textContent = 'Edit Milk Record';
        const record = getMilkRecordById(recordId);
        
        if (record) {
            document.getElementById('recordId').value = record.id;
            document.getElementById('recordDate').value = record.date;
            document.getElementById('recordAnimal').value = record.animalId;
            document.getElementById('morningYield').value = record.morning || '';
            document.getElementById('eveningYield').value = record.evening || '';
            document.getElementById('milkQuality').value = record.quality;
            document.getElementById('milkNotes').value = record.notes || '';
        }
    } else {
        // Add new record
        modalTitle.textContent = 'Add Milk Record';
        form.reset();
        document.getElementById('recordId').value = '';
        document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

function setupModals() {
    // Close modal when clicking X or outside
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('close-modal') || e.target.classList.contains('cancel-modal')) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Milk record form submission
    const milkRecordForm = document.getElementById('milkRecordForm');
    if (milkRecordForm) {
        milkRecordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const recordId = document.getElementById('recordId').value;
            const recordData = {
                date: document.getElementById('recordDate').value,
                animalId: document.getElementById('recordAnimal').value,
                animalName: getAnimalById(document.getElementById('recordAnimal').value).name,
                morning: parseFloat(document.getElementById('morningYield').value) || 0,
                evening: parseFloat(document.getElementById('eveningYield').value) || 0,
                quality: document.getElementById('milkQuality').value,
                notes: document.getElementById('milkNotes').value
            };
            
            if (recordId) {
                // Update existing record
                updateMilkRecord(recordId, recordData);
            } else {
                // Add new record
                addMilkRecord(recordData);
            }
            
            document.getElementById('milkRecordModal').style.display = 'none';
            loadMilkRecordsTable();
            
            // Update dashboard if on dashboard
            if (document.querySelector('.dashboard-container')) {
                loadDashboardData();
            }
        });
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}