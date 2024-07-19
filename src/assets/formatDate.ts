export const formatDate = (dateString: string, includeTime: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  
    if (includeTime) {
      options.hour = 'numeric';
      options.minute = 'numeric';
    }
  
    return new Date(dateString).toLocaleDateString('en-EN', options);
};