import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2800);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast) return null;
  return (
    <div className={`lumi-toast${visible ? ' show' : ''}`}>{toast}</div>
  );
}
