<template>
  <div :class="$style.checkoutPage">
    <div :class="$style.container">
      <!-- Header -->
      <div :class="$style.header">
        <button :class="$style.backButton" @click="handleBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Kembali
        </button>
        <h1 :class="$style.pageTitle">Checkout Donasi</h1>
      </div>

      <!-- Main Content -->
      <div :class="$style.mainContent">
        <!-- Left Side - Order Summary -->
        <div :class="$style.orderSummary">
          <h2 :class="$style.summaryTitle">Ringkasan Donasi</h2>
          
          <div :class="$style.summaryDetails">
            <div :class="$style.summaryItem">
              <span :class="$style.summaryLabel">Nominal Donasi</span>
              <span :class="$style.summaryValue">Rp.{{ donationAmount }}k</span>
            </div>
            <div :class="$style.summaryItem">
              <span :class="$style.summaryLabel">Frekuensi</span>
              <span :class="$style.summaryValue">{{ donationFrequency === 'monthly' ? 'Bulanan' : 'Sekali' }}</span>
            </div>
            <div :class="$style.summaryItem">
              <span :class="$style.summaryLabel">Metode Pembayaran</span>
              <span :class="$style.summaryValue">QRIS E-Wallet</span>
            </div>
            <div :class="$style.divider"></div>
            <div :class="[$style.summaryItem, $style.total]">
              <span :class="$style.summaryLabel">Total</span>
              <span :class="$style.summaryValue">Rp.{{ donationAmount }}k</span>
            </div>
          </div>

          <!-- QRIS Instructions -->
          <div :class="$style.qrisInstructions">
            <h3 :class="$style.instructionsTitle">Cara Pembayaran QRIS:</h3>
            <ol :class="$style.instructionsList">
              <li>Buka aplikasi e-wallet atau mobile banking Anda</li>
              <li>Pilih fitur scan QRIS</li>
              <li>Arahkan kamera ke kode QR di samping</li>
              <li>Pastikan nominal sudah sesuai</li>
              <li>Konfirmasi pembayaran di aplikasi Anda</li>
              <li>Tunggu hingga pembayaran berhasil</li>
            </ol>

            <div :class="$style.supportedApps">
              <h4 :class="$style.appsTitle">Didukung oleh:</h4>
              <div :class="$style.appsGrid">
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">G</div>
                  <span :class="$style.appName">GoPay</span>
                </div>
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">O</div>
                  <span :class="$style.appName">OVO</span>
                </div>
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">D</div>
                  <span :class="$style.appName">Dana</span>
                </div>
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">S</div>
                  <span :class="$style.appName">ShopeePay</span>
                </div>
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">L</div>
                  <span :class="$style.appName">LinkAja</span>
                </div>
                <div :class="$style.appItem">
                  <div :class="$style.appIcon">M</div>
                  <span :class="$style.appName">Mobile Banking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - QRIS Payment -->
        <div :class="$style.paymentSection">
          <h2 :class="$style.formTitle">Pembayaran QRIS</h2>

          <!-- QR Code Display -->
          <div :class="$style.qrContainer">
            <div :class="$style.qrCode">
              <!-- Placeholder untuk QR Code -->
              <div :class="$style.qrPlaceholder">
                <div :class="$style.qrGrid">
                  <div v-for="n in 25" :key="n" :class="$style.qrPixel" :style="{ opacity: Math.random() > 0.3 ? 1 : 0 }"></div>
                </div>
                <div :class="$style.qrLogo">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#9e7363">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
                    <rect x="14" y="7" width="3" height="3" fill="currentColor"/>
                    <rect x="7" y="14" width="3" height="3" fill="currentColor"/>
                    <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Payment Details -->
            <div :class="$style.paymentDetails">
              <div :class="$style.merchantInfo">
                <div :class="$style.merchantName">Meowment Indonesia</div>
                <div :class="$style.merchantId">MID: 123456789012345</div>
              </div>

              <div :class="$style.amountDisplay">
                <div :class="$style.amountLabel">Total Pembayaran</div>
                <div :class="$style.amountValue">Rp {{ (donationAmount * 1000).toLocaleString('id-ID') }}</div>
              </div>

              <div :class="$style.transactionInfo">
                <div :class="$style.infoItem">
                  <span :class="$style.infoLabel">Status:</span>
                  <span :class="[$style.infoValue, $style.statusPending]">Menunggu Pembayaran</span>
                </div>
                <div :class="$style.infoItem">
                  <span :class="$style.infoLabel">Kode Transaksi:</span>
                  <span :class="$style.infoValue">{{ transactionCode }}</span>
                </div>
                <div :class="$style.infoItem">
                  <span :class="$style.infoLabel">Waktu Kedaluwarsa:</span>
                  <span :class="[$style.infoValue, $style.expiryTime]">{{ expiryTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Manual Input Option -->
          <div :class="$style.manualOption">
            <button :class="$style.manualButton" @click="showManualInput">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 20H21M3 20H4.67454C5.16372 20 5.40832 20 5.63849 19.9447C5.84256 19.8957 6.03765 19.8149 6.21694 19.7053C6.41847 19.5816 6.59138 19.4087 6.93721 19.0629L20 6C20.5523 5.44772 20.5523 4.55228 20 4C19.4477 3.44772 18.5523 3.44772 18 4L4.93721 17.0629C4.59138 17.4087 4.41847 17.5816 4.29475 17.7831C4.18506 17.9624 4.10425 18.1574 4.05526 18.3615C4 18.5917 4 18.8363 4 19.3255V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Input Kode Manual
            </button>
          </div>

          <!-- Email for Receipt -->
          <div :class="$style.formGroup">
            <label :class="$style.label">Email untuk Tanda Terima</label>
            <input
              type="email"
              :class="$style.inputField"
              v-model="userEmail"
              placeholder="email@example.com"
            />
          </div>

          <!-- Payment Status -->
          <div :class="$style.paymentStatus" v-if="paymentStatus">
            <div :class="[$style.statusIndicator, $style[paymentStatus]]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path v-if="paymentStatus === 'success'" d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path v-else d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ statusMessages[paymentStatus] }}
            </div>
          </div>

          <!-- Action Buttons -->
          <div :class="$style.actionButtons">
            <button :class="$style.cancelBtn" @click="handleCancel">
              Batalkan
            </button>
            <button 
              :class="[$style.confirmBtn, !userEmail && $style.confirmBtnDisabled]"
              @click="simulatePayment"
              :disabled="!userEmail"
            >
              Simulasikan Pembayaran
            </button>
          </div>

          <!-- Manual Input Modal -->
          <div :class="[$style.manualModal, showManual && $style.manualModalActive]">
            <div :class="$style.modalContent">
              <div :class="$style.modalHeader">
                <h3>Input Kode QRIS Manual</h3>
                <button :class="$style.closeButton" @click="hideManualInput">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div :class="$style.modalBody">
                <p>Masukkan kode QRIS yang tertera di aplikasi e-wallet Anda:</p>
                <input
                  type="text"
                  :class="$style.modalInput"
                  v-model="manualCode"
                  placeholder="Contoh: 00020101021126650014ID.CO.QRIS.WWW..."
                  maxlength="100"
                />
                <button :class="$style.submitManualBtn" @click="processManualCode">
                  Proses Kode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Data dari route parameters
const donationAmount = ref(0);
const donationFrequency = ref('once');

// Form data
const userEmail = ref('');
const paymentStatus = ref('');
const showManual = ref(false);
const manualCode = ref('');
const transactionCode = ref('');

// Status messages
const statusMessages = {
  success: 'Pembayaran Berhasil!',
  failed: 'Pembayaran Gagal',
  pending: 'Menunggu Pembayaran'
};

// Computed properties
const expiryTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30); // 30 menit dari sekarang
  return now.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  });
});

// Methods
const generateTransactionCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const handleBack = () => {
  router.go(-1);
};

const handleCancel = () => {
  if (confirm('Apakah Anda yakin ingin membatalkan pembayaran?')) {
    router.push({ name: 'Donate' });
  }
};

const simulatePayment = () => {
  if (!userEmail.value) return;

  // Simulasi proses pembayaran
  paymentStatus.value = 'pending';
  
  setTimeout(() => {
    // 80% success rate untuk simulasi
    const isSuccess = Math.random() > 0.2;
    paymentStatus.value = isSuccess ? 'success' : 'failed';
    
    if (isSuccess) {
      setTimeout(() => {
        // Redirect ke halaman konfirmasi setelah pembayaran berhasil
        const paymentData = {
          amount: donationAmount.value,
          frequency: donationFrequency.value,
          method: 'qris',
          transactionCode: transactionCode.value,
          userEmail: userEmail.value,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('lastPayment', JSON.stringify(paymentData));
        
        router.push({ 
          name: 'PaymentConfirmation',
          query: {
            amount: donationAmount.value,
            method: 'qris'
          }
        });
      }, 2000);
    }
  }, 3000);
};

const showManualInput = () => {
  showManual.value = true;
};

const hideManualInput = () => {
  showManual.value = false;
  manualCode.value = '';
};

const processManualCode = () => {
  if (manualCode.value.length > 10) {
    alert('Kode QRIS berhasil diproses. Silakan lanjutkan pembayaran di aplikasi e-wallet Anda.');
    hideManualInput();
    simulatePayment();
  } else {
    alert('Kode QRIS tidak valid. Pastikan kode yang dimasukkan benar.');
  }
};

// Initialize data from route
onMounted(() => {
  donationAmount.value = route.query.amount || 50;
  donationFrequency.value = route.query.frequency || 'once';
  transactionCode.value = generateTransactionCode();
  
  // Pre-fill email if user is logged in
  const userEmailFromStorage = localStorage.getItem('userEmail');
  if (userEmailFromStorage) {
    userEmail.value = userEmailFromStorage;
  }
});
</script>

<style module>
.checkoutPage {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6c590 0%, #f8d8a8 100%);
  padding: 20px;
  font-family: 'SF Pro Rounded', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 30px 40px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.backButton {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #9e7363;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.backButton:hover {
  background: #f8f8f8;
}

.pageTitle {
  font-size: 2rem;
  font-weight: 700;
  color: #162d3a;
  margin: 0 auto;
  text-align: center;
}

/* Main Content */
.mainContent {
  display: flex;
  min-height: 600px;
}

/* Order Summary */
.orderSummary {
  flex: 1;
  background: #f8f9fa;
  padding: 40px;
  border-right: 1px solid #e0e0e0;
}

.summaryTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #162d3a;
  margin-bottom: 24px;
}

.summaryDetails {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.summaryItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.summaryLabel {
  color: #666;
  font-size: 1rem;
}

.summaryValue {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

.summaryItem.total {
  border-top: 1px solid #e0e0e0;
  margin-top: 12px;
  padding-top: 16px;
}

.summaryItem.total .summaryValue {
  color: #9e7363;
  font-size: 1.2rem;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 0;
}

/* QRIS Instructions */
.qrisInstructions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.instructionsTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #162d3a;
  margin-bottom: 16px;
}

.instructionsList {
  color: #666;
  line-height: 1.6;
  padding-left: 20px;
  margin-bottom: 24px;
}

.instructionsList li {
  margin-bottom: 8px;
}

/* Supported Apps */
.supportedApps {
  margin-top: 20px;
}

.appsTitle {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.appsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.appItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.appIcon {
  width: 32px;
  height: 32px;
  background: #9e7363;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.appName {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

/* Payment Section */
.paymentSection {
  flex: 1.2;
  padding: 40px;
  background: white;
  display: flex;
  flex-direction: column;
}

.formTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #162d3a;
  margin-bottom: 32px;
  text-align: center;
}

/* QR Container */
.qrContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.qrCode {
  width: 280px;
  height: 280px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrPlaceholder {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  width: 80%;
  height: 80%;
}

.qrPixel {
  background: #000;
  border-radius: 1px;
}

.qrLogo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 8px;
  padding: 8px;
}

/* Payment Details */
.paymentDetails {
  width: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.merchantInfo {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.merchantName {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.merchantId {
  font-size: 0.85rem;
  color: #666;
}

.amountDisplay {
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.amountLabel {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}

.amountValue {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9e7363;
}

.transactionInfo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.infoItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.infoLabel {
  font-size: 0.85rem;
  color: #666;
}

.infoValue {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
}

.statusPending {
  color: #ffa726;
}

.expiryTime {
  color: #f44336;
  font-weight: 700;
}

/* Manual Option */
.manualOption {
  margin-bottom: 24px;
}

.manualButton {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px dashed #9e7363;
  border-radius: 8px;
  padding: 12px 16px;
  color: #9e7363;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.manualButton:hover {
  background: #f8f8f8;
  border-style: solid;
}

/* Form Group */
.formGroup {
  margin-bottom: 24px;
}

.label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.inputField {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.inputField:focus {
  outline: none;
  border-color: #9e7363;
  background: white;
}

/* Payment Status */
.paymentStatus {
  margin: 20px 0;
}

.statusIndicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  justify-content: center;
}

.statusIndicator.success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.statusIndicator.failed {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #f44336;
}

.statusIndicator.pending {
  background: #fff3e0;
  color: #ef6c00;
  border: 1px solid #ff9800;
}

/* Action Buttons */
.actionButtons {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.cancelBtn {
  flex: 1;
  padding: 16px;
  border: 2px solid #9e7363;
  border-radius: 8px;
  background: white;
  color: #9e7363;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancelBtn:hover {
  background: #f8f8f8;
}

.confirmBtn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: #9e7363;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirmBtn:hover {
  background: #8a6252;
}

.confirmBtnDisabled {
  background: #ccc;
  cursor: not-allowed;
}

.confirmBtnDisabled:hover {
  background: #ccc;
}

/* Manual Input Modal */
.manualModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.manualModalActive {
  opacity: 1;
  visibility: visible;
}

.modalContent {
  background: white;
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modalHeader h3 {
  margin: 0;
  color: #162d3a;
  font-size: 1.3rem;
}

.closeButton {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.closeButton:hover {
  background: #f8f8f8;
}

.modalBody {
  padding: 24px;
}

.modalBody p {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.5;
}

.modalInput {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 0.9rem;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.modalInput:focus {
  outline: none;
  border-color: #9e7363;
  background: white;
}

.submitManualBtn {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #9e7363;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submitManualBtn:hover {
  background: #8a6252;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    margin: 10px;
    border-radius: 16px;
  }

  .header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
  }

  .pageTitle {
    font-size: 1.5rem;
  }

  .mainContent {
    flex-direction: column;
  }

  .orderSummary {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 30px 20px;
  }

  .paymentSection {
    padding: 30px 20px;
  }

  .qrCode {
    width: 240px;
    height: 240px;
  }

  .appsGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actionButtons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .qrCode {
    width: 200px;
    height: 200px;
  }
  
  .amountValue {
    font-size: 1.3rem;
  }
}
</style>