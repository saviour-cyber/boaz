// Sample data storage (in a real app, this would be API calls to a backend)
const sampleAnimals = [
    { id: 'A001', name: 'Betsy', breed: 'Friesian', age: 4, status: 'active', lastBred: '2023-05-15', dueDate: '2024-02-20' },
    { id: 'A002', name: 'Daisy', breed: 'Ayrshire', age: 3, status: 'active', lastBred: '2023-06-10', dueDate: '2024-03-15' },
    { id: 'A003', name: 'Molly', breed: 'Jersey', age: 5, status: 'dry', lastBred: '2023-04-20', dueDate: null },
    { id: 'A004', name: 'Buttercup', breed: 'Friesian', age: 2, status: 'active', lastBred: null, dueDate: null }
];

const sampleMilkRecords = [
    { id: 'M001', date: '2023-10-01', animalId: 'A001', animalName: 'Betsy', morning: 12.5, evening: 10.2, quality: 'excellent', notes: '' },
    { id: 'M002', date: '2023-10-01', animalId: 'A002', animalName: 'Daisy', morning: 10.8, evening: 9.5, quality: 'good', notes: '' },
    { id: 'M003', date: '2023-10-02', animalId: 'A001', animalName: 'Betsy', morning: 12.0, evening: 10.0, quality: 'excellent', notes: '' },
    { id: 'M004', date: '2023-10-02', animalId: 'A002', animalName: 'Daisy', morning: 10.5, evening: 9.0, quality: 'good', notes: '' },
    { id: 'M005', date: '2023-10-03', animalId: 'A001', animalName: 'Betsy', morning: 11.8, evening: 9.8, quality: 'excellent', notes: '' }
];

const sampleInventory = [
    { id: 'F001', name: 'Dairy Meal', category: 'feed', quantity: 150, unit: 'kg', lastRestock: '2023-09-20' },
    { id: 'F002', name: 'Maize Silage', category: 'feed', quantity: 500, unit: 'kg', lastRestock: '2023-09-25' },
    { id: 'M001', name: 'Oxytetracycline', category: 'medicine', quantity: 5, unit: 'bottles', lastRestock: '2023-09-15' }
];

// Get all animals
function getAnimals() {
    return sampleAnimals;
}

// Get animal by ID
function getAnimalById(id) {
    return sampleAnimals.find(animal => animal.id === id);
}

// Get all milk records
function getMilkRecords(filter = {}) {
    let records = [...sampleMilkRecords];
    
    if (filter.date) {
        records = records.filter(record => record.date === filter.date);
    }
    
    if (filter.animalId && filter.animalId !== 'all') {
        records = records.filter(record => record.animalId === filter.animalId);
    }
    
    return records;
}

// Get milk record by ID
function getMilkRecordById(id) {
    return sampleMilkRecords.find(record => record.id === id);
}

// Add new milk record
function addMilkRecord(record) {
    const newRecord = {
        id: 'M' + (sampleMilkRecords.length + 1).toString().padStart(3, '0'),
        ...record
    };
    sampleMilkRecords.push(newRecord);
    return newRecord;
}

// Update milk record
function updateMilkRecord(id, updatedRecord) {
    const index = sampleMilkRecords.findIndex(record => record.id === id);
    if (index !== -1) {
        sampleMilkRecords[index] = { ...sampleMilkRecords[index], ...updatedRecord };
        return sampleMilkRecords[index];
    }
    return null;
}

// Delete milk record
function deleteMilkRecord(id) {
    const index = sampleMilkRecords.findIndex(record => record.id === id);
    if (index !== -1) {
        return sampleMilkRecords.splice(index, 1)[0];
    }
    return null;
}

// Get inventory items
function getInventory() {
    return sampleInventory;
}

// Get financial data for charts
function getFinancialData() {
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        revenue: [85000, 82000, 88000, 90000, 92000, 95000, 98000, 100000, 105000, 108000],
        expenses: [60000, 62000, 65000, 63000, 64000, 66000, 68000, 70000, 72000, 75000]
    };
}

// Get milk production data for charts
function getMilkProductionData() {
    return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        amounts: [85, 88, 90, 92, 91, 87, 89]
    };
}

// Get recent activities
function getRecentActivities() {
    return [
        { type: 'milk', description: 'Recorded milk production for Betsy', time: '2 hours ago' },
        { type: 'health', description: 'Administered treatment to Daisy', time: '5 hours ago' },
        { type: 'feed', description: 'Restocked dairy meal', time: '1 day ago' },
        { type: 'milk', description: 'Recorded milk production for all animals', time: '1 day ago' }
    ];
}