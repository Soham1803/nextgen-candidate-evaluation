export function cleanAndParseJson(dirtyJsonString: any) {
    // Remove everything before the first '{'
    const jsonStartIndex = dirtyJsonString.indexOf('{');
    if (jsonStartIndex === -1) {
        throw new Error('No JSON object found in the string');
    }

    // Extract the substring from the first '{'
    const extractedJsonString = dirtyJsonString.substring(jsonStartIndex);

    // Remove outer quotes if present
    let cleanedJsonString = extractedJsonString
        .replace(/^"|"$/g, '')  // Remove surrounding quotes
        .replace(/\\n/g, '')    // Remove newline escapes
        .replace(/\\/g, '')     // Remove backslashes
        .replace(/\s+/g, ' ')   // Replace multiple whitespaces
        .trim();                // Remove leading/trailing whitespace

    // Remove the outermost curly braces
    const firstCurlyBraceIndex = cleanedJsonString.indexOf('{');
    const lastCurlyBraceIndex = cleanedJsonString.lastIndexOf('}');
    if (firstCurlyBraceIndex !== -1 && lastCurlyBraceIndex !== -1) {
        cleanedJsonString = cleanedJsonString.substring(firstCurlyBraceIndex + 1, lastCurlyBraceIndex);
    }

    try {
        // Parse the cleaned string
        return JSON.parse(`${cleanedJsonString}`);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        console.log('Problematic cleaned string:', cleanedJsonString);
        throw new Error('Failed to parse JSON');
    }
}