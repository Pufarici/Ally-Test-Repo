import { useState, useEffect, useRef } from 'react'
import './CheckoutPage.css'

const BANNER_SLIDES = [
  { bg: '#1a3c5e', text: 'FREE shipping on orders over $50!' },
  { bg: '#2d6a4f', text: 'Use code SAVE20 for 20% off your order.' },
  { bg: '#6d2d7a', text: 'New arrivals just landed — shop the collection.' },
]

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    sku: 'SKU-WNC-001',
    price: 129.99,
    qty: 1,
    thumb: 'https://placehold.co/64x64/e8e8e8/888?text=IMG',
  },
  {
    id: 2,
    name: 'USB-C Charging Cable (3-pack)',
    sku: 'SKU-UCC-003',
    price: 18.99,
    qty: 2,
    thumb: 'https://placehold.co/64x64/e8e8e8/888?text=IMG',
  },
]

export default function CheckoutPage() {
  const [slide, setSlide] = useState(0)
  const intervalRef = useRef(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
  })
  const [errors, setErrors] = useState({})
  const [saveAddress, setSaveAddress] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % BANNER_SLIDES.length)
    }, 3000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const subtotal = PRODUCTS.reduce((sum, p) => sum + p.price * p.qty, 0)
  const discount = promoStatus === 'applied' ? subtotal * 0.1 : 0
  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal - discount + shipping

  function handleField(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: undefined }))
  }

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setPromoStatus('applied')
    } else {
      setPromoStatus('invalid')
    }
  }

  function validate() {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'
    if (!form.zip.trim()) errs.zip = 'ZIP code is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) errs.cardNumber = 'Card number is required'
      if (!cardExpiry.trim()) errs.cardExpiry = 'Expiry is required'
      if (!cardCvv.trim()) errs.cardCvv = 'CVV is required'
    }
    return errs
  }

  function handlePlaceOrder() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. You'll receive a confirmation email shortly.</p>
      </div>
    )
  }

  return (
    <div className="checkout-root">
      <div
        className="promo-banner"
        style={{ background: BANNER_SLIDES[slide].bg }}
        aria-live="off"
      >
        <span>{BANNER_SLIDES[slide].text}</span>
      </div>

      <header className="checkout-header">
        <div className="checkout-logo">ShopCo</div>
        <h1 className="checkout-title">Checkout</h1>
      </header>

      <main className="checkout-main">
        <div className="checkout-left">
          <section className="checkout-section" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="section-heading">Order Summary</h2>
            <ul className="product-list">
              {PRODUCTS.map((p) => (
                <li key={p.id} className="product-item">
                  <img
                    src={p.thumb}
                    className="product-thumb"
                  />
                  <div className="product-details">
                    <div className="product-name">{p.name}</div>
                    <div className="product-meta">{p.sku} · Qty: {p.qty}</div>
                    <div className="product-price">${(p.price * p.qty).toFixed(2)}</div>
                  </div>
                  {p.id === 1 && (
                    <div className="discount-badge">SALE</div>
                  )}
                </li>
              ))}
            </ul>

            <div className="promo-row">
              <label htmlFor="promo-input" className="promo-label">Promo Code</label>
              <div className="promo-input-group">
                <input
                  id="promo-input"
                  type="text"
                  className="promo-input"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoStatus(null) }}
                  placeholder="Enter code"
                  aria-describedby={promoStatus ? 'promo-status' : undefined}
                />
                <span className="promo-apply-btn" onClick={applyPromo}>
                  Apply
                </span>
              </div>
              {promoStatus === 'applied' && (
                <div id="promo-status" className="promo-success">
                  Promo code applied — 10% discount added.
                </div>
              )}
              {promoStatus === 'invalid' && (
                <div id="promo-status" className="promo-error">
                  That promo code is not valid.
                </div>
              )}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="total-row">
                  <span>Discount (10%)</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-row total-final">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="checkout-right">
          <section className="checkout-section" aria-labelledby="shipping-heading">
            <h2 id="shipping-heading" className="section-heading">Shipping Address</h2>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`form-input${errors.firstName ? ' input-error' : ''}`}
                  value={form.firstName}
                  onChange={handleField}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="field-error">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`form-input${errors.lastName ? ' input-error' : ''}`}
                  value={form.lastName}
                  onChange={handleField}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <span className="field-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input${errors.email ? ' input-error' : ''}`}
                value={form.email}
                onChange={handleField}
                autoComplete="email"
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className={`form-input${errors.address ? ' input-error' : ''}`}
                value={form.address}
                onChange={handleField}
                autoComplete="street-address"
              />
              {errors.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={`form-input${errors.city ? ' input-error' : ''}`}
                  value={form.city}
                  onChange={handleField}
                  autoComplete="address-level2"
                />
                {errors.city && (
                  <span className="field-error">{errors.city}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className={`form-input${errors.state ? ' input-error' : ''}`}
                  value={form.state}
                  onChange={handleField}
                  autoComplete="address-level1"
                />
                {errors.state && (
                  <span className="field-error">{errors.state}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  className={`form-input${errors.zip ? ' input-error' : ''}`}
                  value={form.zip}
                  onChange={handleField}
                  autoComplete="postal-code"
                />
                {errors.zip && (
                  <span className="field-error">{errors.zip}</span>
                )}
              </div>
            </div>

            <div className="save-address-row">
              <div
                className={`custom-checkbox${saveAddress ? ' custom-checkbox-checked' : ''}`}
                onClick={() => setSaveAddress((v) => !v)}
              >
                {saveAddress && <span className="checkmark">✓</span>}
              </div>
              <span className="save-address-label" onClick={() => setSaveAddress((v) => !v)}>
                Save this address for future orders
              </span>
            </div>
            <p className="helper-text">
              Saved addresses can be managed from your account settings page.
            </p>
          </section>

          <section className="checkout-section" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="section-heading">Payment Method</h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                Credit / Debit Card
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                PayPal
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple"
                  checked={paymentMethod === 'apple'}
                  onChange={() => setPaymentMethod('apple')}
                />
                Apple Pay
              </label>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-fields">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    className={`form-input${errors.cardNumber ? ' input-error' : ''}`}
                    value={cardNumber}
                    onChange={(e) => { setCardNumber(e.target.value); setErrors((er) => ({ ...er, cardNumber: undefined })) }}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    maxLength={19}
                  />
                  {errors.cardNumber && (
                    <span className="field-error">{errors.cardNumber}</span>
                  )}
                </div>
                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Expiry Date</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      className={`form-input${errors.cardExpiry ? ' input-error' : ''}`}
                      value={cardExpiry}
                      onChange={(e) => { setCardExpiry(e.target.value); setErrors((er) => ({ ...er, cardExpiry: undefined })) }}
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                      maxLength={7}
                    />
                    {errors.cardExpiry && (
                      <span className="field-error">{errors.cardExpiry}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV</label>
                    <input
                      id="cardCvv"
                      type="text"
                      className={`form-input${errors.cardCvv ? ' input-error' : ''}`}
                      value={cardCvv}
                      onChange={(e) => { setCardCvv(e.target.value); setErrors((er) => ({ ...er, cardCvv: undefined })) }}
                      placeholder="123"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                    {errors.cardCvv && (
                      <span className="field-error">{errors.cardCvv}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <p className="payment-info">You will be redirected to PayPal to complete your payment securely.</p>
            )}

            {paymentMethod === 'apple' && (
              <p className="payment-info">Apple Pay will prompt you to authenticate with Face ID or Touch ID.</p>
            )}
          </section>

          <div
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            Place Order · ${total.toFixed(2)}
          </div>

          <p className="checkout-legal">
            By placing your order you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
            Your payment information is encrypted and never stored on our servers.
          </p>
        </div>
      </main>
    </div>
  )
}
