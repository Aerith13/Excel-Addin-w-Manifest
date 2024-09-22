Office.onReady((info) => {
    // Check if the host application is Excel
    if (info.host === Office.HostType.Excel) {
        // Set up the click event for the process button
        document.getElementById('processButton').onclick = processImage;
        console.log('Excel Add-in initialized'); // Add this line
    }
});

async function processImage() {
    console.log('Process button clicked'); // Add this line
    // Get references to the button and image input
    const processButton = document.getElementById('processButton');
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0]; // Get the selected file

    // Check if a file was selected
    if (!file) {
        alert('Please select an image file.');
        return; // Exit if no file is selected
    }

    // Disable the button and change its text while processing
    processButton.disabled = true;
    processButton.textContent = 'Processing...';

    try {
        console.log('Starting OCR processing');
        const result = await Tesseract.recognize(file);
        console.log('Received result:', result);
        const extractedText = result.data.text;
        document.getElementById('result').textContent = extractedText;

        await Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            range.values = [[extractedText]];
            await context.sync();
        });
    } catch (error) {
        console.error('Error:', error); // Log any errors
        alert(`An error occurred: ${error.message}`); // Alert the user
    } finally {
        processButton.disabled = false;
        processButton.textContent = 'Process Image';
    }
}
