async function handleContactSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        full_name: form.full_name.value,
        email: form.email.value,
        phone: form.phone.value,
        message: form.message.value
    };
    
    try {
        const { data, error } = await supabaseClient
            .from('contact_submissions')
            .insert([formData]);

        if (error) throw error;
        
        alert('Message sent successfully!');
        form.reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    }
}