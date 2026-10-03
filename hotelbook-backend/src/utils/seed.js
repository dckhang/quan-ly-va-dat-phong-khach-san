import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Hotel.deleteMany({}),
    RoomType.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  await User.create({ fullName: "Admin Hệ thống", email: "admin@hotel.com", password: "123456", phone: "0900000001", role: "admin" });
  await User.create({ fullName: "Nhân viên A", email: "staff@hotel.com", password: "123456", phone: "0900000002", role: "staff" });
  await User.create({ fullName: "Nguyễn Văn Khách", email: "customer@gmail.com", password: "123456", phone: "0900000003", role: "customer" });

  const branches = [
    // ===== ĐÀ NẴNG: 2 chi nhánh =====
    {
      name: "HotelBook Đà Nẵng – Sơn Trà (Mỹ Khê)",
      address: "Số 15 Đường Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng",
      district: "Sơn Trà", ward: "Phước Mỹ", city: "Đà Nẵng", province: "Đà Nẵng",
      latitude: 16.0599, longitude: 108.2442,
      description: "Chi nhánh mặt tiền Võ Nguyên Giáp, cách bãi Mỹ Khê khoảng 200m. Hồ bơi vô cực, spa, bar rooftop.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800",
      starRating: 5,
      amenities: ["Hồ bơi vô cực", "Spa", "Nhà hàng", "Wifi", "Đưa đón sân bay", "Bar rooftop"],
      phone: "0236 111 1001",
      rooms: [
        { name: "Deluxe Ocean View", price: 2500000, capacity: 2, size: "35 m²", count: 4, bedType: "1 giường King", view: "View biển Mỹ Khê", bathroom: "Phòng tắm kính, vòi sen mưa", description: "Phòng 35m² ban công nhìn biển, minibar, TV 55 inch.", amenities: ["Wifi", "Mini bar", "Ban công", "Máy lạnh"] },
        { name: "Premier Suite", price: 4500000, capacity: 3, size: "55 m²", count: 2, bedType: "1 giường King + sofa", view: "View biển panorama", bathroom: "Bồn tắm + vòi sen", description: "Suite có phòng khách riêng, ban công lớn.", amenities: ["Wifi", "Living room", "Bồn tắm", "Bữa sáng"] },
      ],
    },
    {
      name: "HotelBook Đà Nẵng – Ngũ Hành Sơn",
      address: "Số 88 Đường Trường Sa, Phường Hòa Hải, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
      district: "Ngũ Hành Sơn", ward: "Hòa Hải", city: "Đà Nẵng", province: "Đà Nẵng",
      latitude: 15.9889, longitude: 108.2667,
      description: "Chi nhánh gần biển Non Nước và ngũ hành sơn, yên tĩnh hơn khu trung tâm. Phù hợp nghỉ dưỡng gia đình.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
      starRating: 4,
      amenities: ["Hồ bơi", "Wifi", "Nhà hàng", "Bãi đỗ xe", "Gần biển Non Nước"],
      phone: "0236 111 1002",
      rooms: [
        { name: "Superior Garden", price: 1800000, capacity: 2, size: "30 m²", count: 4, bedType: "1 giường đôi", view: "View vườn", bathroom: "Phòng tắm riêng", description: "Phòng hướng vườn, yên tĩnh, gần hồ bơi.", amenities: ["Wifi", "Máy lạnh", "TV"] },
        { name: "Family Connecting", price: 3200000, capacity: 4, size: "50 m²", count: 2, bedType: "2 giường đôi", view: "View vườn / một phần biển", bathroom: "2 phòng tắm", description: "Hai phòng thông nhau, phù hợp gia đình 4 người.", amenities: ["Wifi", "2 giường", "Tủ lạnh"] },
      ],
    },
    // ===== NHA TRANG: 2 chi nhánh =====
    {
      name: "HotelBook Nha Trang – Trần Phú",
      address: "Số 78 Đường Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa",
      district: "Nha Trang", ward: "Lộc Thọ", city: "Nha Trang", province: "Khánh Hòa",
      latitude: 12.2388, longitude: 109.1967,
      description: "Ngay trung tâm Trần Phú, cách biển ~150m, gần chợ Đầm và tháp Trầm Hương.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Nhà hàng", "Gym", "Bãi đỗ xe", "Lễ tân 24/7"],
      phone: "0258 111 2001",
      rooms: [
        { name: "Superior City", price: 1200000, capacity: 2, size: "28 m²", count: 5, bedType: "1 giường đôi", view: "View phố Trần Phú", bathroom: "Vòi sen", description: "Phòng tiêu chuẩn trung tâm, tiện đi bộ ra biển.", amenities: ["Wifi", "Máy lạnh", "TV"] },
        { name: "Deluxe Sea View", price: 2200000, capacity: 2, size: "38 m²", count: 3, bedType: "1 giường King", view: "View biển Nha Trang", bathroom: "Phòng tắm kính", description: "Ban công riêng nhìn vịnh Nha Trang.", amenities: ["Wifi", "View biển", "Ban công", "Mini bar"] },
      ],
    },
    {
      name: "HotelBook Nha Trang – Bãi Dài",
      address: "Khu du lịch Bãi Dài, Xã Cam Hải Đông, Huyện Cam Lâm, Khánh Hòa",
      district: "Cam Lâm", ward: "Cam Hải Đông", city: "Nha Trang", province: "Khánh Hòa",
      latitude: 12.0167, longitude: 109.2167,
      description: "Chi nhánh nghỉ dưỡng Bãi Dài, cách trung tâm Nha Trang ~30 phút. Bãi biển dài, yên tĩnh, phù hợp gia đình và cặp đôi.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
      starRating: 5,
      amenities: ["Hồ bơi", "Spa", "Bãi biển riêng", "Wifi", "Nhà hàng", "Xe đưa đón"],
      phone: "0258 111 2002",
      rooms: [
        { name: "Beach Bungalow", price: 2800000, capacity: 2, size: "40 m²", count: 4, bedType: "1 giường King", view: "View biển Bãi Dài", bathroom: "Outdoor shower", description: "Bungalow gần biển, sân nhỏ, võng.", amenities: ["Wifi", "Gần biển", "Mini bar"] },
        { name: "Ocean Villa", price: 5200000, capacity: 4, size: "75 m²", count: 2, bedType: "1 King + 1 giường phụ", view: "View biển + hồ bơi", bathroom: "2 phòng tắm, bồn tắm", description: "Villa riêng có phòng khách, bếp nhỏ.", amenities: ["Wifi", "Bếp", "Hồ bơi", "2 phòng tắm"] },
      ],
    },
    // ===== PHÚ QUỐC: 2 chi nhánh =====
    {
      name: "HotelBook Phú Quốc – Bãi Sao",
      address: "Tổ 5, Ấp Bãi Sao, Xã Hàm Ninh, Thành phố Phú Quốc, Kiên Giang",
      district: "Phú Quốc", ward: "Hàm Ninh", city: "Phú Quốc", province: "Kiên Giang",
      latitude: 10.2167, longitude: 104.0167,
      description: "Gần Bãi Sao – bãi biển đẹp nhất đảo. Cách Dương Đông 20–25 phút xe.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
      starRating: 5,
      amenities: ["Hồ bơi", "Spa", "Nhà hàng", "Wifi", "Xe đưa đón", "Bãi biển riêng"],
      phone: "0297 111 3001",
      rooms: [
        { name: "Beach Room", price: 3200000, capacity: 2, size: "40 m²", count: 4, bedType: "1 giường King", view: "View vườn / hướng biển", bathroom: "Outdoor shower + trong nhà", description: "Phòng tropical, gần cát trắng 2–3 phút đi bộ.", amenities: ["Wifi", "Outdoor shower", "Mini bar", "Gần biển"] },
        { name: "Garden Villa", price: 5500000, capacity: 4, size: "80 m²", count: 2, bedType: "1 King + sofa", view: "View vườn, hồ bơi", bathroom: "2 phòng tắm, bồn tắm", description: "Villa có phòng khách, bếp nhỏ, sân vườn.", amenities: ["Wifi", "Bếp nhỏ", "Hồ bơi", "Sân vườn"] },
      ],
    },
    {
      name: "HotelBook Phú Quốc – Dương Đông",
      address: "Số 45 Đường Trần Hưng Đạo, Dương Đông, Thành phố Phú Quốc, Kiên Giang",
      district: "Phú Quốc", ward: "Dương Đông", city: "Phú Quốc", province: "Kiên Giang",
      latitude: 10.2270, longitude: 103.9670,
      description: "Chi nhánh trung tâm Dương Đông, gần chợ đêm, cáp treo Hòn Thơm. Thuận tiện mua sắm và ẩm thực.",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Nhà hàng", "Gym", "Đưa đón sân bay", "Gần chợ đêm"],
      phone: "0297 111 3002",
      rooms: [
        { name: "City Standard", price: 1500000, capacity: 2, size: "28 m²", count: 5, bedType: "1 giường đôi", view: "View phố", bathroom: "Vòi sen", description: "Phòng trung tâm, gần chợ đêm Dương Đông.", amenities: ["Wifi", "Máy lạnh", "TV"] },
        { name: "Deluxe Pool Access", price: 2800000, capacity: 2, size: "36 m²", count: 3, bedType: "1 giường King", view: "View hồ bơi", bathroom: "Phòng tắm kính", description: "Ra hồ bơi trực tiếp từ phòng.", amenities: ["Wifi", "Hồ bơi", "Mini bar"] },
      ],
    },
    // ===== HÀ NỘI: 2 chi nhánh =====
    {
      name: "HotelBook Hà Nội – Hoàn Kiếm (Phố cổ)",
      address: "Số 22 Phố Hàng Bông, Phường Hàng Bông, Quận Hoàn Kiếm, Hà Nội",
      district: "Hoàn Kiếm", ward: "Hàng Bông", city: "Hà Nội", province: "Hà Nội",
      latitude: 21.0285, longitude: 105.8489,
      description: "Boutique phố cổ, cách Hồ Gươm 5–7 phút đi bộ. Gần Nhà thờ Lớn, phố cổ.",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Nhà hàng", "Bar", "Concierge", "Giặt ủi"],
      phone: "024 111 4001",
      rooms: [
        { name: "Standard Room", price: 900000, capacity: 2, size: "22 m²", count: 6, bedType: "1 giường đôi", view: "View phố / giếng trời", bathroom: "Vòi sen", description: "Phòng gọn trung tâm phố cổ.", amenities: ["Wifi", "Máy lạnh", "TV"] },
        { name: "Deluxe Room", price: 1500000, capacity: 2, size: "30 m²", count: 3, bedType: "1 giường King", view: "View phố cổ", bathroom: "Bồn tắm nhỏ", description: "Cửa sổ lớn, cách âm, máy pha cà phê.", amenities: ["Wifi", "King bed", "Cách âm"] },
      ],
    },
    {
      name: "HotelBook Hà Nội – Cầu Giấy",
      address: "Số 120 Đường Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
      district: "Cầu Giấy", ward: "Dịch Vọng Hậu", city: "Hà Nội", province: "Hà Nội",
      latitude: 21.0367, longitude: 105.7820,
      description: "Gần Đại học Quốc gia, keangnam, trung tâm Cầu Giấy. Phù hợp công tác và khách đi họp.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Phòng họp", "Nhà hàng", "Gym", "Bãi đỗ xe"],
      phone: "024 111 4002",
      rooms: [
        { name: "Business Room", price: 1100000, capacity: 2, size: "28 m²", count: 5, bedType: "1 giường đôi", view: "View phố", bathroom: "Vòi sen", description: "Bàn làm việc rộng, wifi mạnh, phù hợp công tác.", amenities: ["Wifi", "Bàn làm việc", "TV"] },
        { name: "Executive Suite", price: 2200000, capacity: 2, size: "42 m²", count: 2, bedType: "1 giường King", view: "View thành phố", bathroom: "Bồn tắm", description: "Suite có phòng khách, máy pha cà phê.", amenities: ["Wifi", "Living room", "Bồn tắm"] },
      ],
    },
    // ===== ĐÀ LẠT: 1 =====
    {
      name: "HotelBook Đà Lạt – Hồ Xuân Hương",
      address: "Số 5 Đường Trần Quốc Toản, Phường 1, TP. Đà Lạt, Lâm Đồng",
      district: "Đà Lạt", ward: "Phường 1", city: "Đà Lạt", province: "Lâm Đồng",
      latitude: 11.9404, longitude: 108.4583,
      description: "Gần Hồ Xuân Hương và chợ Đà Lạt. Không khí mát, có lò sưởi một số phòng.",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Lò sưởi", "Nhà hàng", "Vườn hoa", "Bãi đỗ xe"],
      phone: "0263 111 5001",
      rooms: [
        { name: "Pine View", price: 1100000, capacity: 2, size: "28 m²", count: 4, bedType: "1 giường đôi", view: "View rừng thông", bathroom: "Nước nóng", description: "Ấm cúng, máy sưởi, gần trung tâm.", amenities: ["Wifi", "Máy sưởi", "View thông"] },
        { name: "Couple Suite", price: 1800000, capacity: 2, size: "35 m²", count: 2, bedType: "1 giường King", view: "View hồ / đồi", bathroom: "Bồn tắm", description: "Suite lãng mạn, lò sưởi, ban công nhỏ.", amenities: ["Wifi", "Bồn tắm", "Lò sưởi"] },
      ],
    },
    // ===== SAPA: 1 =====
    {
      name: "HotelBook Sapa – Fansipan View",
      address: "Số 12 Đường Đồng Tuyển, Thị trấn Sa Pa, Huyện Sa Pa, Lào Cai",
      district: "Sa Pa", ward: "Thị trấn Sa Pa", city: "Sapa", province: "Lào Cai",
      latitude: 22.3364, longitude: 103.8439,
      description: "View Fansipan và thung lũng, cách chợ Sapa 8–10 phút. Hỗ trợ tour trekking.",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Lò sưởi", "Nhà hàng", "Tour trekking", "View núi"],
      phone: "0214 111 6001",
      rooms: [
        { name: "Mountain View", price: 1000000, capacity: 2, size: "26 m²", count: 5, bedType: "1 giường đôi", view: "View Fansipan", bathroom: "Nước nóng", description: "Nhìn núi và thung lũng, máy sưởi.", amenities: ["Wifi", "Máy sưởi", "View núi"] },
        { name: "Family Cabin", price: 2000000, capacity: 4, size: "45 m²", count: 2, bedType: "2 giường đôi", view: "View núi", bathroom: "Phòng tắm rộng", description: "Cabin gia đình 3–4 người.", amenities: ["Wifi", "2 giường", "Máy sưởi"] },
      ],
    },
  ];

  for (const b of branches) {
    const hotel = await Hotel.create({
      name: b.name,
      address: b.address,
      district: b.district,
      ward: b.ward,
      city: b.city,
      province: b.province,
      latitude: b.latitude,
      longitude: b.longitude,
      description: b.description,
      image: b.image,
      starRating: b.starRating,
      amenities: b.amenities,
      phone: b.phone,
      checkInTime: "14:00",
      checkOutTime: "12:00",
    });

    let floor = 1;
    for (const r of b.rooms) {
      const rt = await RoomType.create({
        hotelId: hotel._id,
        name: r.name,
        description: r.description,
        bedType: r.bedType,
        view: r.view,
        bathroom: r.bathroom,
        basePrice: r.price,
        capacity: r.capacity,
        size: r.size,
        amenities: r.amenities,
        images: [b.image],
      });
      for (let i = 1; i <= r.count; i++) {
        await Room.create({
          roomNumber: `${floor}${String(i).padStart(2, "0")}`,
          roomTypeId: rt._id,
          hotelId: hotel._id,
          floor,
          status: "available",
        });
      }
      floor++;
    }
  }

  console.log("✅ Seed thành công!");
  console.log("Đà Nẵng: 2 chi nhánh | Nha Trang: 2 | Phú Quốc: 2 | Hà Nội: 2 | Đà Lạt: 1 | Sapa: 1");
  console.log("Admin: admin@hotel.com / 123456");
  console.log("Staff: staff@hotel.com / 123456");
  console.log("Customer: customer@gmail.com / 123456");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
