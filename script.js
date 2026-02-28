// Complete Herbal Traceability System - Enhanced Version
// Using ALL Smart Contract Functions for SIH PS 25027

// Your deployed contract details
const CONTRACT_ADDRESS = "0xb01e92b6c7897fc8511e2e1aaac8f34987a19f89";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "BatchRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            }
        ],
        "name": "FarmerVerified",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "stepDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ProcessingStepAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "processorName",
                "type": "string"
            }
        ],
        "name": "ProcessorVerified",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_processorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_stepDescription",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            }
        ],
        "name": "addProcessingStep",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "addVerifiedFarmer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_processor",
                "type": "address"
            }
        ],
        "name": "addVerifiedProcessor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allBatchIds",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "batches",
        "outputs": [
            {
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "collectionTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "qualityGrade",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "additionalNotes",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "farmerBatches",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllBatchIds",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getBatchDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "collectionTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "qualityGrade",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "additionalNotes",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getBatchLocation",
        "outputs": [
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "getFarmerBatches",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getProcessingHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "processor",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "processorName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "stepDescription",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "location",
                        "type": "string"
                    }
                ],
                "internalType": "struct HerbalTraceability.ProcessingStep[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalBatches",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "isVerifiedFarmer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_processor",
                "type": "address"
            }
        ],
        "name": "isVerifiedProcessor",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "processingHistory",
        "outputs": [
            {
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "processorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "stepDescription",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "_latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "_longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_qualityGrade",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_additionalNotes",
                "type": "string"
            }
        ],
        "name": "registerBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedFarmers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedProcessors",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "verifyBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Global variables
let provider, signer, contract;
let currentAccount = null;
let userRole = 'farmer';
let isOwner = false;
let currentLatitude = 0;
let currentLongitude = 0;
let qrScanner = null;

// Initialize application
window.onload = async () => {
    showMessage('🌿 Initializing Herbal Traceability System...', 'info');
    
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            currentAccount = await signer.getAddress();
            const network = await provider.getNetwork();
            
            // Check if user is contract owner
            const owner = await contract.owner();
            isOwner = currentAccount.toLowerCase() === owner.toLowerCase();
            
            // Determine user role
            await determineUserRole();
            
            console.log("✅ Connected to:", currentAccount);
            console.log("🌐 Network:", network.name);
            console.log("👑 Is Owner:", isOwner);
            console.log("🎭 User Role:", userRole);
            
            showMessage(`✅ Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`, 'success');
            
            // Load initial data
            await loadDashboardData();
            
        } catch (error) {
            console.error("Connection error:", error);
            showMessage('❌ Please connect your MetaMask wallet', 'error');
        }
    } else {
        showMessage('❌ Please install MetaMask!', 'error');
    }
};

// Determine user role based on contract state
async function determineUserRole() {
    try {
        const owner = await contract.owner();
        if (currentAccount.toLowerCase() === owner.toLowerCase()) {
            userRole = 'admin';
            document.getElementById('current-role').textContent = 'Contract Owner';
            return;
        }
        
        const isFarmer = await contract.isVerifiedFarmer(currentAccount);
        const isProcessor = await contract.isVerifiedProcessor(currentAccount);
        
        if (isFarmer && isProcessor) {
            userRole = 'admin'; // Can act as both
            document.getElementById('current-role').textContent = 'Farmer + Processor';
        } else if (isFarmer) {
            userRole = 'farmer';
            document.getElementById('current-role').textContent = 'Verified Farmer';
        } else if (isProcessor) {
            userRole = 'processor';
            document.getElementById('current-role').textContent = 'Verified Processor';
        } else {
            userRole = 'consumer';
            document.getElementById('current-role').textContent = 'Consumer';
        }
        
    } catch (error) {
        console.error("Error determining role:", error);
        userRole = 'consumer';
        document.getElementById('current-role').textContent = 'Consumer';
    }
}

// Dashboard management
function showDashboard(role) {
    // Hide all dashboards
    document.querySelectorAll('.dashboard').forEach(d => d.style.display = 'none');
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    // Show selected dashboard
    document.getElementById(`${role}-dashboard`).style.display = 'block';
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
    
    // Load specific dashboard data
    switch(role) {
        case 'farmer':
            loadFarmerBatches();
            break;
        case 'processor':
            // Processor dashboard is loaded on demand
            break;
        case 'admin':
            loadAdminDashboard();
            break;
        case 'consumer':
            // Consumer dashboard doesn't need initial data
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    if (userRole === 'admin' || isOwner) {
        await loadAdminDashboard();
    } else if (userRole === 'farmer') {
        await loadFarmerBatches();
    }
}

// ====================
// FARMER FUNCTIONS
// ====================

// Register new batch (Function 1/13)
async function registerBatch(event) {
    event.preventDefault();
    
    const batchId = document.getElementById('batchId').value.trim();
    const herbName = document.getElementById('herbName').value.trim();
    const farmerName = document.getElementById('farmerName').value.trim();
    const herbType = document.getElementById('herbType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const qualityGrade = document.getElementById('qualityGrade').value;
    const additionalNotes = document.getElementById('additionalNotes').value.trim();
    
    if (!batchId || !herbName) {
        showMessage('❌ Please fill all required fields', 'error');
        return;
    }
    
    if (currentLatitude === 0 || currentLongitude === 0) {
        showMessage('📍 Please capture GPS location first', 'warning');
        return;
    }
    
    try {
        showLoadingModal(true);
        showMessage('🔄 Registering batch on blockchain...', 'info');
        
        const tx = await contract.registerBatch(
            batchId,
            farmerName,
            herbName,
            herbType,
            currentLatitude,
            currentLongitude,
            quantity,
            qualityGrade,
            additionalNotes
        );
        
        showMessage('⏳ Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();
        
        showLoadingModal(false);
        showMessage('✅ Batch registered successfully!', 'success');
        
        // Generate QR code
        generateQRCode(batchId);
        
        // Refresh farmer batches
        await loadFarmerBatches();
        
        // Reset form
        document.querySelector('form').reset();
        
    } catch (error) {
        showLoadingModal(false);
        console.error("Registration error:", error);
        
        if (error.message.includes('Only verified farmers')) {
            showMessage('❌ You are not a verified farmer. Contact admin for verification.', 'error');
        } else {
            showMessage(`❌ Registration failed: ${error.message}`, 'error');
        }
    }
}

// Load farmer's batches (Function 14/13 - Using getFarmerBatches)
async function loadFarmerBatches() {
    try {
        const batchIds = await contract.getFarmerBatches(currentAccount);
        const container = document.getElementById('farmer-batches-list');
        
        if (batchIds.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-box-open fa-3x mb-3"></i>
                    <p>No batches registered yet</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        for (let batchId of batchIds) {
            try {
                const batch = await contract.getBatchDetails(batchId);
                const statusClass = batch.isVerified ? 'status-verified' : 'status-pending';
                const statusText = batch.isVerified ? 'Verified' : 'Pending';
                
                html += `
                    <div class="batch-card card mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="card-title mb-1">${batch.herbName}</h6>
                                    <p class="card-text mb-1">
                                        <small class="text-muted">
                                            Batch: <code>${batchId}</code><br>
                                            Quantity: ${batch.quantity.toString()} grams<br>
                                            Grade: ${batch.qualityGrade}
                                        </small>
                                    </p>
                                </div>
                                <span class="status-badge ${statusClass}">${statusText}</span>
                            </div>
                            <div class="mt-2">
                                <button onclick="generateQRCode('${batchId}')" class="btn btn-sm btn-success">
                                    <i class="fas fa-qrcode"></i> QR
                                </button>
                                <button onclick="viewBatchDetails('${batchId}')" class="btn btn-sm btn-info">
                                    <i class="fas fa-eye"></i> View
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading batch ${batchId}:`, error);
            }
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading farmer batches:", error);
        showMessage('❌ Error loading your batches', 'error');
    }
}

// ====================
// PROCESSOR FUNCTIONS
// ====================

// Add processing step (Function 5/13)
async function addProcessingStep(event) {
    event.preventDefault();
    
    const batchId = document.getElementById('processBatchId').value.trim();
    const processorName = document.getElementById('processorName').value.trim();
    const stepDescription = document.getElementById('stepDescription').value.trim();
    const location = document.getElementById('processingLocation').value.trim();
    
    if (!batchId || !stepDescription) {
        showMessage('❌ Please fill all required fields', 'error');
        return;
    }
    
    try {
        showLoadingModal(true);
        showMessage('🔄 Adding processing step...', 'info');
        
        const tx = await contract.addProcessingStep(
            batchId,
            processorName,
            stepDescription,
            location
        );
        
        showMessage('⏳ Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();
        
        showLoadingModal(false);
        showMessage('✅ Processing step added successfully!', 'success');
        
        // Reset form
        document.querySelector('#processor-dashboard form').reset();
        
        // Refresh processing history if viewing the same batch
        const historyBatchId = document.getElementById('historyBatchId').value;
        if (historyBatchId === batchId) {
            await viewProcessingHistory();
        }
        
    } catch (error) {
        showLoadingModal(false);
        console.error("Error adding processing step:", error);
        
        if (error.message.includes('Only verified processors')) {
            showMessage('❌ You are not a verified processor. Contact admin for verification.', 'error');
        } else if (error.message.includes('Batch does not exist')) {
            showMessage('❌ Batch ID not found. Please check the batch ID.', 'error');
        } else {
            showMessage(`❌ Error adding processing step: ${error.message}`, 'error');
        }
    }
}

// View processing history (Function 15/13 - Using getProcessingHistory)
async function viewProcessingHistory() {
    const batchId = document.getElementById('historyBatchId').value.trim();
    
    if (!batchId) {
        showMessage('❌ Please enter a batch ID', 'error');
        return;
    }
    
    try {
        const history = await contract.getProcessingHistory(batchId);
        const container = document.getElementById('processing-history');
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-history fa-3x mb-3"></i>
                    <p>No processing steps found for this batch</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="timeline">';
        
        for (let i = 0; i < history.length; i++) {
            const step = history[i];
            const date = new Date(step.timestamp.toNumber() * 1000);
            
            html += `
                <div class="timeline-item">
                    <div class="processing-step">
                        <h6>${step.stepDescription}</h6>
                        <p class="mb-1">
                            <strong>Processor:</strong> ${step.processorName}<br>
                            <strong>Location:</strong> ${step.location || 'Not specified'}<br>
                            <strong>Date:</strong> ${date.toLocaleString()}
                        </p>
                        <small class="text-muted">
                            Address: ${step.processor.substring(0, 6)}...${step.processor.substring(38)}
                        </small>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Error viewing processing history:", error);
        
        if (error.message.includes('Batch does not exist')) {
            showMessage('❌ Batch ID not found', 'error');
            document.getElementById('processing-history').innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Batch ID "${batchId}" not found. Please check the batch ID.
                </div>
            `;
        } else {
            showMessage('❌ Error loading processing history', 'error');
        }
    }
}

// ====================
// ADMIN FUNCTIONS
// ====================

// Load admin dashboard (Functions 16/13, 17/13, etc.)
async function loadAdminDashboard() {
    try {
        // Get total batches
        const totalBatches = await contract.getTotalBatches();
        document.getElementById('total-batches').textContent = totalBatches.toString();
        
        // Note: We can't directly count verified farmers/processors from the contract
        // In a full implementation, you'd maintain counters or use events
        document.getElementById('total-farmers').textContent = '5+'; // Placeholder
        document.getElementById('total-processors').textContent = '3+'; // Placeholder
        document.getElementById('verified-batches').textContent = '8+'; // Placeholder
        
        // Load all batches
        await loadAllBatches();
        
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        showMessage('❌ Error loading admin dashboard', 'error');
    }
}

// Load all batches (Function 11/13)
async function loadAllBatches() {
    try {
        const allBatchIds = await contract.getAllBatchIds();
        const container = document.getElementById('all-batches-list');
        
        if (allBatchIds.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-database fa-3x mb-3"></i>
                    <p>No batches found</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        for (let batchId of allBatchIds) {
            try {
                const batch = await contract.getBatchDetails(batchId);
                const statusClass = batch.isVerified ? 'status-verified' : 'status-pending';
                const statusText = batch.isVerified ? 'Verified' : 'Pending';
                
                html += `
                    <div class="card mb-2">
                        <div class="card-body p-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-0">${batch.herbName}</h6>
                                    <small class="text-muted">
                                        ${batchId} | ${batch.farmerName}
                                    </small>
                                </div>
                                <div>
                                    <span class="status-badge ${statusClass} me-2">${statusText}</span>
                                    ${!batch.isVerified ? `<button onclick="adminVerifyBatchDirect('${batchId}')" class="btn btn-sm btn-success">Verify</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Error loading batch ${batchId}:`, error);
            }
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading all batches:", error);
        showMessage('❌ Error loading batches', 'error');
    }
}

// Add verified farmer (Function 6/13)
async function addVerifiedFarmer() {
    const address = document.getElementById('farmerAddress').value.trim();
    
    if (!address || !ethers.utils.isAddress(address)) {
        showMessage('❌ Please enter a valid Ethereum address', 'error');
        return;
    }
    
    try {
        showLoadingModal(true);
        showMessage('🔄 Adding verified farmer...', 'info');
        
        const tx = await contract.addVerifiedFarmer(address);
        
        showMessage('⏳ Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();
        
        showLoadingModal(false);
        showMessage(`✅ Farmer ${address} verified successfully!`, 'success');
        
        // Clear input
        document.getElementById('farmerAddress').value = '';
        
    } catch (error) {
        showLoadingModal(false);
        console.error("Error adding verified farmer:", error);
        
        if (error.message.includes('Only owner')) {
            showMessage('❌ Only contract owner can verify farmers', 'error');
        } else {
            showMessage(`❌ Error verifying farmer: ${error.message}`, 'error');
        }
    }
}

// Add verified processor (Function 7/13)
async function addVerifiedProcessor() {
    const address = document.getElementById('processorAddress').value.trim();
    
    if (!address || !ethers.utils.isAddress(address)) {
        showMessage('❌ Please enter a valid Ethereum address', 'error');
        return;
    }
    
    try {
        showLoadingModal(true);
        showMessage('🔄 Adding verified processor...', 'info');
        
        const tx = await contract.addVerifiedProcessor(address);
        
        showMessage('⏳ Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();
        
        showLoadingModal(false);
        showMessage(`✅ Processor ${address} verified successfully!`, 'success');
        
        // Clear input
        document.getElementById('processorAddress').value = '';
        
    } catch (error) {
        showLoadingModal(false);
        console.error("Error adding verified processor:", error);
        
        if (error.message.includes('Only owner')) {
            showMessage('❌ Only contract owner can verify processors', 'error');
        } else {
            showMessage(`❌ Error verifying processor: ${error.message}`, 'error');
        }
    }
}

// Verify batch (Function 22/13)
async function adminVerifyBatch() {
    const batchId = document.getElementById('adminVerifyBatchId').value.trim();
    
    if (!batchId) {
        showMessage('❌ Please enter a batch ID', 'error');
        return;
    }
    
    await adminVerifyBatchDirect(batchId);
    
    // Clear input
    document.getElementById('adminVerifyBatchId').value = '';
}

async function adminVerifyBatchDirect(batchId) {
    try {
        showLoadingModal(true);
        showMessage('🔄 Verifying batch...', 'info');
        
        const tx = await contract.verifyBatch(batchId);
        
        showMessage('⏳ Transaction submitted. Waiting for confirmation...', 'info');
        await tx.wait();
        
        showLoadingModal(false);
        showMessage(`✅ Batch ${batchId} verified successfully!`, 'success');
        
        // Refresh all batches display
        await loadAllBatches();
        
    } catch (error) {
        showLoadingModal(false);
        console.error("Error verifying batch:", error);
        
        if (error.message.includes('Only owner')) {
            showMessage('❌ Only contract owner can verify batches', 'error');
        } else if (error.message.includes('Batch does not exist')) {
            showMessage('❌ Batch ID not found', 'error');
        } else {
            showMessage(`❌ Error verifying batch: ${error.message}`, 'error');
        }
    }
}

// ====================
// CONSUMER FUNCTIONS
// ====================

// Verify batch for consumers (Function 12/13)
async function verifyBatch() {
    const batchId = document.getElementById('verifyBatchId').value.trim();
    
    if (!batchId) {
        showMessage('❌ Please enter a batch ID to verify', 'error');
        return;
    }
    
    try {
        showMessage('🔍 Verifying batch authenticity...', 'info');
        
        const batch = await contract.getBatchDetails(batchId);
        const location = await contract.getBatchLocation(batchId);
        const processingHistory = await contract.getProcessingHistory(batchId);
        
        displayVerificationResult(batch, location, processingHistory);
        showMessage('✅ Batch verification completed!', 'success');
        
    } catch (error) {
        console.error("Verification error:", error);
        
        const container = document.getElementById('verification-result');
        if (error.message.includes('Batch does not exist')) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Batch Not Found</strong><br>
                    Batch ID "${batchId}" could not be found in the blockchain.
                    <br><br>
                    <button onclick="verifyBatch()" class="btn btn-primary">
                        <i class="fas fa-redo me-1"></i> Try Again
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times me-2"></i>
                    <strong>Verification Failed</strong><br>
                    ${error.message}
                </div>
            `;
        }
        
        showMessage('❌ Batch verification failed', 'error');
    }
}

// Display verification results
function displayVerificationResult(batch, location, processingHistory) {
    const container = document.getElementById('verification-result');
    
    // Convert coordinates
    const lat = (location.latitude.toNumber() / 1e6).toFixed(6);
    const lng = (location.longitude.toNumber() / 1e6).toFixed(6);
    
    // Format timestamp
    const collectionDate = new Date(batch.collectionTimestamp.toNumber() * 1000);
    
    let html = `
        <div class="card border-success">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">✅ Batch Verified Successfully</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6 class="text-success mb-3">📋 Batch Information</h6>
                        <p><strong>Batch ID:</strong> <code>${batch.batchId}</code></p>
                        <p><strong>Herb Name:</strong> ${batch.herbName}</p>
                        <p><strong>Herb Type:</strong> ${batch.herbType}</p>
                        <p><strong>Farmer:</strong> ${batch.farmerName}</p>
                        <p><strong>Quantity:</strong> ${batch.quantity.toString()} grams</p>
                        <p><strong>Quality Grade:</strong> 
                            <span class="badge bg-primary">${batch.qualityGrade}</span>
                        </p>
                    </div>
                    
                    <div class="col-md-6">
                        <h6 class="text-success mb-3">📍 Location & Status</h6>
                        <p><strong>Collection Location:</strong><br>
                            <span class="font-monospace">${lat}, ${lng}</span><br>
                            <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" 
                               class="btn btn-sm btn-outline-primary mt-1">
                                <i class="fas fa-map"></i> View on Map
                            </a>
                        </p>
                        <p><strong>Collection Date:</strong><br>
                            ${collectionDate.toLocaleString()}
                        </p>
                        <p><strong>Verification Status:</strong><br>
                            <span class="badge ${batch.isVerified ? 'bg-success' : 'bg-warning'}">
                                ${batch.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                            </span>
                        </p>
                        <p><strong>Farmer Address:</strong><br>
                            <code class="small">${batch.farmer}</code>
                        </p>
                    </div>
                </div>
                
                ${batch.additionalNotes ? `
                <div class="mt-3 p-3 bg-light rounded">
                    <strong>📝 Additional Notes:</strong><br>
                    <em>${batch.additionalNotes}</em>
                </div>
                ` : ''}
    `;
    
    // Add processing history if available
    if (processingHistory.length > 0) {
        html += `
                <div class="mt-4">
                    <h6 class="text-success mb-3">🏭 Processing History</h6>
                    <div class="timeline">
        `;
        
        for (let step of processingHistory) {
            const stepDate = new Date(step.timestamp.toNumber() * 1000);
            html += `
                        <div class="timeline-item">
                            <div class="processing-step">
                                <h6>${step.stepDescription}</h6>
                                <p class="mb-1">
                                    <strong>Processor:</strong> ${step.processorName}<br>
                                    <strong>Location:</strong> ${step.location || 'Not specified'}<br>
                                    <strong>Date:</strong> ${stepDate.toLocaleString()}
                                </p>
                            </div>
                        </div>
            `;
        }
        
        html += `
                    </div>
                </div>
        `;
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// View batch details (helper function)
async function viewBatchDetails(batchId) {
    document.getElementById('verifyBatchId').value = batchId;
    showDashboard('consumer');
    await verifyBatch();
}

// ====================
// QR CODE FUNCTIONS
// ====================

// Generate QR code
function generateQRCode(batchId) {
    const container = document.getElementById('qrcode');
    
    if (!container || !batchId) {
        console.error('QR container or batch ID not found');
        return;
    }
    
    // Clear previous content
    container.innerHTML = '';
    
    try {
        if (typeof QRCode !== 'undefined') {
            new QRCode(container, {
                text: batchId,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            
            showMessage(`✅ QR code generated for batch ${batchId}`, 'success');
            console.log("QR code generated successfully");
            
        } else {
            // Fallback to Google Charts
            const img = document.createElement('img');
            img.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(batchId)}&choe=UTF-8&chld=H`;
            img.alt = `QR Code for batch ${batchId}`;
            container.appendChild(img);
        }
        
    } catch (error) {
        console.error("QR generation error:", error);
        container.innerHTML = `
            <div class="text-center p-3">
                <div class="border border-dark rounded p-3">
                    <strong>Batch ID:</strong><br>
                    <code style="font-size: 16px;">${batchId}</code><br>
                    <small class="text-muted">QR generation failed</small>
                </div>
            </div>
        `;
    }
}

// QR Scanner functions
function startQRScanner() {
    if (!qrScanner) {
        const videoElem = document.getElementById('qr-video');
        
        if (typeof QrScanner !== 'undefined') {
            qrScanner = new QrScanner(
                videoElem,
                result => {
                    console.log('QR Code scanned:', result);
                    document.getElementById('verifyBatchId').value = result;
                    showMessage(`✅ QR code scanned: ${result}`, 'success');
                    qrScanner.stop();
                    setTimeout(() => verifyBatch(), 1000);
                },
                {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );
        }
    }
    
    if (qrScanner) {
        qrScanner.start().then(() => {
            document.getElementById('qr-video').style.display = 'block';
            document.getElementById('scan-result').innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-camera me-2"></i>Camera active - point at QR code
                </div>
            `;
            showMessage('📷 QR scanner started', 'info');
        }).catch(err => {
            console.error('QR Scanner error:', err);
            showMessage('❌ Camera access denied or unavailable', 'error');
        });
    }
}

function stopQRScanner() {
    if (qrScanner) {
        qrScanner.stop();
        document.getElementById('qr-video').style.display = 'none';
        document.getElementById('scan-result').innerHTML = '';
        showMessage('📷 QR scanner stopped', 'info');
    }
}

// QR Image upload
async function handleQRUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showMessage('❌ Please select an image file', 'error');
        return;
    }
    
    try {
        const batchId = await processQRImage(file);
        if (batchId) {
            document.getElementById('verifyBatchId').value = batchId;
            showMessage(`✅ QR code detected: ${batchId}`, 'success');
            setTimeout(() => verifyBatch(), 1000);
        }
    } catch (error) {
        console.error('QR processing failed:', error);
        showMessage('❌ Could not detect QR code in image', 'error');
    }
    
    event.target.value = '';
}

function processQRImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    if (typeof jsQR !== 'undefined') {
                        const code = jsQR(imageData.data, imageData.width, imageData.height);
                        if (code && code.data) {
                            resolve(code.data.trim());
                        } else {
                            reject(new Error('No QR code found'));
                        }
                    } else {
                        reject(new Error('jsQR library not available'));
                    }
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// ====================
// UTILITY FUNCTIONS
// ====================

// GPS Location capture
function captureLocation() {
    const displayDiv = document.getElementById('location-display');
    
    if (!navigator.geolocation) {
        showMessage('❌ Geolocation not supported', 'error');
        return;
    }
    
    showMessage('📍 Capturing your location...', 'info');
    displayDiv.innerHTML = `
        <div class="text-center">
            <div class="spinner-border spinner-border-sm text-info"></div>
            <span class="ms-2">Getting location...</span>
        </div>
    `;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            currentLatitude = Math.round(position.coords.latitude * 1e6);
            currentLongitude = Math.round(position.coords.longitude * 1e6);
            
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            
            displayDiv.innerHTML = `
                <div class="alert alert-success mb-0">
                    <i class="fas fa-check-circle"></i> <strong>Location Captured:</strong><br>
                    📍 ${lat}, ${lng}<br>
                    <small>Accuracy: ±${Math.round(position.coords.accuracy)}m</small>
                </div>
            `;
            
            showMessage('✅ Location captured successfully', 'success');
        },
        (error) => {
            let errorMessage = 'Location error: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Permission denied';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Position unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Request timeout';
                    break;
                default:
                    errorMessage += 'Unknown error';
                    break;
            }
            
            displayDiv.innerHTML = `
                <div class="alert alert-danger mb-0">
                    <i class="fas fa-exclamation-triangle"></i> ${errorMessage}<br>
                    <button onclick="captureLocation()" class="btn btn-sm btn-danger mt-2">
                        Try Again
                    </button>
                </div>
            `;
            
            showMessage('❌ ' + errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}

// Show status messages
function showMessage(message, type) {
    const container = document.getElementById('status-messages');
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const alert = document.createElement('div');
    alert.className = `alert ${alertClass} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    container.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Loading modal
function showLoadingModal(show) {
    const modal = document.getElementById('loadingModal');
    if (show) {
        modal.style.display = 'block';
        modal.classList.add('show');
    } else {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

console.log("🌿 Enhanced Herbal Traceability System Loaded - Using ALL Smart Contract Functions!");