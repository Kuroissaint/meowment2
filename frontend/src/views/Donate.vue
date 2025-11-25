<template>
  <div :class="$style.donatePage">
    <div :class="$style.container">
      <!-- Main Content with Image and Form -->
      <div :class="$style.mainContent">
        <!-- Left Side - Image -->
        <div :class="$style.imageSection">
          <img :class="$style.donationImage" alt="Donation Illustration" src="../assets/173 2.png" />
        </div>

        <!-- Right Side - Form -->
        <div :class="$style.formSection">
          <!-- Header -->
          <div :class="$style.header">
            <div :class="$style.logoSection">
              <h1 :class="$style.logoText">Meowment</h1>
            </div>
            <p :class="$style.welcomeText">Selamat datang di laman donasi Meowment</p>
          </div>

          <!-- Donation Form -->
          <div :class="$style.donationForm">

            <!-- Donation Amount -->
            <div :class="$style.formGroup">
              <label :class="$style.sectionLabel">Pilih nominal donasi</label>
              <div :class="$style.amountOptions">
                <div 
                  v-for="amount in presetAmounts" 
                  :key="amount"
                  :class="[$style.amountOption, selectedAmount === amount && $style.amountOptionActive]"
                  @click="selectAmount(amount)"
                >
                  <div :class="$style.radioCircle"></div>
                  <span :class="$style.amountText">Rp.{{ amount }}k</span>
                </div>
              </div>
              <div :class="$style.customAmountLink">
                Masukkan nominal donasi sesuai keinginan
              </div>
            </div>

            <!-- Payment Method -->
            <div :class="$style.formGroup">
              <label :class="$style.sectionLabel">Pilih metode pembayaran</label>
              <div :class="$style.paymentOptions">
                <!-- Bank Transfer Option -->
                <div 
                  :class="[$style.paymentOption, paymentMethod === 'bank' && $style.paymentOptionActive]"
                  @click="paymentMethod = 'bank'"
                >
                  <div :class="$style.paymentIcon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M2 8H22V6H2V8ZM22 10H2V18H22V10ZM4 14H6V16H4V14ZM8 14H14V16H8V14Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div :class="$style.paymentInfo">
                    <span :class="$style.paymentTitle">Bank Transfer</span>
                    <span :class="$style.paymentDesc">Transfer via ATM/Internet Banking/Mobile Banking</span>
                  </div>
                  <div :class="$style.radioCircle"></div>
                </div>

                <!-- QRIS E-Wallet Option -->
                <div 
                  :class="[$style.paymentOption, paymentMethod === 'qris' && $style.paymentOptionActive]"
                  @click="paymentMethod = 'qris'"
                >
                  <div :class="$style.paymentIcon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                      <rect x="7" y="7" width="3" height="3" fill="currentColor"/>
                      <rect x="14" y="7" width="3" height="3" fill="currentColor"/>
                      <rect x="7" y="14" width="3" height="3" fill="currentColor"/>
                      <rect x="14" y="14" width="3" height="3" fill="currentColor"/>
                    </svg>
                  </div>
                  <div :class="$style.paymentInfo">
                    <span :class="$style.paymentTitle">QRIS E-Wallet</span>
                    <span :class="$style.paymentDesc">Bayar dengan QRIS via E-Wallet</span>
                  </div>
                  <div :class="$style.radioCircle"></div>
                </div>
              </div>
            </div>

            <!-- Donation Frequency -->
            <div :class="$style.formGroup">
              <label :class="$style.sectionLabel">Pilih frekuensi donasi</label>
              <div :class="$style.frequencyOptions">
                <div 
                  :class="[$style.frequencyOption, donationFrequency === 'monthly' && $style.frequencyOptionActive]"
                  @click="donationFrequency = 'monthly'"
                >
                  <div :class="$style.radioCircle"></div>
                  <span :class="$style.frequencyText">Bulanan</span>
                </div>
                <div 
                  :class="[$style.frequencyOption, donationFrequency === 'once' && $style.frequencyOptionActive]"
                  @click="donationFrequency = 'once'"
                >
                  <div :class="$style.radioCircle"></div>
                  <span :class="$style.frequencyText">Sekali</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div :class="$style.actionButtons">
              <button :class="$style.cancelBtn" @click="handleCancel">
                Batalkan
              </button>
              <button :class="$style.checkoutBtn" @click="handleCheckout">
                Langsung Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive data
const selectedAmount = ref(null);
const donationFrequency = ref('once');
const paymentMethod = ref('bank'); // Default payment method
const presetAmounts = [25, 50, 100];

// Methods
const selectAmount = (amount) => {
  selectedAmount.value = amount;
};

const handleCancel = () => {
  // Ganti dengan ini:
  router.push({ name: 'Home' });
  
  // Atau jika ingin ke halaman sebelumnya yang spesifik:
  // router.push('/');
};

// Di method handleCheckout Donate.vue
const handleCheckout = () => {
  if (!selectedAmount.value) {
    alert('Silakan pilih nominal donasi terlebih dahulu.');
    return;
  }

  if (!paymentMethod.value) {
    alert('Silakan pilih metode pembayaran terlebih dahulu.');
    return;
  }

  if (paymentMethod.value === 'bank') {
    // Redirect ke halaman bank transfer
    router.push({
      name: 'BankTransferCheckout',
      query: {
        amount: selectedAmount.value,
        frequency: donationFrequency.value
      }
    });
  } else if (paymentMethod.value === 'qris') {
    // Redirect ke halaman QRIS
    router.push({
      name: 'QrisCheckout',
      query: {
        amount: selectedAmount.value,
        frequency: donationFrequency.value
      }
    });
  }
};
</script>

<style module>
.donatePage {
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

/* Main Content Layout */
.mainContent {
  display: flex;
  min-height: 600px;
}

/* Left Side - Image */
.imageSection {
  flex: 1;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.donationImage {
  width: 100%;
  height: 100%;
  max-width: 800px;
  object-fit: contain;
}

/* Right Side - Form */
.formSection {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  background: white;
  color: #9e7363;
  padding: 40px;
  text-align: center;
}

.logoSection {
  margin-bottom: 16px;
}

.logoText {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #9e7363;
}

.welcomeText {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-family: 'Lato', sans-serif;
}

/* Donation Form Styles */
.donationForm {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.formGroup {
  margin-bottom: 32px;
}

.sectionLabel {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  font-family: 'Lato', sans-serif;
}

/* Dropdown Styles */
.dropdownContainer {
  width: 100%;
}

.dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.dropdown:hover {
  border-color: #9e7363;
}

.dropdownText {
  font-size: 1rem;
  color: #666;
}

.dropdownIcon {
  color: #666;
  font-size: 0.8rem;
}

/* Amount Options */
.amountOptions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.amountOption {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.amountOption:hover {
  border-color: #9e7363;
}

.amountOptionActive {
  background: #d6f7e4;
  border-color: #9e7363;
}

.radioCircle {
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.amountOptionActive .radioCircle {
  border-color: #9e7363;
  background: #9e7363;
}

.amountOptionActive .radioCircle::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.amountText {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

/* Custom Amount Link */
.customAmountLink {
  font-size: 0.9rem;
  color: #9e7363;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  padding: 8px;
}

.customAmountLink:hover {
  color: #8a6252;
}

/* Payment Options */
.paymentOptions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.paymentOption {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.paymentOption:hover {
  border-color: #9e7363;
  transform: translateY(-1px);
}

.paymentOptionActive {
  background: #d6f7e4;
  border-color: #9e7363;
}

.paymentIcon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e7363;
  background: #f8f9fa;
  border-radius: 8px;
  flex-shrink: 0;
}

.paymentInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.paymentTitle {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.paymentDesc {
  font-size: 0.85rem;
  color: #666;
}

.paymentOption .radioCircle {
  margin-left: auto;
}

.paymentOptionActive .radioCircle {
  border-color: #9e7363;
  background: #9e7363;
}

.paymentOptionActive .radioCircle::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

/* Frequency Options */
.frequencyOptions {
  display: flex;
  gap: 12px;
}

.frequencyOption {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.frequencyOption:hover {
  border-color: #9e7363;
}

.frequencyOptionActive {
  background: #d6f7e4;
  border-color: #9e7363;
}

.frequencyOptionActive .radioCircle {
  border-color: #9e7363;
  background: #9e7363;
}

.frequencyOptionActive .radioCircle::after {
  content: '';
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.frequencyText {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
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

.checkoutBtn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: #9e7363;
  color: #f6c590;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkoutBtn:hover {
  background: #8a6252;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    margin: 10px;
    border-radius: 16px;
  }

  .mainContent {
    flex-direction: column;
  }

  .imageSection {
    padding: 20px;
    min-height: 200px;
  }

  .donationImage {
    max-width: 200px;
  }

  .header {
    padding: 30px 20px;
  }

  .logoText {
    font-size: 2rem;
  }

  .donationForm {
    padding: 30px 20px;
  }

  .paymentOption {
    padding: 12px;
  }

  .paymentIcon {
    width: 32px;
    height: 32px;
  }

  .frequencyOptions {
    flex-direction: column;
  }

  .actionButtons {
    flex-direction: column;
  }
}
</style>