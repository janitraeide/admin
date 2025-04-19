async function handleJobApplication(event) {
    event.preventDefault();
    
    const form = event.target;
    const file = form.cv.files[0];
    
    try {
        // Create unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload file directly to the bucket root
        const { error: fileError } = await supabaseClient
            .storage
            .from('cvs')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });
            
        if (fileError) throw fileError;
        
        // Get the file URL
        const { data } = await supabaseClient
            .storage
            .from('cvs')
            .getPublicUrl(fileName);
            
        // Submit the application data
        const { error } = await supabaseClient
            .from('job_applications')
            .insert([{
                full_name: form.full_name.value,
                email: form.email.value,
                phone: form.phone.value,
                position: form.position.value,
                cover_letter: form.cover_letter.value,
                cv_url: data.publicUrl
            }]);

        if (error) throw error;
        
        alert('Application submitted successfully!');
        form.reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit application. Please try again.');
    }
}