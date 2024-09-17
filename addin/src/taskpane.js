Office.onReady((info) => {
    // Check if the host application is Excel
    if (info.host === Office.HostType.Excel) {
        // Set up the click event for the process button
        document.getElementById('processButton').onclick = processImage;
    }
});

async function processImage() {
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

    const formData = new FormData();
    formData.append('image', file); // Append the image file to the form data

    try {
        // Send the image to the server for OCR processing
        const response = await fetch('https://localhost:5000/ocr', {
            method: 'POST',
            body: formData,
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('OCR processing failed');
        }

        const result = await response.json(); // Parse the JSON response
        document.getElementById('result').textContent = result.text; // Display the result

        // Insert the OCR result into the active cell in Excel
        await Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();
            range.values = [[result.text]]; // Set the cell value to the OCR result
            await context.sync(); // Sync the changes
        });
    } catch (error) {
        console.error('Error:', error); // Log any errors
        alert('An error occurred while processing the image.'); // Alert the user
    }
}
