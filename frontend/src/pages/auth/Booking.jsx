import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyCoupon,
  clearError,
  confirmBooking,
  initiatePayment,
  resetBooking,
  saveDetails,
  selectConfirmed,
  selectCoupon,
  selectError,
  selectFinalAmount,
  selectLoading,
  selectLoadingMsg,
  selectRefNo,
  sendOtp,
  verifyOtp,
} from "../../features/user/bookingSlice";

// ─── Razorpay script loader (loads once, idempotent) ─────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errs.email = "Enter a valid email";
  if (!/^\+?[\d\s\-]{10,}$/.test(form.phone))
    errs.phone = "Enter a valid phone number";
  return errs;
}

// ══════════════════════════════════════════════════════════════════════════════
export default function BookingFlow() {
  const dispatch = useDispatch();

  // ── Redux (server / async state) ─────────────────────────────────────────
  const refNo = useSelector(selectRefNo);
  const coupon = useSelector(selectCoupon);
  const finalAmount = useSelector(selectFinalAmount);
  const loading = useSelector(selectLoading);
  const loadingMsg = useSelector(selectLoadingMsg);
  const apiError = useSelector(selectError);
  const confirmed = useSelector(selectConfirmed);

  // ── Local (pure UI state, no API involvement) ────────────────────────────
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [formErrs, setFormErrs] = useState({});
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const otpRefs = useRef([]);
  const stepLabels = ["Details", "Verify", "Payment", "Confirm"];

  const canNext3 =
    payMethod === "upi"
      ? upiId.includes("@")
      : payMethod === "card"
        ? cardNo.length >= 16 && cardExp && cardCvv.length >= 3
        : true;

  // ── OTP countdown ────────────────────────────────────────────────────────
  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  // ── Clear Redux error when user edits the form ────────────────────────────
  useEffect(() => {
    if (apiError) dispatch(clearError());
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 1 → 2: save details + trigger OTP ───────────────────────────────
  const handleNext1 = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setFormErrs(errs);
      return;
    }
    setFormErrs({});

    // a) Persist contact details, receive refNo
    const detailsRes = await dispatch(saveDetails(form));
    if (saveDetails.rejected.match(detailsRes)) return; // apiError shown in UI

    // b) Immediately send OTP using the new refNo
    const otpRes = await dispatch(sendOtp({ refNo: detailsRes.payload.refNo }));
    if (sendOtp.rejected.match(otpRes)) return;

    setOtpTimer(30);
    setStep(2);
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (!refNo) return;
    const res = await dispatch(sendOtp(refNo));
    if (sendOtp.fulfilled.match(res)) setOtpTimer(30);
  };

  // ── OTP box change + auto-focus next ─────────────────────────────────────
  const handleOtpChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const res = await dispatch(verifyOtp({ refNo, otp: otp.join("") }));
    if (verifyOtp.fulfilled.match(res)) {
      setOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError(res.payload || "Invalid OTP. Please try again.");
    }
  };

  // ── Apply coupon ──────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    const res = await dispatch(applyCoupon({ refNo, code: couponInput }));
    if (applyCoupon.fulfilled.match(res)) {
      setCouponMsg({
        ok: true,
        text: `${res.payload.coupon.discountPct}% discount applied!`,
      });
    } else {
      setCouponMsg({ ok: false, text: res.payload || "Invalid coupon code." });
    }
  };

  // ── Pay (Step 4 confirm button) ───────────────────────────────────────────
  const handlePay = async () => {
    // 1. Ensure Razorpay SDK is loaded
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load payment gateway. Please check your connection.");
      return;
    }

    // 2. Create Razorpay order on the backend
    const orderRes = await dispatch(
      initiatePayment({ refNo, method: payMethod }),
    );
    if (initiatePayment.rejected.match(orderRes)) return;

    const { orderId, amountPaise, currency, key, name, email, phone } =
      orderRes.payload;

    // 3. Open Razorpay checkout modal
    const rzp = new window.Razorpay({
      key,
      amount: amountPaise,
      currency,
      name: "Your Business Name", // ← replace with your brand name
      order_id: orderId,
      prefill: { name, email, contact: phone },
      theme: { color: "#c8855a" },

      // 4. Payment success → verify signature + confirm booking
      handler: async (response) => {
        const confirmRes = await dispatch(
          confirmBooking({
            refNo,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        );
        if (confirmBooking.rejected.match(confirmRes)) {
          alert(
            `Payment received but confirmation failed.\nPlease contact support with ref: ${refNo}`,
          );
        }
        // On success: Redux sets confirmed = true → success screen renders automatically
      },

      modal: {
        ondismiss: () => console.log("Razorpay modal closed by user."),
      },
    });

    rzp.on("payment.failed", (r) => {
      alert(`Payment failed: ${r.error.description}`);
    });

    rzp.open();
  };

  // ── Full reset ────────────────────────────────────────────────────────────
  const handleReset = () => {
    dispatch(resetBooking());
    setStep(1);
    setForm({ name: "", email: "", phone: "", note: "" });
    setFormErrs({});
    setCouponInput("");
    setCouponMsg(null);
    setPayMethod("upi");
    setUpiId("");
    setCardNo("");
    setCardExp("");
    setCardCvv("");
    setOtp(["", "", "", "", "", ""]);
    setOtpVerified(false);
    setOtpError("");
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    .root{
      min-height:100vh;
      background: #f8fafc;
      background: linear-gradient(to bottom, #f8fafc, #f1f5f9, #e2e8f0);
      font-family:'Plus Jakarta Sans',sans-serif;
      display:flex;
      align-items:flex-start;
      justify-content:center;
      padding:40px 16px;
    }
    .card{
      background:rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border:1px solid rgba(226, 232, 240, 0.8);
      border-radius:24px;
      width:100%;
      max-width:640px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
      animation:fadeUp .6s cubic-bezier(0.16, 1, 0.3, 1);
      overflow:hidden;
    }
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    
    .card-header{padding:32px 32px 24px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:16px;}
    .back-btn{
      background:#f8fafc;
      border:1px solid #e2e8f0;
      color:#64748b;
      cursor:pointer;
      padding:8px 16px;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:12px;
      font-weight:700;
      border-radius:12px;
      transition:all .2s;
      display:flex;
      align-items:center;
      gap:6px;
    }
    .back-btn:hover{background:#fff;color:#334155;border-color:#cbd5e1;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);}
    
    .htext{flex:1;}
    .htitle{font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.02em;}
    .hsub{font-size:11px;color:#94a3b8;margin-top:4px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;}
    
    .stepper{display:flex;items-center;padding:0 32px;border-bottom:1px solid #f1f5f9;background:rgba(248, 250, 252, 0.5);overflow-x:auto;height:60px;}
    .stepper::-webkit-scrollbar{display:none;}
    .sitem{display:flex;align-items:center;gap:8px;flex-shrink:0;}
    .sdot{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:1.5px solid #e2e8f0;color:#94a3b8;transition:all .3s;}
    .sdot.active{border-color:#3d6ef5;color:#3d6ef5;background:rgba(61, 110, 245, 0.08);}
    .sdot.done{border-color:#3d6ef5;background:#3d6ef5;color:#fff;}
    .slabel{font-size:11px;color:#94a3b8;letter-spacing:.05em;font-weight:700;text-transform:uppercase;}
    .slabel.active{color:#0f172a;}
    .slabel.done{color:#3d6ef5;}
    .sline{flex:1;height:2px;background:#e2e8f0;margin:0 12px;min-width:20px;border-radius:4px;}
    .sline.done{background:#3d6ef5;opacity:.2;}
    
    .body{padding:32px;}
    .sec-label{font-size:12px;color:#0f172a;letter-spacing:.06em;text-transform:uppercase;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px;}
    .sec-label::after{content:'';flex:1;height:1px;background:#f1f5f9;}
    
    .api-error{font-size:13px;color:#e11d48;font-weight:700;background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
    
    .form-group{margin-bottom:20px;}
    .form-label{font-size:11px;color:#64748b;letter-spacing:.08em;text-transform:uppercase;font-weight:700;margin-bottom:8px;display:block;padding-left:4px;}
    .form-input{
      width:100%;
      background:#f8fafc;
      border:1.5px solid #e2e8f0;
      border-radius:14px;
      padding:12px 16px;
      color:#0f172a;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px;
      font-weight:600;
      outline:none;
      transition:all .2s;
    }
    .form-input:focus{border-color:#3d6ef5;background:#fff;box-shadow:0 0 0 4px rgba(61, 110, 245, 0.08);}
    .form-input::placeholder{color:#94a3b8;font-weight:500;}
    .form-input.err{border-color:#f43f5e;background:#fff1f2;}
    .err-msg{font-size:11px;color:#f43f5e;margin-top:6px;font-weight:700;padding-left:4px;}
    
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
    textarea.form-input{resize:none;height:100px;line-height:1.6;}
    
    .otp-wrap{display:flex;justify-content:center;gap:12px;margin:32px 0;}
    .otp-input{
      width:52px;
      height:64px;
      text-align:center;
      background:#f8fafc;
      border:2px solid #e2e8f0;
      border-radius:16px;
      color:#0f172a;
      font-size:28px;
      font-weight:800;
      outline:none;
      transition:all .2s;
    }
    .otp-input:focus{border-color:#3d6ef5;background:#fff;box-shadow:0 0 0 4px rgba(61, 110, 245, 0.08);transform:translateY(-2px);}
    .otp-input.filled{border-color:#3d6ef5;background:#fff;color:#3d6ef5;}
    
    .otp-err{text-align:center;font-size:13px;color:#f43f5e;margin-top:10px;font-weight:700;}
    .otp-verified{text-align:center;padding:20px;border:1.5px solid #bbf7d0;background:#f0fdf4;border-radius:16px;color:#15803d;font-size:13px;font-weight:700;letter-spacing:.04em;}
    
    .resend-btn{background:none;border:none;color:#3d6ef5;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;text-decoration:underline;text-underline-offset:4px;margin-top:12px;transition:all .2s;}
    .resend-btn:hover{color:#2563eb;}
    .resend-btn:disabled{opacity:.4;cursor:not-allowed;text-decoration:none;}
    
    .pay-methods{display:flex;gap:10px;margin-bottom:24px;}
    .pay-tab{
      flex:1;
      padding:14px;
      border:1.5px solid #e2e8f0;
      border-radius:14px;
      background:#fff;
      color:#64748b;
      cursor:pointer;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:12px;
      font-weight:700;
      letter-spacing:.04em;
      text-transform:uppercase;
      transition:all .2s;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:4px;
    }
    .pay-tab:hover{border-color:#cbd5e1;background:#f8fafc;}
    .pay-tab.sel{border-color:#3d6ef5;background:rgba(61, 110, 245, 0.05);color:#3d6ef5;box-shadow:0 0 0 4px rgba(61, 110, 245, 0.08);}
    
    .coupon-row{display:flex;gap:10px;margin-bottom:12px;}
    .coupon-input{flex:1;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:12px 16px;color:#0f172a;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;outline:none;text-transform:uppercase;transition:all .2s;}
    .coupon-input:focus{border-color:#3d6ef5;background:#fff;box-shadow:0 0 0 4px rgba(61, 110, 245, 0.08);}
    
    .coupon-btn{background:#3d6ef5;border:none;color:#fff;cursor:pointer;padding:0 24px;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:800;border-radius:14px;letter-spacing:.06em;text-transform:uppercase;transition:all .2s;}
    .coupon-btn:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 12px rgba(61, 110, 245, 0.2);}
    
    .price-box{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:20px;padding:20px;margin-bottom:24px;}
    .prow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;}
    .prow+.prow{border-top:1px solid #f1f5f9;}
    .pkey{font-size:13px;color:#64748b;font-weight:600;}
    .pval{font-size:14px;color:#0f172a;font-weight:700;}
    .pval.disc{color:#10b981;}
    .pval.total{color:#3d6ef5;font-size:20px;font-weight:800;}
    
    .sum-box{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:20px;padding:24px;margin-bottom:24px;}
    .sum-title{font-size:20px;font-weight:800;color:#0f172a;margin-bottom:20px;letter-spacing:-0.01em;}
    .srow{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f1f5f9;}
    .srow:last-child{border-bottom:none;}
    .skey{font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.08em;}
    .sval{font-size:14px;color:#0f172a;font-weight:700;}
    .sval.amber{color:#3d6ef5;font-size:20px;font-weight:800;}
    
    .btn-row{display:flex;gap:12px;margin-top:32px;}
    .btn-primary{
      flex:1;
      padding:16px;
      background: linear-gradient(135deg, #3d6ef5 0%, #6366f1 100%);
      border:none;
      border-radius:16px;
      color:#fff;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px;
      font-weight:800;
      letter-spacing:.02em;
      cursor:pointer;
      transition:all .3s;
      box-shadow:0 10px 15px -3px rgba(61, 110, 245, 0.25);
    }
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 25px -5px rgba(61, 110, 245, 0.3);}
    .btn-primary:disabled{opacity:.4;cursor:not-allowed;box-shadow:none;transform:none;}
    
    .btn-ghost{
      padding:16px 24px;
      background:#fff;
      border:1.5px solid #e2e8f0;
      border-radius:16px;
      color:#64748b;
      font-family:'Plus Jakarta Sans',sans-serif;
      font-size:14px;
      font-weight:700;
      cursor:pointer;
      transition:all .2s;
    }
    .btn-ghost:hover{border-color:#3d6ef5;color:#3d6ef5;background:#f8fafc;}
    
    .loading-overlay{position:fixed;inset:0;background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;animation:fadeIn .3s ease;}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .spinner{width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:#3d6ef5;border-radius:50%;animation:spin .8s cubic-bezier(0.5, 0, 0.5, 1) infinite;}
    .loading-text{font-size:14px;color:#64748b;margin-top:20px;font-weight:700;letter-spacing:.02em;}
    
    .success-wrap{text-align:center;padding:10px 0;}
    .success-icon{
      width:80px;height:80px;border-radius:28px;
      background:linear-gradient(135deg, #10b981 0%, #059669 100%);
      display:flex;align-items:center;justify-content:center;margin:0 auto 28px;
      font-size:36px;color:#fff;
      box-shadow: 0 20px 25px -5px rgba(16, 185, 129, 0.3);
      animation:popIn .6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes popIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
    
    .success-title{font-size:32px;font-weight:800;color:#0f172a;margin-bottom:8px;letter-spacing:-0.03em;}
    .success-sub{font-size:14px;color:#64748b;font-weight:600;margin-bottom:32px;}
    .ref-box{display:inline-block;background:#f8fafc;border:2px solid #e2e8f0;border-radius:20px;padding:16px 36px;margin-bottom:24px;}
    .ref-label{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;font-weight:800;margin-bottom:6px;}
    .ref-num{font-size:20px;color:#3d6ef5;font-weight:800;letter-spacing:.1em;}
    .success-details{margin-top:24px;font-size:15px;color:#64748b;line-height:2;font-weight:600;}
    .success-paid{color:#059669;font-weight:800;font-size:20px;}
    .new-btn{
      margin-top:32px;background:#fff;border:1.5px solid #e2e8f0;color:#64748b;padding:12px 32px;border-radius:14px;
      font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;
    }
    .new-btn:hover{border-color:#3d6ef5;color:#3d6ef5;background:#f8fafc;}
    
    .hint{font-size:11px;color:#94a3b8;margin-top:8px;font-weight:600;padding-left:4px;}
    .bank-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}
    .bank-btn{
      padding:12px;border:1.5px solid #e2e8f0;border-radius:12px;background:#fff;color:#64748b;
      cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;transition:all .2s;
    }
    .bank-btn:hover{border-color:#3d6ef5;background:#f8fafc;color:#3d6ef5;box-shadow:0 4px 6px -1px rgba(61, 110, 245, 0.1);}
  `;

  // ── Success screen ─────────────────────────────────────────────────────────
  if (confirmed)
    return (
      <>
        <style>{styles}</style>
        <div className="root">
          <div className="card">
            <div className="body">
              <div className="success-wrap">
                <div className="success-icon">✓</div>
                <h1 className="success-title">Payment Successful!</h1>
                <p className="success-sub">
                  Your reservation is confirmed. A receipt has been sent to {form.email}.
                </p>
                <div className="ref-box">
                  <p className="ref-label">Booking Reference</p>
                  <p className="ref-num">{refNo}</p>
                </div>
                <div className="success-details">
                  <p className="text-slate-800 font-bold mb-1">{form.name}</p>
                  <p className="success-paid">
                    ₹{finalAmount?.toLocaleString("en-IN") ?? "—"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Paid via {payMethod === 'upi' ? 'UPI' : 'Card'}</p>
                </div>
                <button className="new-btn" onClick={handleReset}>
                  + New Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  console.log("finalAmount:", finalAmount);

  // ── Main flow ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <div className="loading-text">{loadingMsg}</div>
        </div>
      )}

      <div className="root">
        <div className="card">
          <div className="card-header">
            {step > 1 && (
              <button
                className="back-btn"
                onClick={() => setStep((s) => s - 1)}
              >
                ←
              </button>
            )}
            <div className="htext">
              <h2 className="htitle">
                {step === 1 && "Guest Details"}
                {step === 2 && "Verification"}
                {step === 3 && "Fast Checkout"}
                {step === 4 && "Final Review"}
              </h2>
              <p className="hsub">
                Step {step} of 4 — {stepLabels[step - 1]}
              </p>
            </div>
          </div>

          <div className="stepper">
            {stepLabels.map((label, i) => (
              <React.Fragment key={i}>
                <div className="sitem">
                  <div
                    className={`sdot ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                  >
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <div
                    className={`slabel ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
                  >
                    {label}
                  </div>
                </div>
                {i < 3 && (
                  <div className={`sline ${step > i + 1 ? "done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="body">
            {/* Step 1 — Details */}
            {step === 1 && (
              <>
                {apiError && <div className="api-error"><span>⚠</span> {apiError}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className={`form-input ${formErrs.name ? "err" : ""}`}
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                    {formErrs.name && (
                      <div className="err-msg">{formErrs.name}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      className={`form-input ${formErrs.phone ? "err" : ""}`}
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                    {formErrs.phone && (
                      <div className="err-msg">{formErrs.phone}</div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email for Confirmation</label>
                  <input
                    className={`form-input ${formErrs.email ? "err" : ""}`}
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                  {formErrs.email && (
                    <div className="err-msg">{formErrs.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Requests (Optional)</label>
                  <textarea
                    className="form-input"
                    placeholder="Quiet room, late check-in, etc."
                    value={form.note}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, note: e.target.value }))
                    }
                  />
                </div>
                <div className="btn-row">
                  <button
                    className="btn-primary"
                    onClick={handleNext1}
                    disabled={loading}
                  >
                    Send Secure OTP & Continue
                  </button>
                </div>
              </>
            )}

            {/* Step 2 — Verify */}
            {step === 2 && (
              <>
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <div
                    style={{ fontSize: 13, color: "#6b6560", fontWeight: 500 }}
                  >
                    OTP sent to{" "}
                    <span style={{ color: "#c8855a", fontWeight: 700 }}>
                      {form.email}
                    </span>
                  </div>
                </div>
                {apiError && <div className="api-error">⚠ {apiError}</div>}

                {otpVerified ? (
                  <div className="otp-verified">✓ Verified successfully</div>
                ) : (
                  <>
                    <div className="otp-wrap">
                      {otp.map((v, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          className={`otp-input ${v ? "filled" : ""}`}
                          maxLength={1}
                          value={v}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !v && i > 0)
                              otpRefs.current[i - 1]?.focus();
                          }}
                        />
                      ))}
                    </div>
                    {otpError && <div className="otp-err">{otpError}</div>}
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="resend-btn"
                        disabled={otpTimer > 0 || loading}
                        onClick={handleResendOtp}
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </>
                )}

                <div className="btn-row">
                  {!otpVerified && (
                    <button
                      className="btn-ghost"
                      onClick={handleVerifyOtp}
                      disabled={otp.join("").length < 6 || loading}
                    >
                      Verify OTP
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    disabled={!otpVerified}
                    onClick={() => setStep(3)}
                  >
                    {otpVerified
                      ? "Proceed to Payment →"
                      : "Awaiting Verification"}
                  </button>
                </div>
              </>
            )}

            {/* Step 3 — Payment */}

            {step === 3 && (
              <>
                <div className="price-box">
                  <div className="prow">
                    <span className="pkey">Subtotal</span>
                    <span className="pval">
                      ₹{finalAmount?.toLocaleString("en-IN") ?? "—"}
                    </span>
                  </div>
                  {coupon && (
                    <div className="prow">
                      <span className="pkey flex items-center gap-2">
                        Promo Applied
                        <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-widest">{coupon.code}</span>
                      </span>
                      <span className="pval disc">
                        −₹{coupon.discountAmt.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="prow">
                    <span className="pkey text-slate-800 font-bold">Total Amount</span>
                    <span className="pval total">
                      ₹
                      {finalAmount !== null && finalAmount !== undefined
                        ? finalAmount.toLocaleString("en-IN")
                        : "..."}
                    </span>
                  </div>
                </div>

                <div className="sec-label">Promo Code</div>
                <div className="coupon-row">
                  <input
                    className="coupon-input"
                    placeholder="Enter promo code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    className="coupon-btn"
                    onClick={handleApplyCoupon}
                    disabled={loading}
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <div className={couponMsg.ok ? "coupon-ok" : "coupon-no"}>
                    {couponMsg.ok ? "✓ " : "✗ "}
                    {couponMsg.text}
                  </div>
                )}

                <div className="sec-label" style={{ marginTop: 4 }}>
                  Payment Method
                </div>
                <div className="pay-methods">
                  {["upi", "card", "netbanking"].map((m) => (
                    <button
                      key={m}
                      className={`pay-tab ${payMethod === m ? "sel" : ""}`}
                      onClick={() => setPayMethod(m)}
                    >
                      {m === "upi"
                        ? "UPI"
                        : m === "card"
                          ? "Card"
                          : "Net Banking"}
                    </button>
                  ))}
                </div>

                {payMethod === "upi" && (
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input
                      className="form-input"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <div className="hint">
                      e.g. name@okaxis · name@paytm · name@ybl
                    </div>
                  </div>
                )}

                {payMethod === "card" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        className="form-input"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardNo.replace(/(\d{4})(?=\d)/g, "$1 ")}
                        onChange={(e) =>
                          setCardNo(
                            e.target.value.replace(/\D/g, "").slice(0, 16),
                          )
                        }
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry</label>
                        <input
                          className="form-input"
                          placeholder="MM / YY"
                          maxLength={5}
                          value={cardExp}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "");
                            if (v.length >= 2)
                              v = v.slice(0, 2) + "/" + v.slice(2, 4);
                            setCardExp(v);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          className="form-input"
                          placeholder="•••"
                          maxLength={4}
                          type="password"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {payMethod === "netbanking" && (
                  <div className="bank-grid">
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Others"].map(
                      (b) => (
                        <button key={b} className="bank-btn">
                          {b}
                        </button>
                      ),
                    )}
                  </div>
                )}

                <div className="btn-row">
                  <button
                    className="btn-primary"
                    disabled={!canNext3}
                    onClick={() => setStep(4)}
                  >
                    Review Booking →
                  </button>
                </div>
              </>
            )}

            {/* Step 4 — Confirm */}
            {step === 4 && (
              <>
                {apiError && <div className="api-error">⚠ {apiError}</div>}
                <div className="sum-box">
                  <p className="sum-title">Final Confirmation</p>
                  {[
                    ["Guest Name", form.name],
                    ["Email Address", form.email],
                    ["Primary Phone", form.phone],
                    [
                      "Method",
                      payMethod === "upi"
                        ? `UPI Integrated PAYMENT`
                        : payMethod === "card"
                          ? `Credit/Debit Card`
                          : "Net Banking",
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="srow">
                      <div className="skey">{k}</div>
                      <div className="sval">{v}</div>
                    </div>
                  ))}
                  {coupon && (
                    <div className="srow">
                      <div className="skey">Redemption</div>
                      <div className="sval text-emerald-600">
                        −₹{coupon.discountAmt.toLocaleString("en-IN")} (
                        {coupon.code})
                      </div>
                    </div>
                  )}
                  <div className="srow">
                    <div className="skey text-slate-400">Total Charged</div>
                    <div className="sval amber">
                      ₹{finalAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
                <div className="btn-row">
                  <button
                    className="btn-primary"
                    onClick={handlePay}
                    disabled={loading}
                  >
                    Pay & Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
