import { CheckCircle, Clock, Wifi } from 'lucide-react';

export default function StatusBadge({ type, children }) {
  const map = {
    sell:    { cls: 'badge-sell',   icon: CheckCircle },
    hold:    { cls: 'badge-hold',   icon: Clock },
    online:  { cls: 'badge-online', icon: Wifi },
    danger:  { cls: 'badge-danger', icon: null },
    teal:    { cls: 'badge-teal',   icon: null },
  };
  const { cls, icon: Icon } = map[type] || map.teal;
  return (
    <span className={`badge ${cls}`}>
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}
