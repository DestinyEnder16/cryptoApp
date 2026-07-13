const exchangeRate = 0.000013;

const currencyConverter = (amount: number, from: string, to: string) => {
  if (from === to) return amount;

  const converted =
    from.toLowerCase() === "usd" && to.toLowerCase() === "btc"
      ? amount * exchangeRate
      : amount / exchangeRate;

  return Math.trunc(converted * 100) / 100;
};

export { currencyConverter };
