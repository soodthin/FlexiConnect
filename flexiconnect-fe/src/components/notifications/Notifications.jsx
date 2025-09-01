import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { authApis, endpoints } from "@configs/APIs";
import { toast } from "sonner";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const notifRef = useRef();

  // đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // load notifications
  const loadNotifications = async () => {
    try {
      let res = await authApis().get(endpoints["notifications"]);
      setNotifications(res.data || []);
      let unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("❌ Lỗi load notifications:", err);
      toast.error("Không tải được thông báo");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // actions
  const markAsRead = async (id) => {
    try {
      await authApis().patch(`${endpoints["notifications"]}/${id}/read`);
      loadNotifications();
    } catch {
      toast.error("Lỗi khi đánh dấu đã đọc");
    }
  };

  const markAsUnread = async (id) => {
    try {
      await authApis().patch(`${endpoints["notifications"]}/${id}/unread`);
      loadNotifications();
    } catch {
      toast.error("Lỗi khi đánh dấu chưa đọc");
    }
  };

  const markAllAsRead = async () => {
    try {
      await authApis().patch(`${endpoints["notifications"]}/read-all`);
      loadNotifications();
    } catch {
      toast.error("Lỗi khi đánh dấu tất cả đã đọc");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await authApis().delete(`${endpoints["notifications"]}/${id}/user`);
      loadNotifications();
    } catch {
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      {/* nút chuông */}
      <button
        onClick={() => setShowNotifications((v) => !v)}
        className="relative p-2 rounded-full bg-[#f5efe6] dark:bg-[#232323] border border-[#d1d5db] dark:border-[#444] shadow hover:scale-110 transition"
      >
        <FaBell className="text-xl text-gray-700 dark:text-[#f5efe6]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* dropdown danh sách noti */}
      {showNotifications && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#232323] border border-gray-100 dark:border-[#444] rounded-2xl shadow-xl z-40">
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-[#444]">
            <span className="font-semibold text-sm">Thông báo</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 cursor-default">
              Không có thông báo
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-[#444]">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-4 flex justify-between items-start cursor-pointer hover:bg-[#f5efe6] dark:hover:bg-[#353535] ${
                    !n.isRead ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedNotif(n);
                    if (!n.isRead) markAsRead(n.id);
                  }}
                >
                  <div>
                    <p className="text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.content}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    {n.isRead ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsUnread(n.id);
                        }}
                        className="text-yellow-600 text-xs"
                      >
                        Chưa đọc
                      </button>
                    ) : null}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="text-red-600 text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* dialog chi tiết noti */}
      {selectedNotif && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-[#232323] rounded-2xl shadow-lg w-[400px] max-w-full p-6">
            <h2 className="text-lg font-bold mb-3">
              {selectedNotif.title || "Thông báo"}
            </h2>
            <p className="mb-2">{selectedNotif.content}</p>
            {selectedNotif.linkTo && (
              <a
                href={selectedNotif.linkTo}
                className="text-blue-600 hover:underline text-sm"
              >
                Xem chi tiết
              </a>
            )}
            <div className="text-xs text-gray-400 mt-3">
              {selectedNotif.createdAt
                ? new Date(selectedNotif.createdAt).toLocaleString("vi-VN")
                : ""}
            </div>
            <button
              onClick={() => setSelectedNotif(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
