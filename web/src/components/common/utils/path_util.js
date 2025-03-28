export function getFileNameFromPath(path) {
    // Split the path by slashes or backslashes to get an array of parts
    const parts = path.split(/[\\/]/);

    // Get the last part which represents the file name with extension
    const fileNameWithExtension = parts[parts.length - 1];

    // Use the lastIndexOf method to find the last occurrence of '.' to separate file name and extension
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');

    // Check if there is a dot in the file name
    if (lastDotIndex !== -1) {
        // Extract the file name and extension separately
        const fileName = fileNameWithExtension.slice(0, lastDotIndex);
        const extension = fileNameWithExtension.slice(lastDotIndex + 1);
        return { fileName, extension: extension.toLowerCase() };
    } else {
        // If no dot found, return the whole name as filename and an empty string as extension
        return { fileName: fileNameWithExtension, extension: '' };
    }
}
