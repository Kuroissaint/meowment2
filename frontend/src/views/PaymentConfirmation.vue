<template>
  <div :class="$style.confirmationPage">
    <div :class="$style.container">
      <!-- Success Icon -->
      <div :class="$style.successIcon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M22 4L12 14.01l-3-3" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- Confirmation Message -->
      <div :class="$style.confirmationContent">
        <h1 :class="$style.title">Pembayaran Berhasil Diproses! 🎉</h1>
        <p :class="$style.subtitle">Terima kasih telah berdonasi untuk teman berbulu kita</p>

        <!-- Payment Details -->
        <div :class="$style.paymentDetails">
          <div :class="$style.detailCard">
            <h2 :class="$style.detailTitle">Detail Pembayaran</h2>
            
            <div :class="$style.detailItem">
              <span :class="$style.detailLabel">Nominal Donasi</span>
              <span :class="$style.detailValue">Rp.{{ paymentData.amount }}k</span>
            </div>
            
            <div :class="$style.detailItem">
              <span :class="$style.detailLabel">Frekuensi</span>
              <span :class="$style.detailValue">{{ paymentData.frequency === 'monthly' ? 'Bulanan' : 'Sekali' }}</span>
            </div>
            
            <div :class="$style.detailItem">
              <span :class="$style.detailLabel">Metode Pembayaran</span>
              <span :class="$style.detailValue">Transfer Bank {{ getBankName(paymentData.bank) }}</span>
            </div>
            
            <div :class="$style.detailItem">
              <span :class="$style.detailLabel">No. Referensi</span>
              <span :class="$style.detailValue">{{ paymentData.reference }}</span>
            </div>
            
            <div :class="$style.detailItem">
              <span :class="$style.detailLabel">Tanggal & Waktu</span>
              <span :class="$style.detailValue">{{ formatDate(paymentData.timestamp) }}</span>
            </div>
          </div>

          <!-- Bank Transfer Instructions -->
          <div :class="$style.instructionsCard">
            <h3 :class="$style.instructionsTitle">Langkah Selanjutnya:</h3>
            <ol :class="$style.instructionsList">
              <li>Cek email <strong>{{ paymentData.userAccount?.email }}</strong> untuk detail transfer</li>
              <li>Lakukan transfer ke rekening tujuan dalam 24 jam</li>
              <li>Gunakan kode referensi: <strong>{{ paymentData.reference }}</strong></li>
              <li>Donasi akan aktif setelah transfer dikonfirmasi</li>
            </ol>

            <!-- Virtual Account Info -->
            <div :class="$style.virtualAccount">
              <h4 :class="$style.vaTitle">Virtual Account:</h4>
              <div :class="$style.vaNumber">{{ paymentData.virtualAccount }}</div>
              <p :class="$style.vaHelp">Gunakan nomor ini untuk transfer via ATM/Internet Banking</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div :class="$style.actionButtons">
          <button :class="$style.printBtn" @click="handlePrint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2H18V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 14H6V22H18V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Cetak Invoice
          </button>
          <button :class="$style.homeBtn" @click="goToHome">
            Kembali ke Beranda
          </button>
          <button :class="$style.donateBtn" @click="goToDonate">
            Donasi Lagi
          </button>
        </div>

        <!-- Support Info -->
        <div :class="$style.supportInfo">
          <p :class="$style.supportText">
            Butuh bantuan? 
            <button :class="$style.supportLink" @click="contactSupport">Hubungi Support</button>
            atau email ke support@meowment.org
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const paymentData = ref({
  amount: 0,
  frequency: 'once',
  bank: '',
  reference: '',
  timestamp: '',
  userAccount: {
    email: '',
    number: '',
    name: ''
  },
  virtualAccount: ''
});

// Bank names mapping
const bankNames = {
  'bca': 'BCA',
  'bni': 'BNI', 
  'bri': 'BRI',
  'mandiri': 'Mandiri'
};

// Generate random reference number
const generateReference = () => {
  return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Generate virtual account number
const generateVirtualAccount = (bankCode) => {
  const prefixes = {
    'bca': '89308',
    'bni': '8277',
    'bri': '88888',
    'mandiri': '89508'
  };
  const prefix = prefixes[bankCode] || '89999';
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return prefix + random.toString().substr(0, 10 - prefix.length);
};

const getBankName = (bankCode) => {
  return bankNames[bankCode] || 'Bank';
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handlePrint = () => {
  window.print();
};

const goToHome = () => {
  router.push({ name: 'Home' });
};

const goToDonate = () => {
  router.push({ name: 'Donate' });
};

const contactSupport = () => {
  alert('Tim support akan menghubungi Anda dalam 1x24 jam.');
};

onMounted(() => {
  // Get payment data from route query or localStorage
  const amount = route.query.amount || 50;
  const bank = route.query.bank || 'bca';
  const frequency = route.query.frequency || 'once';
  
  // Get user data from localStorage
  const userEmail = localStorage.getItem('userEmail') || '';
  const lastPayment = JSON.parse(localStorage.getItem('lastPayment') || '{}');
  
  paymentData.value = {
    amount: parseInt(amount),
    frequency: frequency,
    bank: bank,
    reference: generateReference(),
    timestamp: new Date().toISOString(),
    userAccount: {
      email: userEmail || lastPayment.userAccount?.email || '',
      number: lastPayment.userAccount?.number || '',
      name: lastPayment.userAccount?.name || ''
    },
    virtualAccount: generateVirtualAccount(bank)
  };

  // Clear last payment data
  localStorage.removeItem('lastPayment');
});
</script>

<style module>
.confirmationPage {
  min-height: 100vh;
  background: linear-gradient(135deg, #f6c590 0%, #f8d8a8 100%);
  padding: 20px;
  font-family: 'SF Pro Rounded', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 40px;
  text-align: center;
}

/* Success Icon */
.successIcon {
  margin-bottom: 24px;
}

/* Confirmation Content */
.confirmationContent {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #162d3a;
  margin: 0;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

/* Payment Details */
.paymentDetails {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
}

.detailCard {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #4CAF50;
}

.detailTitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #162d3a;
  margin-bottom: 20px;
  text-align: center;
}

.detailItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detailItem:last-child {
  border-bottom: none;
}

.detailLabel {
  color: #666;
  font-size: 1rem;
}

.detailValue {
  color: #333;
  font-weight: 600;
  font-size: 1rem;
}

/* Instructions Card */
.instructionsCard {
  background: #e8f5e8;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #4CAF50;
}

.instructionsTitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2e7d32;
  margin-bottom: 16px;
}

.instructionsList {
  color: #333;
  line-height: 1.6;
  padding-left: 20px;
  margin-bottom: 20px;
}

.instructionsList li {
  margin-bottom: 8px;
}

/* Virtual Account */
.virtualAccount {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.vaTitle {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.vaNumber {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9e7363;
  letter-spacing: 2px;
  margin: 8px 0;
}

.vaHelp {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* Action Buttons */
.actionButtons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.printBtn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid #9e7363;
  border-radius: 8px;
  background: white;
  color: #9e7363;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.printBtn:hover {
  background: #f8f8f8;
}

.homeBtn {
  padding: 12px 24px;
  border: 2px solid #9e7363;
  border-radius: 8px;
  background: white;
  color: #9e7363;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.homeBtn:hover {
  background: #f8f8f8;
}

.donateBtn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #9e7363;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.donateBtn:hover {
  background: #8a6252;
}

/* Support Info */
.supportInfo {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.supportText {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.supportLink {
  background: none;
  border: none;
  color: #9e7363;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.supportLink:hover {
  color: #8a6252;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    margin: 10px;
    padding: 30px 20px;
    border-radius: 16px;
  }

  .title {
    font-size: 2rem;
  }

  .detailItem {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .actionButtons {
    flex-direction: column;
  }

  .printBtn,
  .homeBtn,
  .donateBtn {
    width: 100%;
    justify-content: center;
  }
}

@media print {
  .confirmationPage {
    background: white !important;
    padding: 0 !important;
  }
  
  .container {
    box-shadow: none !important;
    margin: 0 !important;
    max-width: none !important;
  }
  
  .actionButtons {
    display: none !important;
  }
}
</style>