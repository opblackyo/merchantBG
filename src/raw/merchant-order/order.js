// --- 模擬後端資料庫 ---
let orders = [
    {
        id: '20231027001',
        customer: '王小明',
        phone: '0912-345-678',
        address: '台北市信義區信義路一段1號',
        time: '12:30 PM',
        amount: 180,
        status: 'pending', // 待處理
        items: [
            { name: '炸雞腿便當', qty: 1, price: 120 },
            { name: '珍珠奶茶 (去冰半糖)', qty: 1, price: 60 },
        ],
        note: '炸雞腿飯不要辣，珍珠奶茶請用環保杯。'
    },
    {
        id: '20231027002',
        customer: '林大華',
        phone: '0987-654-321',
        address: '新北市板橋區縣民大道二段10號',
        time: '01:00 PM',
        amount: 520,
        status: 'pending',
        items: [
            { name: '義式肉醬麵', qty: 2, price: 150 },
            { name: '凱撒沙拉', qty: 1, price: 90 },
            { name: '濃湯', qty: 2, price: 65 },
        ],
        note: '請將沙拉醬分開包裝，謝謝。'
    },
];

let currentOrder; // 用於儲存當前正在查看或操作的訂單物件

// --- 介面元素獲取 ---
const orderListEl = document.getElementById('order-list');
const modalEl = document.getElementById('order-modal');
const modalTitleEl = document.getElementById('modal-order-title');
const modalBodyEl = document.getElementById('modal-body');
const refreshIndicatorEl = document.querySelector('#refresh-indicator span');

// --- 核心功能：取得待接訂單 (模擬 API 呼叫) ---
function fetchPendingOrders() {
    // 這裡模擬 '取得待接訂單' API 呼叫
    const pendingOrders = orders.filter(order => order.status === 'pending');
    renderOrderList(pendingOrders);
    return pendingOrders;
}

// --- 渲染訂單清單 ---
function renderOrderList(pendingOrders) {
    orderListEl.innerHTML = ''; // 清空現有清單

    if (pendingOrders.length === 0) {
        orderListEl.innerHTML = '<div class="empty-state">目前沒有待接訂單。</div>';
        return;
    }

    pendingOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.setAttribute('data-order-id', order.id);
        card.onclick = () => showDetails(order.id);

        card.innerHTML = `
            <div class="order-info">
                <div class="order-id">訂單 #${order.id}</div>
                <div class="order-summary">
                    顧客: ${order.customer} | 總金額: NT$ ${order.amount} | 預計送達: ${order.time}
                </div>
            </div>
            <span class="status-tag">待接單</span>
        `;
        orderListEl.appendChild(card);
    });
}

// --- 顯示訂單詳情 (查看內容與備註) ---
function showDetails(orderId) {
    currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    // 填充 Modal 內容
    modalTitleEl.textContent = `訂單詳情 - #${currentOrder.id}`;
    
    // 渲染訂單內容
    const itemsHtml = currentOrder.items.map(item => 
        `<li>${item.name} x ${item.qty} (NT$ ${item.price * item.qty})</li>`
    ).join('');

    modalBodyEl.innerHTML = `
        <p><strong>顧客姓名:</strong> ${currentOrder.customer}</p>
        <p><strong>聯絡電話:</strong> ${currentOrder.phone}</p>
        <p><strong>送達地址:</strong> ${currentOrder.address}</p>
        <p><strong>預計送達:</strong> ${currentOrder.time}</p>
        <p><strong>總金額:</strong> NT$ ${currentOrder.amount}</p>
        
        <h4>餐點內容:</h4>
        <ul class="item-list">${itemsHtml}</ul>

        <h4>顧客備註:</h4>
        <p style="color: #d32f2f;">${currentOrder.note || '無'}</p>
    `;

    modalEl.style.display = 'block'; // 顯示 Modal
}

// --- 關閉 Modal ---
function closeModal() {
    modalEl.style.display = 'none';
    currentOrder = null;
}

// --- 處理接單或拒單 (接單/拒單 API 模擬) ---
function handleOrderAction(action) {
    if (!currentOrder) return;

    const orderId = currentOrder.id;

    if (action === 'accept') {
        // 模擬 '接單' API 呼叫：將訂單狀態改為 'accepted'
        // 實際應用中會呼叫後端 API
        currentOrder.status = 'accepted';
        console.log(`✅ 訂單 ${orderId} 已被接單 (Accepted)`);
        alert(`已成功接單: #${orderId}，準備出餐!`);

    } else if (action === 'reject') {
        // 模擬 '拒單' API 呼叫：將訂單狀態改為 'rejected'
        // 實際應用中會呼叫後端 API
        currentOrder.status = 'rejected';
        console.log(`❌ 訂單 ${orderId} 已被拒單 (Rejected)`);
        alert(`已拒絕訂單: #${orderId}。`);
    }

    closeModal();
    // 動作完成後，重新載入清單
    fetchPendingOrders(); 
}

// --- 輪詢機制 (模擬自動刷新) ---
let lastRefreshTime = new Date();

function autoRefresh() {
    // 模擬 '取得待接訂單' API 呼叫
    const pendingOrders = fetchPendingOrders();
    console.log(`輪詢刷新完成，取得 ${pendingOrders.length} 筆待接訂單。`);

    // 更新刷新時間指示器
    lastRefreshTime = new Date();
    
    // 假設每 5 秒刷新一次
    setTimeout(autoRefresh, 5000); 
}

// 更新刷新時間文字，讓使用者知道系統正在運作
function updateRefreshIndicator() {
    const diff = Math.floor((new Date() - lastRefreshTime) / 1000);
    refreshIndicatorEl.textContent = `${diff} 秒前`;
    setTimeout(updateRefreshIndicator, 1000); // 每秒更新
}


// --- 初始化 ---
window.onload = () => {
    // 首次載入資料
    fetchPendingOrders(); 
    // 啟動自動刷新機制 (輪詢)
    autoRefresh();
    // 啟動刷新時間顯示器
    updateRefreshIndicator();
};

// 點擊 Modal 外部時關閉 Modal
window.onclick = function(event) {
    if (event.target == modalEl) {
        closeModal();
    }
}