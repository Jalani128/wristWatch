import React, { useState } from 'react'
import { contactPageStyles } from '../assets/dummyStyles';
import { AlertCircle, Phone, Mail, User, Clock, ShoppingCart, CreditCard, Send, MapPin, Check } from 'lucide-react';

// Input with an icon on left
function InputWithIcon({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
}) {
  return (
    <label className="block">
      <span className={contactPageStyles.inputLabel}>
        {label}{" "}
        {required && <span className={contactPageStyles.requiredStar}>*</span>}
      </span>
      <div className={contactPageStyles.inputContainer}>
        <div className={contactPageStyles.inputIconContainer}>{icon}</div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${contactPageStyles.inputBase} ${error ? contactPageStyles.inputError : contactPageStyles.inputNormal
            }`}
        />
      </div>
      {error && (
        <p className={contactPageStyles.errorMessage}>
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </label>
  );
}

// Select with icon
function SelectWithIcon({
  icon,
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required,
}) {
  return (
    <label className="block">
      <span className={contactPageStyles.inputLabel}>
        {label}{" "}
        {required && <span className={contactPageStyles.requiredStar}>*</span>}
      </span>
      <div className={contactPageStyles.inputContainer}>
        <div className={contactPageStyles.inputIconContainer}>{icon}</div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${contactPageStyles.inputBase} ${error ? contactPageStyles.inputError : contactPageStyles.inputNormal
            }`}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

// Creative card used on right side
function CreativeCard({
  title,
  subtitle,
  icon,
  ctaText,
  ctaOnClick,
  accent = "amber",
}) {
  // accent controls small color variants
  const accentBg =
    accent === "indigo"
      ? contactPageStyles.accentIndigo
      : contactPageStyles.accentAmber;
  const buttonClass =
    accent === "indigo"
      ? contactPageStyles.buttonIndigo
      : contactPageStyles.buttonAmber;

  return (
    <div className={`${contactPageStyles.creativeCardBase} ${accentBg}`}>
      <div className="flex items-start gap-4">
        <div className={contactPageStyles.creativeCardIconContainer}>
          {icon}
        </div>
        <div className="flex-1">
          <div
            className={contactPageStyles.creativeCardTitle}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </div>
          <p className={contactPageStyles.creativeCardSubtitle}>{subtitle}</p>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={ctaOnClick}
          className={`${contactPageStyles.creativeCardButtonBase} ${buttonClass}`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}

const ContactPage = () => {

  const WHATSAPP_NUMBER = "+923211422065";

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    product: "General Inquiry",
    budget: "",
    contactMethod: "WhatsApp",
    message: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const products = [
    "General Inquiry",
    "Norqain Independence",
    "Zenith Chronomaster",
    "Jacob & Co. Epic X",
    "Bvlgari Octo",
    "H. Moser Endeavour",
  ];

  // show toast
  function showToast(text, kind = "info", duration = 1800) {
    setToast({ text, kind });
    setTimeout(() => setToast(null), duration);
  }

  // strict validation: all fields required
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email is invalid";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.product.trim()) e.product = "Select product";
    if (!form.budget.trim()) e.budget = "Budget is required";
    if (!form.contactMethod.trim()) e.contactMethod = "Select contact method";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSending(true);

    // Build WhatsApp message (formatted)
    const message =
      `Hello! I am *${form.name}*.\n\n` +
      `*Interest:* ${form.product}\n` +
      `*Budget:* ${form.budget}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Email:* ${form.email}\n` +
      `*Preferred Contact:* ${form.contactMethod}\n\n` +
      `*Message:* ${form.message}`;

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
      message
    )}`;

    showToast("Opening WhatsApp...", "success", 900);

    setTimeout(() => {
      window.open(url, "_blank");
      clearForm();
      setSending(false);
      showToast("Submitted — form cleared", "success", 1600);
    }, 700);
  }

  function handelChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));

    setErrors((s) => ({
      ...s, [name]: undefined
    }));
  }

  // to clear form after submission
  function clearForm() {
    setForm(initialForm);
    setErrors({});
  }

  return (
    <div className={contactPageStyles.pageContainer}>
      <div className={contactPageStyles.innerContainer}>
        <div className={contactPageStyles.pageHeader}>
          <h1 className={contactPageStyles.pageTitle}
            style={{
              fontFamily: "Dancing Script', cursive"
            }}>
            Get in Touch with Us!
          </h1>
          <p style={{
            fontFamily: "'Playfair Display', serif"
          }} className={contactPageStyles.pageSubtitle}>
            Looking for a watch, quote or consultation? Contact us via the form or WhatsApp.
            We’re here to help you find the perfect timepiece!
          </p>
        </div>

        <div className={contactPageStyles.mainGrid}>
          <div className={contactPageStyles.leftColumn}>
            <div className={contactPageStyles.formCard}>
              <form onSubmit={handleSubmit}
                className={contactPageStyles.form}>
                <div className={contactPageStyles.inputGrid}>
                  <InputWithIcon
                    icon={<User className='w-5 h-5 text-black' />}
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handelChange}
                    placeholder="Full Name"
                    error={errors.name}
                    required
                  />

                  <InputWithIcon
                    icon={<Mail className='w-5 h-5 text-black' />}
                    label="Your email"
                    name="email"
                    value={form.email}
                    onChange={handelChange}
                    placeholder="Enter your email"
                    error={errors.email}
                    required
                  />
                  <div className={contactPageStyles.inputGrid}>
                    <InputWithIcon
                      icon={<Phone className='w-5 h-5 text-black' />}
                      label="Your Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handelChange}
                      placeholder="Enter your phone number"
                      error={errors.phone}
                      required
                    />
                    <SelectWithIcon
                      icon={<Clock className='w-5 h-5 text-black' />}
                      label="Preferred Contact"
                      name="contactMethod"
                      value={form.contactMethod}
                      onChange={handelChange}
                      placeholder={["WhatsApp", "Phone Call", "Email"]}
                      error={errors.contactMethod}
                      options={["WhatsApp", "Phone Call", "Email"]}
                      required
                    />
                  </div>

                  <div>
                    <SelectWithIcon
                      icon={<ShoppingCart className='w-5 h-5 text-black' />}
                      label="Interested Product"
                      name="product"
                      value={form.product}
                      onChange={handelChange}
                      error={errors.product}
                      options={products}
                      required
                    />
                  </div>

                  <SelectWithIcon
                    icon={<CreditCard className='w-5 h-5 text-green-600' />}
                    label="Estimated Budget"
                    name="budget"
                    value={form.budget}
                    onChange={handelChange}
                    placeholder={["Under ₨20000", "₨40000 - ₨15000", "Above ₨15000"]}
                    error={errors.budget}
                    options={["Under ₨5000", "₨5000 - ₨15000", "Above ₨15000"]}
                    required
                  />

                  <div>
                    <label className={contactPageStyles.inputLabel}>
                      Short Message {" "}
                      <span className={contactPageStyles.requiredStar}>*</span>
                    </label>
                    <textarea name="message" value={form.message}
                      onChange={handelChange} rows={4}
                      className={`${contactPageStyles.textareaContainer} ${errors.message
                        ? contactPageStyles.inputError
                        : contactPageStyles.inputNormal}`}
                      placeholder="Tell us what your looking for..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className={contactPageStyles.buttonsContainer}>
                  <button type="submit"
                    disabled={sending}
                    className={contactPageStyles.submitButton}>
                    <Send className="w-4 h-4 mr-1" />
                    <span className="font-medium">Send via WhatsApp</span>
                  </button>

                  <button
                    type='button'
                    onClick={() => {
                      clearForm();
                      showToast("Form cleared", "info");
                    }}
                    className={contactPageStyles.clearButton}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* right side */}
          <div className={contactPageStyles.rightColumn}>
            <div className={contactPageStyles.rightColumnGrid}>
              <CreativeCard
                title="Showroom visits"
                subtitle="Private viewings by appionment"
                icon={<MapPin className='w-6 h-6 text-black' />}
                ctaText="Book Visit"
                ctaOnClick={() => {
                  const msg = `Hi, I'd like to book a private showroom visit.`;
                  window.open(
                    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
                      msg
                    )}`,
                    "_blank"
                  );
                }}
                accent="amber"
              />
            </div>
          </div>
        </div>
      </div>
      {/* toast */}
      {toast && (
        <div
          className={`${contactPageStyles.toastBase} ${toast.kind === "error"
              ? contactPageStyles.toastError
              : contactPageStyles.toastSuccess
            }`}
        >
          {toast.kind === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&family=Playfair+Display:wght@400;600;700&display=swap');
      `}</style>

    </div>
  )
}

export default ContactPage