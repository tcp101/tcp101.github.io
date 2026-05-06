// Initialize Flatpickr for date and time selection
flatpickr("#date", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    time_24hr: true
});

// Initialize Stripe
const stripe = Stripe('pk_test_...'); // Replace with your publishable key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('booking-form');
const submitBtn = document.getElementById('submit-btn');
const cardErrors = document.getElementById('card-errors');
const payNowRadio = document.getElementById('payNow');
const payLaterRadio = document.getElementById('payLater');
const cardContainer = document.getElementById('card-element');

function togglePaymentFields() {
    if (payNowRadio.checked) {
        cardContainer.style.display = 'block';
        submitBtn.textContent = 'Book and Pay';
    } else {
        cardContainer.style.display = 'none';
        submitBtn.textContent = 'Book Now';
    }
}

payNowRadio.addEventListener('change', togglePaymentFields);
payLaterRadio.addEventListener('change', togglePaymentFields);

// Initially hide if payLater, but since payNow checked, show
togglePaymentFields();

cardElement.addEventListener('change', (event) => {
    if (event.error) {
        cardErrors.textContent = event.error.message;
    } else {
        cardErrors.textContent = '';
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';

    if (payLaterRadio.checked) {
        // Pay later: just confirm booking
        alert('Booking confirmed! You will be contacted for payment details.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        // Reset form if desired
        form.reset();
        togglePaymentFields();
        return;
    }

    // Pay now: process with Stripe
    // In a real app, send form data to server to create PaymentIntent
    // For demo, we'll simulate
    const { error } = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
        payment_method: {
            card: cardElement,
        }
    });

    if (error) {
        cardErrors.textContent = error.message;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    } else {
        // Payment succeeded
        alert('Booking confirmed! Payment successful.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        // Reset form or redirect
        form.reset();
        togglePaymentFields();
    }
});