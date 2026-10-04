import { useState } from "react"

const links = [
  {
    id: "phone",
    label: "Gọi điện",
    href: "tel:19001234",
    bg: "bg-green-500 hover:bg-green-600",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
      </svg>
    ),
  },
  {
    id: "zalo",
    label: "Zalo",
    href: "https://zalo.me/0981763462",
    bg: "bg-white hover:bg-gray-100 border border-gray-200",
    textDark: true,
    icon: (
      <img src="/zalo.png" alt="Zalo" className="w-6 h-6 object-contain" />
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/dck.2005",
    bg: "bg-[#1877F2] hover:bg-[#0d65d9]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.09 16.1 2 14.8 2 11.9 2 10 3.79 10 7.15V9.5H7v4h3V22h4v-8.5z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    href: "https://t.me/",
    bg: "bg-[#26A5E4] hover:bg-[#1c8fc7]",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.78 15.44l-.4 4.1c.57 0 .82-.24 1.12-.53l2.7-2.58 5.6 4.1c1.02.57 1.75.27 2.03-.95l3.68-17.3h.01c.33-1.53-.55-2.13-1.55-1.76L1.74 9.4C.26 9.97.28 10.8 1.48 11.17l5.3 1.65L18.3 5.9c.6-.4 1.15-.18.7.22L9.78 15.44z" />
      </svg>
    ),
  },
]

export default function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* danh sách icon */}
      <div
        className={
          "flex flex-col items-end gap-2 transition-all duration-300 " +
          (open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none")
        }
      >
        {links.map((l) => (
          <a
            key={l.id}
            href={l.href}
            target={l.id === "phone" ? undefined : "_blank"}
            rel="noreferrer"
            title={l.label}
            className={
              "flex items-center gap-2 shadow-lg rounded-full pl-3 pr-3 h-11 min-w-[2.75rem] " +
              l.bg +
              " " +
              (l.textDark ? "text-navy-900" : "text-white") +
              " transition transform hover:scale-105"
            }
          >
            {l.icon}
            <span className="text-sm font-medium pr-1 hidden sm:inline">{l.label}</span>
          </a>
        ))}
      </div>

      {/* nút mở / đóng */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Liên hệ"
        className={
          "w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-navy-900 font-bold transition " +
          (open ? "bg-gray-200 hover:bg-gray-300" : "bg-gold-400 hover:bg-gold-500")
        }
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
