/**
 * Money Converter - Core Logic
 */

let rates = { ...fallbackRates };

document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    loadRates();

    // Event Listeners
    document.getElementById('fromCurrency').addEventListener('change', onFromChange);
    document.getElementById('toCurrency').addEventListener('change', onToChange);
    document.querySelector('.swap-btn').addEventListener('click', swapCurrencies);
    document.querySelector('.convert-btn').addEventListener('click', convert);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);

    // Optional: Auto-convert on amount change
    document.getElementById('amount').addEventListener('input', () => {
        if (document.getElementById('resultBox').classList.contains('show')) {
            convert();
        }
    });
});

/**
 * Fetch live rates from API
 */
async function loadRates() {
    const statusEl = document.getElementById('rateStatus');
    try {
        const res = await fetch('https://v6.exchangerate-api.com/v6/621fabc96b6d04ac61741831/latest/USD');
        if (!res.ok) throw new Error('API request failed');

        const data = await res.json();
        if (data.result === 'success') {
            rates = data.conversion_rates;
            const updated = new Date(data.time_last_update_utc).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            statusEl.textContent = `Live rates · updated ${updated}`;
            statusEl.style.color = '#8fba8a';
        } else {
            throw new Error(data['error-type'] || 'Unknown API error');
        }
    } catch (error) {
        console.error('Error loading rates:', error);
        statusEl.textContent = 'Approximate rates (offline mode)';
        statusEl.style.color = '#b07888';
    }
}

/**
 * Populate both from/to select elements
 */
function populateSelects() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    const fragment = document.createDocumentFragment();

    currencies.forEach(c => {
        const option = document.createElement('option');
        option.value = c.code;
        option.textContent = `${c.flag} ${c.code} — ${c.name}`;
        fragment.appendChild(option);
    });

    fromSelect.appendChild(fragment.cloneNode(true));
    toSelect.appendChild(fragment);

    fromSelect.value = 'USD';
    toSelect.value = 'MAD';

    // Initial display update
    updateDisplay('from', 'USD');
    updateDisplay('to', 'MAD');
}

/**
 * Update the visual display (flag, code, name) for a selector
 */
function updateDisplay(side, code) {
    const c = currencies.find(x => x.code === code);
    if (!c) return;

    document.getElementById(`${side}Flag`).textContent = c.flag;
    document.getElementById(`${side}Code`).textContent = c.code;
    document.getElementById(`${side}Name`).textContent = c.name;
}

function onFromChange() {
    updateDisplay('from', document.getElementById('fromCurrency').value);
}

function onToChange() {
    updateDisplay('to', document.getElementById('toCurrency').value);
}

/**
 * Swap the 'from' and 'to' currencies
 */
function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    onFromChange();
    onToChange();

    if (document.getElementById('resultBox').classList.contains('show')) {
        convert();
    }
}

/**
 * Perform the currency conversion
 */
function convert() {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount < 0) {
        amountInput.classList.add('error');
        setTimeout(() => amountInput.classList.remove('error'), 500);
        return;
    }

    const resultValue = (amount / rates[from]) * rates[to];
    const conversionRate = rates[to] / rates[from];
    const toCurr = currencies.find(c => c.code === to);

    const formattedResult = resultValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const resultBox = document.getElementById('resultBox');
    const resultValueEl = document.getElementById('resultValue');
    const resultRateEl = document.getElementById('resultRate');

    resultValueEl.textContent = `${toCurr.symbol} ${formattedResult}`;
    resultRateEl.textContent = `1 ${from} ≈ ${conversionRate.toFixed(4)} ${to}`;

    // Trigger animation
    resultBox.classList.remove('show');
    void resultBox.offsetWidth; // Force reflow
    resultBox.classList.add('show');
}

/**
 * Copy the conversion result to clipboard
 */
async function copyToClipboard() {
    const resultText = document.getElementById('resultValue').textContent;
    const copyBtn = document.getElementById('copyBtn');
    const btnText = copyBtn.querySelector('span:last-child') || copyBtn;

    try {
        await navigator.clipboard.writeText(resultText);

        // Visual feedback
        copyBtn.classList.add('copied');
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅</span> Copied!';

        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalContent;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}
