function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });

    return formatter.format(amount);
}

module.exports = {
    formatCurrency
}