import { useEffect, useState } from 'react'
import {
  Bell,
  Bike,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  Headphones,
  LayoutDashboard,
  LogOut,
  LocateFixed,
  MapPin,
  Navigation,
  PackageCheck,
  PackageOpen,
  Phone,
  ReceiptIndianRupee,
  Search,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  WalletCards,
  X,
} from 'lucide-react'
import './App.css'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Assigned Orders', icon: PackageOpen, badge: 3 },
  { label: 'Active Delivery', icon: Navigation },
  { label: 'Delivery History', icon: Clock3 },
  { label: 'Earnings', icon: WalletCards },
  { label: 'Support', icon: Headphones },
]

const stats = [
  { label: 'Today’s earnings', value: '₹1,248', trend: '+12.5%', icon: ReceiptIndianRupee, tone: 'green' },
  { label: 'Completed', value: '12', detail: 'of 15 deliveries', icon: PackageCheck, tone: 'orange' },
  { label: 'Distance', value: '46.8 km', detail: '2.4 km avg / ride', icon: Navigation, tone: 'blue' },
  { label: 'Your rating', value: '4.92', detail: 'Excellent', icon: Star, tone: 'yellow' },
]

const activities = [
  { id: '#RD-1048', type: 'Premium chicken pack', place: 'Indiranagar, 5.2 km', time: '2 min ago', amount: '+₹148', status: 'Delivered' },
  { id: '#RD-1047', type: 'Fresh mutton combo', place: 'Koramangala, 3.8 km', time: '18 min ago', amount: '+₹196', status: 'Delivered' },
  { id: '#RD-1046', type: 'Boneless chicken', place: 'Domlur, 4.1 km', time: '34 min ago', amount: '+₹124', status: 'Delivered' },
]

const assignedOrders = [
  { id: '#RD-1049', customer: 'Priya Sharma', items: 'Premium chicken pack · 3 items', address: '12th Main Rd, Indiranagar', distance: '5.2 km', amount: '₹148', time: '11:20 AM', type: 'new' },
  { id: '#RD-1052', customer: 'Rahul Menon', items: 'Fresh mutton combo · 2 items', address: 'Lakshmi Layout, Ulsoor', distance: '7.8 km', amount: '₹196', time: '11:45 AM', type: 'cold-chain' },
  { id: '#RD-1056', customer: 'Ananya Iyer', items: 'Boneless chicken · 1 item', address: 'CMH Road, Indiranagar', distance: '3.6 km', amount: '₹124', time: '12:10 PM', type: 'new' },
]

function dateDaysAgo(days, hours, minutes) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hours, minutes, 0, 0)
  return date
}

function getWeekStart(date) {
  const weekStart = new Date(date)
  const daysSinceMonday = (weekStart.getDay() + 6) % 7
  weekStart.setDate(weekStart.getDate() - daysSinceMonday)
  weekStart.setHours(0, 0, 0, 0)
  return weekStart
}

function getPreviousMonthDate() {
  const date = new Date()
  date.setDate(1)
  date.setMonth(date.getMonth() - 1)
  date.setHours(14, 20, 0, 0)
  return date
}

function getRoutePoint(progress) {
  const routePoints = [
    { x: 120, y: 344 },
    { x: 300, y: 238 },
    { x: 470, y: 142 },
    { x: 596, y: 62 },
  ]
  const scaledProgress = Math.max(0, Math.min(0.999, progress)) * (routePoints.length - 1)
  const segment = Math.floor(scaledProgress)
  const segmentProgress = scaledProgress - segment
  const start = routePoints[segment]
  const end = routePoints[segment + 1]

  return {
    x: start.x + ((end.x - start.x) * segmentProgress),
    y: start.y + ((end.y - start.y) * segmentProgress),
  }
}

const currentWeekStart = getWeekStart(new Date())
const historyRows = [
  { id: '#RD-1048', customer: 'Vikram Das', items: 'Premium chicken pack', date: dateDaysAgo(0, 10, 42), amount: '₹148', rating: '5.0', status: 'Delivered' },
  { id: '#RD-1047', customer: 'Meera Nair', items: 'Fresh mutton combo', date: dateDaysAgo(0, 10, 16), amount: '₹196', rating: '4.9', status: 'Delivered' },
  { id: '#RD-1046', customer: 'Karan Patel', items: 'Boneless chicken', date: dateDaysAgo(0, 9, 48), amount: '₹124', rating: '4.8', status: 'Delivered' },
  { id: '#RD-1041', customer: 'Neha Gupta', items: 'Chicken curry cuts', date: dateDaysAgo(1, 18, 22), amount: '₹132', rating: '5.0', status: 'Delivered' },
  { id: '#RD-1038', customer: 'Aarav Rao', items: 'Fresh lamb shoulder', date: currentWeekStart, amount: '₹210', rating: '4.9', status: 'Delivered' },
  { id: '#RD-1024', customer: 'Isha Reddy', items: 'Premium chicken pack', date: dateDaysAgo(9, 16, 5), amount: '₹148', rating: '4.8', status: 'Delivered' },
  { id: '#RD-0982', customer: 'Dev Shah', items: 'Mutton biryani cuts', date: getPreviousMonthDate(), amount: '₹184', rating: '5.0', status: 'Delivered' },
]

function downloadCsv(filename, columns, rows) {
  const escapeValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [
    columns.map((column) => escapeValue(column.label)).join(','),
    ...rows.map((row) => columns.map((column) => escapeValue(column.value(row))).join(',')),
  ].join('\r\n')
  const file = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function AssignedOrdersPage({ acceptedOrderIds, rejectedOrderIds, deliveredOrderIds, onAccept, onReject, onOpenDelivery, searchQuery }) {
  const [section, setSection] = useState('Available')
  const [zone, setZone] = useState('All zones')

  const sectionOrders = assignedOrders.filter((order) => {
    if (section === 'Accepted') return acceptedOrderIds.includes(order.id)
    if (section === 'Rejected') return rejectedOrderIds.includes(order.id)
    if (section === 'Completed') return deliveredOrderIds.includes(order.id)
    return !acceptedOrderIds.includes(order.id) && !rejectedOrderIds.includes(order.id) && !deliveredOrderIds.includes(order.id)
  })

  const visibleOrders = sectionOrders.filter((order) => {
    const matchesZone = zone === 'All zones' || order.address.toLowerCase().includes(zone.toLowerCase())
    const searchText = `${order.id} ${order.customer} ${order.items} ${order.address}`.toLowerCase()
    return matchesZone && searchText.includes(searchQuery.trim().toLowerCase())
  })

  const acceptOrder = (id) => {
    onAccept(id)
  }

  const rejectOrder = (id) => {
    onReject(id)
    setSection('Rejected')
  }

  return (
    <section className="page-section">
      <PageHeader eyebrow={`${visibleOrders.length} ${section.toLowerCase()} orders`} title="Assigned orders" action={
        <label className="zone-select-wrap">
          <MapPin size={15} />
          <select aria-label="Filter assigned orders by zone" value={zone} onChange={(event) => setZone(event.target.value)}>
            <option>All zones</option>
            <option>Indiranagar</option>
            <option>Ulsoor</option>
          </select>
        </label>
      } />
      <div className="order-status-tabs" role="tablist" aria-label="Order status">
        {[
          { label: 'Available', count: assignedOrders.length - acceptedOrderIds.length - rejectedOrderIds.length - deliveredOrderIds.length },
          { label: 'Accepted', count: acceptedOrderIds.length },
          { label: 'Rejected', count: rejectedOrderIds.length },
          { label: 'Completed', count: deliveredOrderIds.length },
        ].map((item) => (
          <button
            key={item.label}
            className={section === item.label ? 'active' : ''}
            role="tab"
            aria-selected={section === item.label}
            onClick={() => setSection(item.label)}
          >
            {item.label}<span>{item.count}</span>
          </button>
        ))}
      </div>
      <div className="orders-list">
        {visibleOrders.map((order) => (
          <article className="order-list-card" key={order.id}>
            <div className="order-list-main">
              <div className="order-icon"><PackageOpen size={20} /></div>
              <div>
                <div className="order-title-row"><strong>{order.id}</strong><span>{order.type === 'cold-chain' ? 'COLD CHAIN' : 'NEW'}</span></div>
                <h3>{order.customer}</h3>
                <p>{order.items}</p>
              </div>
            </div>
            <div className="order-facts">
              <div><span>Pickup time</span><strong>{order.time}</strong></div>
              <div><span>Distance</span><strong>{order.distance}</strong></div>
              <div><span>Earning</span><strong>{order.amount}</strong></div>
            </div>
            <div className="order-address"><MapPin size={15} /><span>{order.address}</span></div>
            {acceptedOrderIds.includes(order.id) ? (
              <button className="accepted-button" onClick={() => onOpenDelivery(order.id)}><Navigation size={15} /> Continue delivery</button>
            ) : rejectedOrderIds.includes(order.id) ? (
              <button className="rejected-button" disabled>Rejected</button>
            ) : deliveredOrderIds.includes(order.id) ? (
              <button className="accepted-button" disabled><Check size={15} /> Completed</button>
            ) : (
              <div className="order-actions">
                <button className="reject-button" onClick={() => rejectOrder(order.id)}>Reject</button>
                <button className="accept-button compact" onClick={() => acceptOrder(order.id)}>Accept order</button>
              </div>
            )}
          </article>
        ))}
        {visibleOrders.length === 0 && (
          <p className="history-empty">
            {section === 'Available' ? 'No available orders match these filters.' : `No ${section.toLowerCase()} orders match these filters.`}
          </p>
        )}
      </div>
    </section>
  )
}

function ActiveDeliveryPage({ order, onDeliveryComplete }) {
  const [pickedUp, setPickedUp] = useState(false)
  const [delivered, setDelivered] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [otpOpen, setOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [routeProgress, setRouteProgress] = useState(0.18)
  const [mapZoom, setMapZoom] = useState(1)
  const pickupLocation = { latitude: 12.9783, longitude: 77.6408 }
  const destinationLocation = { latitude: 12.9719, longitude: 77.6403 }
  const riderMapPoint = getRoutePoint(routeProgress)
  const mapWidth = 700 / mapZoom
  const mapHeight = 440 / mapZoom
  const mapLeft = Math.max(0, Math.min(700 - mapWidth, riderMapPoint.x - (mapWidth / 2)))
  const mapTop = Math.max(0, Math.min(440 - mapHeight, riderMapPoint.y - (mapHeight / 2)))

  useEffect(() => {
    if (!otpOpen || resendTimer === 0) return undefined
    const timer = window.setTimeout(() => setResendTimer((current) => current - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [otpOpen, resendTimer])

  useEffect(() => {
    if (!isTracking || !location?.isDemo) return undefined

    const timer = window.setInterval(() => {
      setRouteProgress((current) => {
        const next = current >= 0.92 ? 0.92 : current + 0.018
        setLocation({
          latitude: pickupLocation.latitude - ((pickupLocation.latitude - destinationLocation.latitude) * next),
          longitude: pickupLocation.longitude - ((pickupLocation.longitude - destinationLocation.longitude) * next),
          accuracy: 25,
          heading: 175,
          isDemo: true,
        })
        return next
      })
    }, 1800)

    return () => window.clearInterval(timer)
  }, [isTracking, location?.isDemo])

  useEffect(() => {
    if (!isTracking) return undefined

    if (!navigator.geolocation) {
      setLocationError('GPS is not supported by this browser.')
      return undefined
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
        })
        setLocationError('')
        const progress =
          (pickupLocation.latitude - position.coords.latitude) /
          (pickupLocation.latitude - destinationLocation.latitude)
        if (Number.isFinite(progress)) setRouteProgress(Math.max(0.08, Math.min(0.92, progress)))
      },
      (error) => {
        const messages = {
          1: 'Location permission denied. Please allow GPS access.',
          2: 'Your current location is unavailable.',
          3: 'Location request timed out. Try again.',
        }
        setLocationError(messages[error.code] || 'Unable to track your location.')
        setLocation({
          latitude: pickupLocation.latitude - ((pickupLocation.latitude - destinationLocation.latitude) * routeProgress),
          longitude: pickupLocation.longitude - ((pickupLocation.longitude - destinationLocation.longitude) * routeProgress),
          accuracy: 25,
          heading: 175,
          isDemo: true,
        })
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [isTracking])

  const toggleTracking = () => {
    setLocationError('')
    setIsTracking((current) => {
      const next = !current
      if (next && !location) {
        setLocation({
          latitude: pickupLocation.latitude - ((pickupLocation.latitude - destinationLocation.latitude) * routeProgress),
          longitude: pickupLocation.longitude - ((pickupLocation.longitude - destinationLocation.longitude) * routeProgress),
          accuracy: 25,
          heading: 175,
          isDemo: true,
        })
      }
      return next
    })
  }

  const openTurnByTurn = () => {
    setIsTracking(true)
    const origin = location
      ? `${location.latitude},${location.longitude}`
      : ''
    const destination = encodeURIComponent('12th Main Rd 5th Cross Indiranagar Bengaluru')
    const originQuery = origin ? `&origin=${encodeURIComponent(origin)}` : ''
    window.open(
      `https://www.google.com/maps/dir/?api=1${originQuery}&destination=${destination}&travelmode=driving`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const openOtpVerification = () => {
    setOtpValue('')
    setOtpError('')
    setResendTimer(30)
    setOtpOpen(true)
  }

  const verifyOtp = () => {
    if (otpValue === '4829') {
      setOtpVerified(true)
      setOtpOpen(false)
      setOtpError('')
      return
    }
    setOtpError('Incorrect OTP. Please enter the 4-digit code from the customer.')
  }

  const resendOtp = () => {
    setOtpValue('')
    setOtpError('')
    setResendTimer(30)
  }

  return (
    <section className="page-section active-delivery-page">
      <PageHeader eyebrow={`Order ${order.id}`} title={delivered ? 'Delivery completed' : pickedUp ? 'On the way to customer' : 'Pickup in progress'} action={<span className="pickup-chip">{delivered ? 'COMPLETED' : 'IN PROGRESS'}</span>} />
      <div className="active-layout">
        <div className="active-map map-panel">
          <svg className="internal-map" viewBox={`${mapLeft} ${mapTop} ${mapWidth} ${mapHeight}`} role="img" aria-label="Street map of the delivery route in Indiranagar, Bengaluru">
            <rect x="0" y="0" width="700" height="440" fill="#f0f0e9" />
            <path d="M0 0H182L205 48L164 92L92 82L0 112Z" fill="#dcebd4" />
            <path d="M490 294L700 260V440H456L430 378Z" fill="#dcebd4" />
            <path d="M522 0H700V72L650 98L574 76Z" fill="#e1edd9" />
            <g fill="#e4e0d5" stroke="#fff" strokeWidth="3">
              <path d="M24 142h54v32H24zM91 125h54v41H91zM170 112h46v48h-46zM232 101h55v42h-55z" />
              <path d="M20 207h46v38H20zM80 194h67v42H80zM167 184h53v48h-53zM239 171h46v51h-46z" />
              <path d="M24 271h54v40H24zM94 259h54v45H94zM167 251h46v41h-46zM232 244h54v48h-54z" />
              <path d="M333 32h50v44h-50zM399 23h54v50h-54zM466 15h43v46h-43z" />
              <path d="M340 91h53v41h-53zM408 89h47v43h-47zM475 84h48v45h-48z" />
              <path d="M340 155h55v43h-55zM411 153h48v42h-48zM477 150h46v48h-46z" />
              <path d="M506 222h46v42h-46zM568 210h56v47h-56zM638 198h46v44h-46z" />
              <path d="M337 282h45v40h-45zM395 278h53v44h-53zM461 274h48v45h-48z" />
              <path d="M64 357h49v40H64zM132 350h53v48h-53zM207 341h47v46h-47zM283 337h42v50h-42z" />
            </g>
            <g fill="none" stroke="#d4d7cf" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-20 109C132 92 196 119 286 111S480 101 720 125" />
              <path d="M19 157C151 155 246 167 327 177S531 189 720 170" />
              <path d="M-20 239C115 226 204 232 300 240S512 258 720 231" />
              <path d="M-20 321C133 311 240 312 331 330S527 346 720 320" />
              <path d="M26 -30C47 77 57 159 56 239S69 353 87 470" />
              <path d="M151 -30C167 70 164 156 165 234S176 354 192 470" />
              <path d="M305 -30C293 56 301 135 313 213S317 365 335 470" />
              <path d="M467 -30C455 55 465 137 474 219S462 356 478 470" />
              <path d="M620 -30C605 65 624 146 636 231S617 357 636 470" />
            </g>
            <g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M-20 109C132 92 196 119 286 111S480 101 720 125" />
              <path d="M19 157C151 155 246 167 327 177S531 189 720 170" />
              <path d="M-20 239C115 226 204 232 300 240S512 258 720 231" />
              <path d="M-20 321C133 311 240 312 331 330S527 346 720 320" />
              <path d="M26 -30C47 77 57 159 56 239S69 353 87 470" />
              <path d="M151 -30C167 70 164 156 165 234S176 354 192 470" />
              <path d="M305 -30C293 56 301 135 313 213S317 365 335 470" />
              <path d="M467 -30C455 55 465 137 474 219S462 356 478 470" />
              <path d="M620 -30C605 65 624 146 636 231S617 357 636 470" />
            </g>
            <g fill="#8a8c82" fontSize="10" fontWeight="600">
              <text x="196" y="104" transform="rotate(-2 196 104)">100 Feet Road</text>
              <text x="180" y="229" transform="rotate(3 180 229)">12th Main Road</text>
              <text x="352" y="169" transform="rotate(-4 352 169)">CMH Road</text>
              <text x="45" y="297" transform="rotate(83 45 297)">Indiranagar 1st Stage</text>
              <text x="460" y="298" transform="rotate(84 460 298)">Indiranagar Metro</text>
              <text x="34" y="64" fill="#6c8b62">Defence Colony Park</text>
              <text x="505" y="359" fill="#6c8b62">Joggers Park</text>
            </g>
            <path d="M120 344C180 318 230 250 300 238S430 220 470 142S520 84 596 62" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M120 344C180 318 230 250 300 238S430 220 470 142S520 84 596 62" fill="none" stroke="#812230" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="120" cy="344" r="12" fill="#fff" stroke="#812230" strokeWidth="5" />
            <circle cx="596" cy="62" r="16" fill="#812230" stroke="#fff" strokeWidth="5" />
            <g transform={`translate(${riderMapPoint.x} ${riderMapPoint.y}) rotate(${location?.heading || 175})`}>
              <circle r="18" fill="#812230" opacity=".16" />
              <circle r="12" fill="#fff" />
              <circle r="9" fill="#812230" />
              <path d="M0-6L4 5L0 3L-4 5Z" fill="#fff" />
            </g>
            <g fill="#fff" stroke="#812230" strokeWidth="1">
              <rect x="85" y="363" width="68" height="21" rx="6" />
              <rect x="552" y="31" width="75" height="21" rx="6" />
            </g>
            <g fill="#812230" fontSize="9" fontWeight="800" textAnchor="middle">
              <text x="119" y="377">PICKUP</text>
              <text x="589" y="45">DROP-OFF</text>
            </g>
          </svg>
          {isTracking && (
            <div className="gps-status">
              <span className={locationError ? 'gps-dot error' : 'gps-dot'} />
              {locationError && !location?.isDemo
                ? 'GPS unavailable'
                : location?.isDemo
                  ? `Demo tracking · ±${Math.round(location.accuracy)} m`
                  : location
                    ? `GPS live · ±${Math.round(location.accuracy)} m`
                    : 'Getting GPS location...'}
            </div>
          )}
          {locationError && !location?.isDemo && <div className="gps-error">{locationError}</div>}
          <div className="map-zoom-controls" aria-label="Map controls">
            <button aria-label="Zoom in" onClick={() => setMapZoom((current) => Math.min(2.5, current + 0.25))}>+</button>
            <button aria-label="Zoom out" onClick={() => setMapZoom((current) => Math.max(1, current - 0.25))}>−</button>
            <button aria-label="Recenter on rider" onClick={() => setMapZoom(1.75)}><LocateFixed size={15} /></button>
          </div>
          <div className="map-place-label"><MapPin size={14} /><span><strong>Indiranagar</strong><small>Bengaluru, Karnataka</small></span></div>
          <div className="map-controls">
            <button className="map-control-button" onClick={toggleTracking} aria-label={isTracking ? 'Stop GPS tracking' : 'Start GPS tracking'}>
              {isTracking ? <LocateFixed size={16} /> : <LocateFixed size={16} />}
              {isTracking ? 'Stop live GPS' : 'Start live GPS'}
            </button>
            <button className="map-navigation" onClick={openTurnByTurn}><Navigation size={16} /> Turn-by-turn</button>
          </div>
        </div>
        <div className="active-details-card">
          <div className="customer-header">
            <div className="customer-avatar">PS</div>
            <div><span>Deliver to</span><strong>{order.customer}</strong></div>
            <button className="icon-button" aria-label="Call customer" onClick={() => { window.location.href = 'tel:+919876543210' }}><Phone size={17} /></button>
          </div>
          <div className="active-address"><MapPin size={16} /><span>{order.address}, Bengaluru</span></div>
          {location && (
            <div className="live-location-details">
              <LocateFixed size={15} />
              <div>
                <span>{location.isDemo ? 'Demo rider location' : 'Live rider location'}</span>
                <strong>{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</strong>
              </div>
            </div>
          )}
          <div className="verification-box">
            <div><ShieldCheck size={18} /><strong>Cold-chain verification</strong></div>
            <p>Verify packaging temperature before handover.</p>
          </div>
          {!pickedUp ? (
            <button className="accept-button" onClick={() => setPickedUp(true)}><PackageCheck size={17} /> Confirm pickup</button>
          ) : !delivered ? (
            otpVerified ? (
              <button className="accept-button" onClick={() => { setDelivered(true); onDeliveryComplete(order.id) }}><Check size={17} /> Complete delivery</button>
            ) : (
              <button className="accept-button" onClick={openOtpVerification}><ShieldCheck size={17} /> Verify delivery OTP</button>
            )
          ) : (
            <button className="accepted-button full" disabled><Check size={17} /> Delivery completed</button>
          )}
        </div>
      </div>

      {otpOpen && (
        <div className="otp-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOtpOpen(false)}>
          <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="otp-title">
            <button className="otp-close" aria-label="Close OTP verification" onClick={() => setOtpOpen(false)}><X size={18} /></button>
            <div className="otp-icon"><ShieldCheck size={24} /></div>
            <p className="eyebrow">Secure handover</p>
            <h2 id="otp-title">Enter delivery OTP</h2>
            <p className="otp-description">Ask {order.customer} for the 4-digit OTP sent to the customer.</p>
            <input
              className={otpError ? 'otp-input invalid' : 'otp-input'}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              value={otpValue}
              onChange={(event) => {
                setOtpValue(event.target.value.replace(/\D/g, '').slice(0, 4))
                setOtpError('')
              }}
              onKeyDown={(event) => event.key === 'Enter' && verifyOtp()}
              placeholder="• • • •"
              aria-label="4-digit delivery OTP"
              autoFocus
            />
            {otpError && <p className="otp-error">{otpError}</p>}
            <button className="otp-submit" onClick={verifyOtp} disabled={otpValue.length !== 4}>Verify OTP</button>
            <button className="otp-resend" onClick={resendOtp} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend OTP in 0:${String(resendTimer).padStart(2, '0')}` : 'Resend OTP'}
            </button>
            <span className="otp-demo">Demo OTP: 4829</span>
          </div>
        </div>
      )}
    </section>
  )
}

function HistoryPage({ searchQuery }) {
  const [filter, setFilter] = useState('All')
  const [now] = useState(() => new Date())
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = getWeekStart(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const filteredRows = historyRows.filter((row) => {
    const matchesPeriod = filter === 'Today'
      ? row.date >= todayStart && row.date <= now
      : filter === 'This week'
        ? row.date >= weekStart && row.date <= now
        : filter === 'This month'
          ? row.date >= monthStart && row.date <= now
          : true
    const searchText = `${row.id} ${row.customer} ${row.items}`.toLowerCase()
    return matchesPeriod && searchText.includes(searchQuery.trim().toLowerCase())
  }).sort((first, second) => second.date.getTime() - first.date.getTime())

  return (
    <section className="page-section">
      <PageHeader eyebrow="Your delivery records" title="Delivery history" action={
        <button
          className="outline-button"
          onClick={() => downloadCsv('delivery-history.csv', [
            { label: 'Order ID', value: (row) => row.id },
            { label: 'Customer', value: (row) => row.customer },
            { label: 'Items', value: (row) => row.items },
            { label: 'Date', value: (row) => row.date.toLocaleString('en-IN') },
            { label: 'Amount', value: (row) => row.amount },
            { label: 'Rating', value: (row) => row.rating },
            { label: 'Status', value: (row) => row.status },
          ], filteredRows)}
        >
          <Download size={15} /> Download report
        </button>
      } />
      <div className="history-filters">
        {['All', 'Today', 'This week', 'This month'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <p className="history-count">Showing {filteredRows.length} {filteredRows.length === 1 ? 'delivery' : 'deliveries'} · {filter}</p>
      <div className="history-table">
        <div className="history-head"><span>Order</span><span>Customer</span><span>Date & time</span><span>Amount</span><span>Rating</span><span>Status</span></div>
        {filteredRows.map((row) => (
          <div className="history-row" key={row.id}>
            <div><strong>{row.id}</strong><small>{row.items}</small></div>
            <strong>{row.customer}</strong>
            <span>{row.date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
            <strong className="activity-amount">{row.amount}</strong>
            <span className="rating-value"><Star size={12} fill="currentColor" /> {row.rating}</span>
            <span className="delivered-chip">{row.status}</span>
          </div>
        ))}
        {filteredRows.length === 0 && <p className="history-empty">No deliveries found for this period.</p>}
      </div>
    </section>
  )
}

function EarningsPage() {
  const [period, setPeriod] = useState('Today')
  const [showPayouts, setShowPayouts] = useState(false)
  const totals = { Today: '₹1,248', 'This week': '₹8,640', 'This month': '₹31,920' }
  const payouts = [
    { date: '19 Nov 2026', reference: 'PAY-84021', amount: '₹6,840', status: 'Processing' },
    { date: '12 Nov 2026', reference: 'PAY-83902', amount: '₹7,120', status: 'Paid' },
    { date: '05 Nov 2026', reference: 'PAY-83771', amount: '₹6,480', status: 'Paid' },
  ]

  return (
    <section className="page-section">
      <PageHeader eyebrow="Payment summary" title="Earnings" action={
        <button
          className="outline-button"
          onClick={() => downloadCsv('earnings-statement.csv', [
            { label: 'Description', value: (row) => row.description },
            { label: 'Amount', value: (row) => row.amount },
            { label: 'Period', value: () => period },
          ], [
            { description: 'Base pay', amount: '₹1,020' },
            { description: 'Tips and incentives', amount: '₹228' },
            { description: 'Total earnings', amount: totals[period] },
          ])}
        >
          <Download size={15} /> Statement
        </button>
      } />
      <div className="earnings-tabs">{Object.keys(totals).map((item) => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div>
      <div className="earnings-grid">
        <article className="earnings-total"><span>{period} earnings</span><strong>{totals[period]}</strong><small><TrendingUp size={13} /> 12.5% from previous period</small></article>
        <article className="earnings-breakdown"><span>Base pay</span><strong>₹1,020</strong><div className="earnings-line" /><span>Tips & incentives</span><strong>₹228</strong></article>
        <article className="earnings-payout"><span>Next payout</span><strong>₹6,840</strong><small>Wednesday, 19 November</small><button onClick={() => setShowPayouts((current) => !current)}>{showPayouts ? 'Hide payout history' : 'View payout history'}</button></article>
      </div>
      {showPayouts && (
        <div className="payout-history">
          <h3>Payout history</h3>
          {payouts.map((payout) => (
            <div className="payout-row" key={payout.reference}>
              <div><strong>{payout.amount}</strong><span>{payout.date} · {payout.reference}</span></div>
              <span className={payout.status === 'Paid' ? 'delivered-chip' : 'pickup-chip'}>{payout.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SupportPage() {
  const [sent, setSent] = useState(false)
  const [requestType, setRequestType] = useState('')

  const submitSupportRequest = (event) => {
    event.preventDefault()
    setRequestType('')
    setSent(true)
  }

  return (
    <section className="page-section">
      <PageHeader eyebrow="Rider assistance" title="Support centre" />
      <div className="support-grid">
        <article className="support-card emergency"><div className="support-icon"><Headphones size={20} /></div><div><strong>Emergency support</strong><p>Immediate help for accidents or safety issues</p></div><button onClick={() => { window.location.href = 'tel:112' }}>Call SOS · 112</button></article>
        <article className="support-card"><div className="support-icon"><Phone size={20} /></div><div><strong>Operations team</strong><p>Request a callback from rider operations</p></div><button onClick={() => { setSent(false); setRequestType('Callback request') }}>Request callback</button></article>
        <article className="support-card"><div className="support-icon"><CircleUserRound size={20} /></div><div><strong>Account issue</strong><p>Profile, payments or verification</p></div><button onClick={() => { setSent(false); setRequestType('Account support ticket') }}>Raise ticket</button></article>
      </div>
      {requestType && (
        <form className="support-request-form" onSubmit={submitSupportRequest}>
          <h3>{requestType}</h3>
          <label>
            Phone number
            <input type="tel" name="phone" required placeholder="Enter your contact number" />
          </label>
          <label>
            How can we help?
            <textarea name="details" required rows="3" placeholder="Describe the issue briefly" />
          </label>
          <div className="support-form-actions">
            <button type="button" className="reject-button" onClick={() => setRequestType('')}>Cancel</button>
            <button type="submit" className="accept-button compact">Submit request</button>
          </div>
        </form>
      )}
      {sent && <div className="success-message"><Check size={16} /> Demo request saved locally. Connect a support API to send it to operations.</div>}
    </section>
  )
}

function SettingsPage({ online, setOnline, onLogout }) {
  const [notifications, setNotifications] = useState(true)
  const [coldChain, setColdChain] = useState(true)
  const [language, setLanguage] = useState('English')
  const [languageOpen, setLanguageOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  return (
    <section className="page-section">
      <PageHeader eyebrow="Rider preferences" title="Settings" />
      <div className="settings-card">
        <button className="setting-row" onClick={() => setOnline(!online)}><div><CircleUserRound size={18} /><div><strong>Availability</strong><span>Show your online status to dispatch</span></div></div><span className={online ? 'toggle on' : 'toggle'}><i /></span></button>
        <button className="setting-row" onClick={() => setNotifications(!notifications)}><div><Bell size={18} /><div><strong>Push notifications</strong><span>Order and payment updates</span></div></div><span className={notifications ? 'toggle on' : 'toggle'}><i /></span></button>
        <button className="setting-row" onClick={() => setColdChain(!coldChain)}><div><ShieldCheck size={18} /><div><strong>Cold-chain reminders</strong><span>Temperature verification alerts</span></div></div><span className={coldChain ? 'toggle on' : 'toggle'}><i /></span></button>
        <button className="setting-row" onClick={() => setLanguageOpen((current) => !current)}><div><Settings size={18} /><div><strong>Language</strong><span>{language}</span></div></div><ChevronRight size={16} /></button>
        {languageOpen && (
          <div className="language-options" aria-label="Choose language">
            {['English', 'Hindi', 'Kannada'].map((option) => (
              <button key={option} className={language === option ? 'selected' : ''} onClick={() => { setLanguage(option); setLanguageOpen(false) }}>{option}</button>
            ))}
          </div>
        )}
        <button className="setting-row logout" onClick={() => setConfirmLogout(true)}><div><LogOut size={18} /><div><strong>Log out</strong><span>Sign out of Rider Portal</span></div></div><ChevronRight size={16} /></button>
      </div>
      {confirmLogout && (
        <div className="otp-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setConfirmLogout(false)}>
          <div className="otp-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="otp-icon"><LogOut size={22} /></div>
            <h2 id="logout-title">Sign out?</h2>
            <p className="otp-description">You can return to this demo dashboard any time.</p>
            <div className="support-form-actions">
              <button className="reject-button" onClick={() => setConfirmLogout(false)}>Cancel</button>
              <button className="accept-button compact" onClick={onLogout}>Sign out</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function App() {
  const [online, setOnline] = useState(true)
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [signedOut, setSignedOut] = useState(false)
  const [acceptedOrderIds, setAcceptedOrderIds] = useState([])
  const [rejectedOrderIds, setRejectedOrderIds] = useState([])
  const [deliveredOrderIds, setDeliveredOrderIds] = useState([])
  const [activeDeliveryOrderId, setActiveDeliveryOrderId] = useState('#RD-1049')

  const acceptOrder = (orderId) => {
    setRejectedOrderIds((current) => current.filter((id) => id !== orderId))
    setDeliveredOrderIds((current) => current.filter((id) => id !== orderId))
    setAcceptedOrderIds((current) => current.includes(orderId) ? current : [...current, orderId])
    setActiveDeliveryOrderId(orderId)
    setActiveNav('Active Delivery')
  }

  const rejectOrder = (orderId) => {
    setAcceptedOrderIds((current) => current.filter((id) => id !== orderId))
    setRejectedOrderIds((current) => current.includes(orderId) ? current : [...current, orderId])
  }

  const openDelivery = (orderId) => {
    setActiveDeliveryOrderId(orderId)
    setActiveNav('Active Delivery')
  }

  const completeDelivery = (orderId) => {
    setAcceptedOrderIds((current) => current.filter((id) => id !== orderId))
    setDeliveredOrderIds((current) => current.includes(orderId) ? current : [...current, orderId])

    const nextOrderId = acceptedOrderIds.find((id) => id !== orderId && !deliveredOrderIds.includes(id))
    if (nextOrderId) {
      setActiveDeliveryOrderId(nextOrderId)
      setActiveNav('Active Delivery')
      return
    }

    setActiveDeliveryOrderId('')
    setActiveNav('Assigned Orders')
  }

  const activeDeliveryOrder = assignedOrders.find((order) => order.id === activeDeliveryOrderId) || {
    id: '#RD-1049',
    customer: 'Priya Sharma',
    address: '12th Main Rd, Indiranagar',
  }

  if (signedOut) {
    return (
      <main className="signed-out-screen">
        <div>
          <div className="brand-mark"><Bike size={22} /></div>
          <h1>You’re signed out</h1>
          <p>This demo session has ended.</p>
          <button className="accept-button" onClick={() => { setSignedOut(false); setActiveNav('Dashboard') }}>Return to dashboard</button>
        </div>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Bike size={22} strokeWidth={2.3} /></div>
          <div>
            <strong>PREMIUM FRESH MEAT</strong>
            <span>Rider Portal</span>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, badge }) => (
            <button
              key={label}
              className={activeNav === label ? 'nav-item active' : 'nav-item'}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {badge && <b className="nav-badge">{badge}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setActiveNav('Settings')}>
            <Settings size={19} />
            <span>Settings</span>
          </button>
          <div className="rider-mini">
            <div className="avatar">AR</div>
            <div>
              <strong>Arjun Rao</strong>
              <span>Rider ID: MR-2841</span>
            </div>
            <ChevronRight size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Tuesday, 18 November</p>
            <h1>{activeNav === 'Dashboard' ? <>Good morning, Arjun <span>👋</span></> : activeNav}</h1>
          </div>

          <div className="header-actions">
            {searchOpen && (
              <div className="search-field">
                <Search size={16} />
                <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search orders" />
                <button aria-label="Close search" onClick={() => { setSearchOpen(false); setSearchQuery('') }}><X size={15} /></button>
              </div>
            )}
            {!searchOpen && (
              <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </button>
            )}
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              <span />
            </button>
            {notificationsOpen && (
              <div className="notification-popover">
                <strong>Notifications</strong>
                <p>New order assigned · 2 min ago</p>
                <p>Daily target is 78% complete</p>
              </div>
            )}
            <button className={online ? 'status-toggle online' : 'status-toggle'} onClick={() => setOnline(!online)}>
              <span className="status-dot" />
              {online ? 'Online' : 'Offline'}
            </button>
          </div>
        </header>

        {activeNav === 'Dashboard' && <section className="content-grid">
          <div className="left-column">
            <section className="stats-grid">
              {stats.map(({ label, value, trend, detail, icon: Icon, tone }) => (
                <article className="stat-card" key={label}>
                  <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
                  <div className="stat-copy">
                    <p>{label}</p>
                    <div className="stat-value-row">
                      <strong>{value}</strong>
                      {trend && <span className="trend"><TrendingUp size={12} /> {trend}</span>}
                    </div>
                    {detail && <small>{detail}</small>}
                  </div>
                </article>
              ))}
            </section>

            <section className="delivery-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Assigned order</p>
                  <h2>Next delivery</h2>
                </div>
                <span className="pickup-chip">Pickup at 11:20 AM</span>
              </div>

              <div className="delivery-content">
                <div className="order-details">
                  <div className="order-id-row">
                    <div className="order-icon"><PackageOpen size={21} /></div>
                    <div>
                      <span>Order ID</span>
                      <strong>#RD-1049</strong>
                    </div>
                    <span className="new-chip">NEW</span>
                  </div>
                  <div className="route-info">
                    <div className="route-line">
                      <span className="route-dot pickup-dot" />
                      <span className="route-stem" />
                      <span className="route-dot drop-dot" />
                    </div>
                    <div className="route-copy">
                      <div>
                        <span>Pickup</span>
                        <strong>Meatly Fresh Store</strong>
                        <small>100 Feet Rd, Indiranagar</small>
                      </div>
                      <div>
                        <span>Drop-off</span>
                        <strong>Priya Sharma</strong>
                        <small>12th Main Rd, Indiranagar</small>
                      </div>
                    </div>
                  </div>
                  <div className="order-meta">
                    <div><span>Items</span><strong>3 items</strong></div>
                    <div><span>Distance</span><strong>5.2 km</strong></div>
                    <div><span>Earnings</span><strong>₹148</strong></div>
                  </div>
                  <button className="accept-button" onClick={() => acceptOrder('#RD-1049')}>
                    <Navigation size={18} />
                    Accept & Start
                  </button>
                </div>

                <div className="map-panel" aria-label="Delivery route map">
                  <div className="map-grid" />
                  <div className="road road-one" />
                  <div className="road road-two" />
                  <div className="road road-three" />
                  <div className="map-pin start-pin"><span /></div>
                  <div className="map-pin end-pin"><MapPin size={19} fill="currentColor" /></div>
                  <div className="route-dash" />
                  <div className="map-distance"><Navigation size={14} /> 5.2 km away</div>
                </div>
              </div>
            </section>

            <section className="activity-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Latest updates</p>
                  <h2>Recent activity</h2>
                </div>
                <button className="text-button" onClick={() => setActiveNav('Delivery History')}>View all <ChevronRight size={15} /></button>
              </div>
              <div className="activity-table">
                {activities.map((item) => (
                  <div className="activity-row" key={item.id}>
                    <div className="activity-icon"><PackageCheck size={17} /></div>
                    <div className="activity-main">
                      <strong>{item.id} · {item.type}</strong>
                      <span><MapPin size={12} /> {item.place}</span>
                    </div>
                    <span className="activity-time">{item.time}</span>
                    <strong className="activity-amount">{item.amount}</strong>
                    <span className="delivered-chip">{item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="right-column">
            <section className="goal-card">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Today’s goal</p>
                  <h2>Daily target</h2>
                </div>
                <span className="goal-percent">78%</span>
              </div>
              <div className="progress-ring" style={{ '--progress': '78%' }}>
                <div>
                  <strong>12</strong>
                  <span>of 15 rides</span>
                </div>
              </div>
              <p className="goal-note">Complete <strong>3 more rides</strong> to earn your <strong>₹300 bonus</strong>.</p>
            </section>

            <section className="shift-card">
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Schedule</p>
                  <h2>Today’s shift</h2>
                </div>
                <span className="live-chip">Live</span>
              </div>
              <div className="shift-time">
                <div><span>Started</span><strong>09:00 AM</strong></div>
                <div><span>Ends</span><strong>06:00 PM</strong></div>
              </div>
              <div className="shift-progress"><span /></div>
              <div className="shift-footer">
                <Clock3 size={16} />
                <span>4h 20m remaining</span>
              </div>
            </section>
          </aside>
        </section>}
        {activeNav === 'Assigned Orders' && (
          <AssignedOrdersPage
            acceptedOrderIds={acceptedOrderIds}
            rejectedOrderIds={rejectedOrderIds}
            deliveredOrderIds={deliveredOrderIds}
            searchQuery={searchQuery}
            onAccept={acceptOrder}
            onReject={rejectOrder}
            onOpenDelivery={openDelivery}
          />
        )}
        {activeNav === 'Active Delivery' && (activeDeliveryOrderId ? (
          <ActiveDeliveryPage
            key={activeDeliveryOrderId}
            order={activeDeliveryOrder}
            onDeliveryComplete={completeDelivery}
          />
        ) : (
          <section className="page-section">
            <div className="history-empty">There is no active delivery. Browse available orders to get started.</div>
            <button className="accept-button empty-delivery-button" onClick={() => setActiveNav('Assigned Orders')}>Browse available orders</button>
          </section>
        ))}
        {activeNav === 'Delivery History' && <HistoryPage searchQuery={searchQuery} />}
        {activeNav === 'Earnings' && <EarningsPage />}
        {activeNav === 'Support' && <SupportPage />}
        {activeNav === 'Settings' && <SettingsPage online={online} setOnline={setOnline} onLogout={() => setSignedOut(true)} />}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.slice(0, 5).map(({ label, icon: Icon }) => (
          <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}>
            <Icon size={20} />
            <span>{label === 'Dashboard' ? 'Home' : label === 'Assigned Orders' ? 'Orders' : label === 'Active Delivery' ? 'Delivery' : label === 'Delivery History' ? 'History' : 'Earnings'}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
