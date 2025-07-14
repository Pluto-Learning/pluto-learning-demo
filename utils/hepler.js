/**
 * Function to calculate the time ago from a given date
 * @param {string} createDate - The date string in ISO format (e.g., "2024-11-11T11:29:02")
 * @returns {string} - The time ago in a human-readable format (e.g., "2 days ago")
 */
function timeAgo(createDate) {
    const date = new Date(createDate);
    const now = new Date();

    // Subtract 6 hours (6 * 60 * 60 * 1000 milliseconds)
    const adjustedNow = new Date(now.getTime() - (6 * 60 * 60 * 1000));

    const secondsAgo = Math.floor((adjustedNow - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(secondsAgo / interval.seconds);
        if (count > 0) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }

    return 'just now';
}

// Helper function to determine the file icon class
const getFileIconClass = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'docx':
        case 'doc':
            return '/assets/images/file-icons/doc.png';
        case 'pdf':
            return '/assets/images/file-icons/pdf.png';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return '/assets/images/file-icons/image.png';
        case 'xlsx':
            return '/assets/images/file-icons/xls.png';
        case 'txt':
            return '/assets/images/file-icons/word.png';
        default:
            return '/assets/images/file-icons/unknown-mail.png'; 
    }
};

const truncate = (string) => {
    const newText = string.substring(0, 10);
    return newText;
  };

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1]; // Get payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Invalid JWT token:', e);
        return null;
    }
}


// Export the function to be used in other parts of the application
module.exports = {
    timeAgo,
    getFileIconClass,
    truncate,
    parseJwt
};






