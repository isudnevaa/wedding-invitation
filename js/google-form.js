// Google Forms IDs — FILL THESE IN!
const GOOGLE_FORM_IDS = {
    // Your form ID from URL
    formId: '1FAIpQLSectH5TPvd8cEYObOLsFh8s6d0W97EjvGKTgmQump7c1JM38g',

    // Entry IDs (will be auto-detected if correct format)
    entry: {
        name: 'entry.123456789',
        attendance: 'entry.987654321',
        guests: 'entry.111111111',
        diet: 'entry.222222222',
        message: 'entry.333333333'
    }
};

/**
 * Submit data to Google Form
 */
async function submitToGoogleForm(formData) {
    const formId = GOOGLE_FORM_IDS.formId;

    // Build form URL with entry IDs
    const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // Map form data to Google Form entries
    const params = new URLSearchParams();

    // You need to get entry IDs from your form (see instructions below)
    // params.append('entry.XXXXXXXX', formData.name);
    // params.append('entry.YYYYYYYY', formData.attendance === 'yes' ? 'Да, с удовольствием!' : 'К сожалению, не смогу');
    // params.append('entry.ZZZZZZZZ', formData.guests);

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        });

        return { success: true };

    } catch (error) {
        console.error('Error submitting to form:', error);
        throw error;
    }
}

/**
 * Get Entry IDs from your form
 */
function getFormEntryIds() {
    // Instructions:
    // 1. Open your form in preview mode
    // 2. Right-click → Inspect
    // 3. Find input elements with name="entry.XXXXXXXX"
    // 4. Copy those IDs and update GOOGLE_FORM_IDS above

    // Temporary: Use demo mode until entry IDs are filled
    console.warn('⚠️ Entry IDs not set. Please fill in GOOGLE_FORM_IDS.entry');
    return null;
}

// Export for use in RSVP form
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { submitToGoogleForm, getFormEntryIds };
}
