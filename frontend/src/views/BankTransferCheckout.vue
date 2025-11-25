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
              <span :class="$style.summaryValue">Transfer Bank</span>
            </div>
            <div :class="$style.divider"></div>
            <div :class="[$style.summaryItem, $style.total]">
              <span :class="$style.summaryLabel">Total</span>
              <span :class="$style.summaryValue">Rp.{{ donationAmount }}k</span>
            </div>
          </div>

          <!-- Bank Instructions -->
          <div :class="$style.bankInstructions">
            <h3 :class="$style.instructionsTitle">Instruksi Pembayaran:</h3>
            <ol :class="$style.instructionsList">
              <li>Pilih bank yang tersedia</li>
              <li>Masukkan nomor rekening Anda</li>
              <li>Klik "Konfirmasi Pembayaran"</li>
              <li>Anda akan menerima email dengan detail transfer</li>
              <li>Lakukan transfer sesuai nominal yang tertera</li>
            </ol>
          </div>
        </div>

        <!-- Right Side - Payment Form -->
        <div :class="$style.paymentForm">
          <h2 :class="$style.formTitle">Data Pembayaran</h2>

          <!-- Bank Selection -->
          <div :class="$style.formGroup">
            <label :class="$style.label">Pilih Bank</label>
            <div :class="$style.bankOptions">
              <div
                v-for="bank in availableBanks"
                :key="bank.code"
                :class="[$style.bankOption, selectedBank?.code === bank.code && $style.bankOptionActive]"
                @click="selectBank(bank)"
              >
                <img :class="$style.bankLogo" :src="bank.logo" :alt="bank.name" />
                <div :class="$style.bankInfo">
                  <span :class="$style.bankName">{{ bank.name }}</span>
                  <span :class="$style.bankNumber">{{ bank.accountNumber }}</span>
                  <span :class="$style.bankHolder">{{ bank.accountHolder }}</span>
                </div>
                <div :class="$style.radioCircle"></div>
              </div>
            </div>
          </div>

          <!-- Account Number Input -->
          <div :class="$style.formGroup">
            <label :class="$style.label">Nomor Rekening Anda</label>
            <input
              type="text"
              :class="$style.inputField"
              v-model="userAccountNumber"
              placeholder="Masukkan nomor rekening Anda"
              maxlength="20"
            />
            <div :class="$style.inputHelp">Pastikan nomor rekening sudah benar</div>
          </div>

          <!-- Account Name -->
          <div :class="$style.formGroup">
            <label :class="$style.label">Nama Pemilik Rekening</label>
            <input
              type="text"
              :class="$style.inputField"
              v-model="userAccountName"
              placeholder="Nama sesuai rekening bank"
            />
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

          <!-- Terms and Conditions -->
          <div :class="$style.termsGroup">
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="agreeTerms"
                :class="$style.checkbox"
              />
              <span :class="$style.checkboxCustom"></span>
              Saya menyetujui 
              <button :class="$style.termsLink" @click.prevent="showTerms">Syarat & Ketentuan</button>
              yang berlaku
            </label>
          </div>

          <!-- Action Buttons -->
          <div :class="$style.actionButtons">
            <button :class="$style.cancelBtn" @click="handleCancel">
              Batalkan
            </button>
            <button 
              :class="[$style.confirmBtn, !isFormValid && $style.confirmBtnDisabled]"
              @click="handleConfirmPayment"
              :disabled="!isFormValid"
            >
              Konfirmasi Pembayaran
            </button>
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
const selectedBank = ref(null);
const userAccountNumber = ref('');
const userAccountName = ref('');
const userEmail = ref('');
const agreeTerms = ref(false);

// Available banks
// Available banks
const availableBanks = ref([
  {
    code: 'bca',
    name: 'Bank BCA',
    accountNumber: '1234-5678-9012',
    accountHolder: 'MEOWMENT',
    logo: new URL('../assets/BCA.png', import.meta.url).href
  },
  {
    code: 'bni',
    name: 'Bank BNI',
    accountNumber: '9876-5432-1012',
    accountHolder: 'MEOWMENT',
    logo: new URL('../assets/BNI.png', import.meta.url).href
  },
  {
    code: 'bri',
    name: 'Bank BRI',
    accountNumber: '8765-4321-0987',
    accountHolder: 'MEOWMENT',
    logo: new URL('../assets/BRI.png', import.meta.url).href
  },
  {
    code: 'mandiri',
    name: 'Bank Mandiri',
    accountNumber: '7654-3210-9876',
    accountHolder: 'MEOWMENT',
    logo: new URL('../assets/Mandiri.png', import.meta.url).href
  }
]);

// Computed properties
const isFormValid = computed(() => {
  return selectedBank.value && 
         userAccountNumber.value.length >= 8 && 
         userAccountName.value.trim() && 
         userEmail.value && 
         agreeTerms.value;
});

// Methods
const selectBank = (bank) => {
  selectedBank.value = bank;
};

const handleBack = () => {
  router.go(-1);
};

const handleCancel = () => {
  if (confirm('Apakah Anda yakin ingin membatalkan pembayaran?')) {
    router.push({ name: 'Donate' });
  }
};

const handleConfirmPayment = () => {
  if (!isFormValid.value) return;

  const paymentData = {
    amount: donationAmount.value,
    frequency: donationFrequency.value,
    bank: selectedBank.value,
    userAccount: {
      number: userAccountNumber.value,
      name: userAccountName.value,
      email: userEmail.value
    },
    timestamp: new Date().toISOString()
  };

  // Simpan data pembayaran (bisa ke localStorage atau API)
  localStorage.setItem('lastPayment', JSON.stringify(paymentData));
  
  // Redirect ke halaman konfirmasi
  router.push({ 
    name: 'PaymentConfirmation',
    query: {
      amount: donationAmount.value,
      bank: selectedBank.value.code
    }
  });
};

const showTerms = () => {
  alert('Syarat dan Ketentuan akan ditampilkan di sini...');
};

// Initialize data from route
onMounted(() => {
  donationAmount.value = route.query.amount || 50;
  donationFrequency.value = route.query.frequency || 'once';
  
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

/* Bank Instructions */
.bankInstructions {
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
}

.instructionsList li {
  margin-bottom: 8px;
}

/* Payment Form */
.paymentForm {
  flex: 1.2;
  padding: 40px;
  background: white;
}

.formTitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #162d3a;
  margin-bottom: 32px;
}

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

/* Bank Options */
.bankOptions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bankOption {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bankOption:hover {
  border-color: #9e7363;
}

.bankOptionActive {
  background: #d6f7e4;
  border-color: #9e7363;
}

.bankLogo {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f8f9fa;
  padding: 4px;
}

.bankInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bankName {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.bankNumber {
  color: #9e7363;
  font-weight: 600;
  font-size: 0.9rem;
}

.bankHolder {
  color: #666;
  font-size: 0.85rem;
}

.bankOption .radioCircle {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.bankOptionActive .radioCircle {
  border-color: #9e7363;
  background: #9e7363;
}

.bankOptionActive .radioCircle::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

/* Input Fields */
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

.inputHelp {
  font-size: 0.85rem;
  color: #666;
  margin-top: 4px;
}

/* Terms and Conditions */
.termsGroup {
  margin: 32px 0;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
}

.checkbox {
  display: none;
}

.checkboxCustom {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.checkbox:checked + .checkboxCustom {
  background: #9e7363;
  border-color: #9e7363;
}

.checkbox:checked + .checkboxCustom::after {
  content: '✓';
  color: white;
  font-size: 12px;
}

.termsLink {
  background: none;
  border: none;
  color: #9e7363;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.termsLink:hover {
  color: #8a6252;
}

/* Action Buttons */
.actionButtons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
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

  .paymentForm {
    padding: 30px 20px;
  }

  .bankOption {
    padding: 12px;
  }

  .bankLogo {
    width: 32px;
    height: 32px;
  }

  .actionButtons {
    flex-direction: column;
  }
}
</style>