const GiftCard = () => {
  return (
    <body>
      <div id="qr-code"></div>
      <footer>
        {`{% if gift_card.pass_url %}`}
        <a href="{{ gift_card.pass_url }}">
          <img
            id="apple-wallet-badge"
            src={`{{ "gift-card/add-to-apple-wallet.svg" | shopify_asset_url }}`}
            width="120"
            height="40"
            alt="Add To Apple Wallet"
          />
        </a>
        {`{% endif %}`}
      </footer>
    </body>
  )
}
export default GiftCard
