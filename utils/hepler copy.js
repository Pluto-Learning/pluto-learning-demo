export const timeAgo = (createDate) => {
    console.log("createDate",createDate);
    const now = new Date();
    const messageDate = new Date(createDate);
    const seconds = Math.floor((now - messageDate) / 1000);

    if (seconds < 60) return `${Math.abs(seconds)} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${Math.abs(minutes)} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${Math.abs(hours)} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${Math.abs(weeks)} week${Math.abs(weeks) > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${Math.abs(months)} month${Math.abs(months) > 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${Math.abs(years)} year${Math.abs(years) > 1 ? 's' : ''} ago`;
}
