import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Phase2.css';

const timelineSteps = ['Order Placed', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'];

function buildStatus(code) {
  const value = code.trim().toUpperCase();

  if (value.length < 5) {
    return { error: 'Tracking code not found. Please verify your order or tracking ID and try again.' };
  }

  // Check locally saved customer orders first
  try {
    const orders = JSON.parse(localStorage.getItem('lumiglow_orders') || '[]');
    const match = orders.find(o => String(o.id || '').toUpperCase() === value);
    if (match) {
      return {
        status: 'In Transit',
        location: 'Lumi Glow Botanical Lab Hub (Dhanbad)',
        eta: match.deliveryTime || 'Arriving in 2 Business Days',
        currentStep: 2,
        details: `Shipment for ${match.customer.firstName} ${match.customer.lastName}. Carbon-neutral transit to ${match.customer.address}, ${match.customer.city}.`,
        realOrder: match
      };
    }
  } catch (err) {
    console.warn('Local order read error:', err);
  }

  if (value.includes('DELIV')) {
    return {
      status: 'Delivered',
      location: 'Delivered to Destination',
      eta: 'Delivered Today',
      currentStep: 4,
      details: 'Your artisanal package has been safely delivered in 100% biodegradable packaging. Enjoy your glow!'
    };
  }

  if (value.includes('OUT')) {
    return {
      status: 'Out for Delivery',
      location: 'Local Eco-Van Courier',
      eta: 'Arriving today by 6:30 PM',
      currentStep: 3,
      details: 'Your package is out with the delivery specialist for final doorstep handover.'
    };
  }

  if (value.includes('TRANS')) {
    return {
      status: 'In Transit',
      location: 'Regional Botanical Hub',
      eta: 'Arriving in 1 to 2 days',
      currentStep: 2,
      details: 'Your order is moving through the temperature-controlled botanical distribution network.'
    };
  }

  if (value.includes('PACK')) {
    return {
      status: 'Packed',
      location: 'Lumi Glow Fulfillment Center',
      eta: 'Carrier pickup today',
      currentStep: 1,
      details: 'Your order is hand-packed, glass bottles cushioned with recycled honeycomb paper, and queued for dispatch.'
    };
  }

  const bucket = value.length % 5;
  const statusMap = [
    {
      status: 'Order Placed',
      location: 'Lumi Glow Central Order Desk',
      eta: 'Processing for dispatch',
      currentStep: 0,
      details: 'Order confirmed and formulation reservation secured.'
    },
    {
      status: 'Packed',
      location: 'Lumi Glow Fulfillment Center',
      eta: 'Carrier pickup in 12 hours',
      currentStep: 1,
      details: 'Your order is packed in recyclable glass protectant and queued for courier pickup.'
    },
    {
      status: 'In Transit',
      location: 'Regional Sorting Center',
      eta: 'Arriving in 2 days',
      currentStep: 2,
      details: 'Your order is moving through the shipping network on schedule.'
    },
    {
      status: 'Out for Delivery',
      location: 'Lumi Glow Local Courier Hub',
      eta: 'Arriving today by 7:00 PM',
      currentStep: 3,
      details: 'Your package is with the delivery partner and will reach you shortly.'
    },
    {
      status: 'Delivered',
      location: 'Delivered to Registered Address',
      eta: 'Delivered successfully',
      currentStep: 4,
      details: 'Your package has been delivered. Thank you for choosing clean sustainable beauty!'
    }
  ];

  return statusMap[bucket];
}

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('orderId') || searchParams.get('id') || '';
  const [trackingCode, setTrackingCode] = useState(queryCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const performLookup = useCallback((code) => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    window.setTimeout(() => {
      setResult(buildStatus(code));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (queryCode) {
      setTrackingCode(queryCode);
      performLookup(queryCode);
    }
  }, [queryCode, performLookup]);

  const handleTrack = (event) => {
    event.preventDefault();
    performLookup(trackingCode);
  };

  return (
    <div className="p2-track-page">
      <section className="p2-track-hero">
        <div className="container p2-track-hero-inner reveal">
          <p className="section-label">Eco-Logistics & Delivery</p>
          <h1>Track Your Lumi Glow Order</h1>
          <p>Enter your order reference code or courier tracking ID for real-time carbon-neutral shipment updates.</p>
        </div>
      </section>

      <section className="section-padding container p2-track-wrap">
        <div className="p2-track-card reveal-scale">
          <form onSubmit={handleTrack} className="p2-track-form">
            <label htmlFor="tracking-code" className="p2-track-label">Tracking or Order ID</label>
            <div className="p2-track-input-row">
              <input
                id="tracking-code"
                type="text"
                placeholder="Example: LG-ECO-918231"
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>

            {/* Quick Demo Sample Order Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Try Live Sample:</span>
              <button
                type="button"
                onClick={() => { setTrackingCode('LG-ECO-DELIV'); performLookup('LG-ECO-DELIV'); }}
                style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(34, 197, 94, 0.12)', border: '1px solid #22c55e', color: '#16a34a', fontWeight: 600 }}
              >
                Delivered (LG-ECO-DELIV)
              </button>
              <button
                type="button"
                onClick={() => { setTrackingCode('LG-ECO-OUT'); performLookup('LG-ECO-OUT'); }}
                style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(249, 115, 22, 0.12)', border: '1px solid #f97316', color: '#ea580c', fontWeight: 600 }}
              >
                Out for Delivery (LG-ECO-OUT)
              </button>
              <button
                type="button"
                onClick={() => { setTrackingCode('LG-ECO-TRANS'); performLookup('LG-ECO-TRANS'); }}
                style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid #0ea5e9', color: '#0284c7', fontWeight: 600 }}
              >
                In Transit (LG-ECO-TRANS)
              </button>
              <button
                type="button"
                onClick={() => { setTrackingCode('LG-ECO-PACK'); performLookup('LG-ECO-PACK'); }}
                style={{ padding: '3px 10px', borderRadius: '14px', fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid #a855f7', color: '#9333ea', fontWeight: 600 }}
              >
                Packed (LG-ECO-PACK)
              </button>
            </div>

            <p className="p2-track-help" style={{ marginTop: '10px' }}>
              Tip: Your Order Reference was generated on the checkout receipt and sent to your email.
            </p>
          </form>

          {result?.error ? (
            <div className="p2-track-alert error" role="status" aria-live="polite">
              <p>{result.error}</p>
            </div>
          ) : result ? (
            <div className="p2-track-result" role="status" aria-live="polite">
              <div className="p2-track-result-head">
                <div>
                  <h3>{result.status}</h3>
                  <p>{result.location}</p>
                </div>
                <div className="p2-track-eta">
                  <span>ETA</span>
                  <strong>{result.eta}</strong>
                </div>
              </div>

              <p className="p2-track-detail">{result.details}</p>

              <div className="p2-track-line" aria-label="Order progress">
                <div className="p2-track-line-bg" />
                <div
                  className="p2-track-line-progress"
                  style={{ width: `${(result.currentStep / (timelineSteps.length - 1)) * 100}%` }}
                />
                {timelineSteps.map((step, index) => {
                  const isDone = index <= result.currentStep;
                  return (
                    <div key={step} className="p2-track-step">
                      <div className={`p2-track-dot${isDone ? ' active' : ''}`}>
                        {index < result.currentStep ? '✓' : index + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>

              {result.realOrder && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-default)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase' }}>Package Manifest ({result.realOrder.items.length} items)</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {result.realOrder.items.map(item => (
                      <span key={item.id} style={{ fontSize: '0.82rem', padding: '4px 10px', background: 'var(--bg-surface-subtle)', borderRadius: '6px', border: '1px solid var(--border-default)' }}>
                        {item.qty}x {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
