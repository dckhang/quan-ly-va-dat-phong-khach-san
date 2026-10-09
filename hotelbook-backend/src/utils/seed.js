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
import Review from "../models/Review.js";
import Article from "../models/Article.js";

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Hotel.deleteMany({}),
    RoomType.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Payment.deleteMany({}),
    Review.deleteMany({}),
    Article.deleteMany({}),
  ]);

  await User.create({ fullName: "Admin Hệ thống", email: "admin@hotel.com", password: "123456", phone: "0900000001", role: "admin" });
  await User.create({ fullName: "Nhân viên A", email: "staff@hotel.com", password: "123456", phone: "0900000002", role: "staff" });
  const customer = await User.create({ fullName: "Nguyễn Văn Khách", email: "customer@gmail.com", password: "123456", phone: "0900000003", role: "customer" });

  // Thêm vài khách demo để seed đánh giá đa dạng
  const reviewerData = [
    { fullName: "Trần Minh Anh", email: "minhanh@gmail.com", password: "123456", phone: "0911000001", role: "customer" },
    { fullName: "Lê Hoàng Nam", email: "hoangnam@gmail.com", password: "123456", phone: "0911000002", role: "customer" },
    { fullName: "Phạm Thu Hà", email: "thuha@gmail.com", password: "123456", phone: "0911000003", role: "customer" },
    { fullName: "Võ Đức Thành", email: "ducthanh@gmail.com", password: "123456", phone: "0911000004", role: "customer" },
    { fullName: "Ngô Bảo Châu", email: "baochau@gmail.com", password: "123456", phone: "0911000005", role: "customer" },
    { fullName: "Đặng Quỳnh Chi", email: "quynhchi@gmail.com", password: "123456", phone: "0911000006", role: "customer" },
  ];
  const reviewers = [];
  for (const u of reviewerData) {
    reviewers.push(await User.create(u));
  }

  const branches = [
    // ===== ĐÀ NẴNG: 2 chi nhánh =====
    {
      name: "Kensington Đà Nẵng – Sơn Trà (Mỹ Khê)",
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
      name: "Kensington Đà Nẵng – Ngũ Hành Sơn",
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
      name: "Kensington Nha Trang – Trần Phú",
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
      name: "Kensington Nha Trang – Bãi Dài",
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
      name: "Kensington Phú Quốc – Bãi Sao",
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
      name: "Kensington Phú Quốc – Dương Đông",
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
      name: "Kensington Hà Nội – Hoàn Kiếm (Phố cổ)",
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
      name: "Kensington Hà Nội – Cầu Giấy",
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
      name: "Kensington Đà Lạt – Hồ Xuân Hương",
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
      name: "Kensington Sapa – Fansipan View",
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

    // ===== HỘI AN: 1 =====
    {
      name: "Kensington Hội An – Phố Cổ",
      address: "Số 18 Đường Nguyễn Phúc Chu, Phường Minh An, TP. Hội An, Quảng Nam",
      district: "Hội An", ward: "Minh An", city: "Hội An", province: "Quảng Nam",
      latitude: 15.8801, longitude: 108.3380,
      description: "Boutique gần phố cổ Hội An, cách chùa Cầu khoảng 5 phút đi bộ. Kiến trúc Á Đông, yên tĩnh.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
      starRating: 4,
      amenities: ["Wifi", "Hồ bơi", "Nhà hàng", "Xe đạp miễn phí", "Spa"],
      phone: "0235 111 7001",
      rooms: [
        { name: "Heritage Room", price: 1600000, capacity: 2, size: "28 m²", count: 4, bedType: "1 giường đôi", view: "View vườn / phố", bathroom: "Vòi sen", description: "Phòng phong cách phố cổ, gần trung tâm.", amenities: ["Wifi", "Máy lạnh", "TV"] },
        { name: "Lantern Suite", price: 2800000, capacity: 2, size: "40 m²", count: 2, bedType: "1 giường King", view: "View phố cổ", bathroom: "Bồn tắm", description: "Suite lãng mạn, ban công nhìn phố đèn lồng.", amenities: ["Wifi", "Ban công", "Bồn tắm"] },
      ],
    },
    // ===== VŨNG TÀU: 1 =====
    {
      name: "Kensington Vũng Tàu – Bãi Sau",
      address: "Số 25 Đường Thùy Vân, Phường 2, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
      district: "Vũng Tàu", ward: "Phường 2", city: "Vũng Tàu", province: "Bà Rịa - Vũng Tàu",
      latitude: 10.3350, longitude: 107.0920,
      description: "Mặt tiền Bãi Sau, cách biển khoảng 100m. Phù hợp cuối tuần TP.HCM.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800",
      starRating: 4,
      amenities: ["Hồ bơi", "Wifi", "Nhà hàng", "Gần biển", "Bãi đỗ xe"],
      phone: "0254 111 8001",
      rooms: [
        { name: "Sea Breeze", price: 1400000, capacity: 2, size: "30 m²", count: 5, bedType: "1 giường đôi", view: "View biển / phố", bathroom: "Vòi sen", description: "Phòng gần biển Bãi Sau, tiện tắm biển.", amenities: ["Wifi", "Máy lạnh", "Gần biển"] },
        { name: "Ocean Deluxe", price: 2400000, capacity: 3, size: "38 m²", count: 3, bedType: "1 giường King", view: "View biển Bãi Sau", bathroom: "Phòng tắm kính", description: "Ban công nhìn biển, minibar.", amenities: ["Wifi", "View biển", "Ban công", "Mini bar"] },
      ],
    },
  ];

  const createdHotels = [];
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
    createdHotels.push(hotel);
  }

  // ===== Đánh giá mẫu (tích cực, đưa lên trang chủ) =====
  const reviewSamples = [
    { user: reviewers[0], hotelIdx: 0, rating: 5, comment: "Phòng sạch sẽ, view biển đẹp, nhân viên nhiệt tình. Sẽ quay lại lần sau!" },
    { user: reviewers[1], hotelIdx: 1, rating: 5, comment: "Vị trí thuận tiện, gần trung tâm. Bữa sáng ngon, giường êm ái." },
    { user: reviewers[2], hotelIdx: 2, rating: 5, comment: "Không gian yên tĩnh, thiết kế tinh tế. Rất phù hợp nghỉ dưỡng cuối tuần." },
    { user: reviewers[3], hotelIdx: 3, rating: 4, comment: "Giá hợp lý, phòng rộng rãi. Check-in nhanh, lễ tân hỗ trợ tốt." },
    { user: reviewers[4], hotelIdx: 4, rating: 5, comment: "Trải nghiệm tuyệt vời! Hồ bơi đẹp, gần biển, dịch vụ chu đáo." },
    { user: reviewers[5], hotelIdx: 5, rating: 5, comment: "Gia đình mình rất hài lòng. Phòng family tiện nghi, trẻ em thích không gian." },
    { user: customer, hotelIdx: 6, rating: 4, comment: "Chi nhánh sạch sẽ, wifi mạnh, phù hợp công tác ngắn ngày." },
    { user: reviewers[0], hotelIdx: 7, rating: 5, comment: "View đẹp, không khí trong lành. Đáng để trải nghiệm khi đến thành phố này." },
  ];

  for (const s of reviewSamples) {
    const h = createdHotels[s.hotelIdx % createdHotels.length];
    if (!h) continue;
    await Review.create({
      userId: s.user._id,
      hotelId: h._id,
      target: "hotel",
      rating: s.rating,
      comment: s.comment,
      isFeatured: true,
      isHidden: false,
    });
  }
  console.log(`✅ Đã seed ${reviewSamples.length} đánh giá nổi bật cho trang chủ`);


  // ===== Bài viết mẫu =====
  await Article.insertMany([
    {
      title: "5 điểm đến biển đẹp nhất cùng Kensington hè này",
      excerpt: "Từ Đà Nẵng, Nha Trang đến Phú Quốc và Vũng Tàu — gợi ý lịch trình nghỉ dưỡng biển cùng chuỗi Kensington.",
      content: "Mùa hè là thời điểm lý tưởng để tận hưởng biển xanh, cát trắng. Chuỗi Kensington hiện diện tại nhiều điểm đến biển nổi bật của Việt Nam.\n\n1. Đà Nẵng – Mỹ Khê & Ngũ Hành Sơn: bãi biển đẹp, gần phố cổ Hội An.\n2. Nha Trang – Trần Phú & Bãi Dài: thành phố biển sôi động, nhiều hoạt động thể thao.\n3. Phú Quốc – Bãi Sao & Dương Đông: hoàng hôn trên đảo ngọc.\n4. Vũng Tàu – Bãi Sau: gần TP.HCM, phù hợp cuối tuần.\n\nĐặt phòng sớm trên hệ thống Kensington để giữ giá tốt và linh hoạt chọn chi nhánh.",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
      category: "cam-nang",
      authorName: "Kensington Travel",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Kinh nghiệm đặt phòng online: cọc 30% và nhận phòng an toàn",
      excerpt: "Hiểu rõ quy trình đặt cọc, chờ duyệt và check-in giúp chuyến đi suôn sẻ hơn.",
      content: "Khi đặt phòng trên Kensington, bạn chọn ngày nhận/trả, xem loại phòng còn trống rồi tạo đơn.\n\nHệ thống tính tiền cọc 30%. Sau khi chuyển khoản/quét QR, đơn ở trạng thái chờ nhân viên duyệt. Khi được duyệt, phòng được giữ chỗ.\n\nĐến ngày nhận phòng, mang theo giấy tờ tùy thân và mã đơn. Thanh toán phần còn lại khi trả phòng (hoặc theo hướng dẫn chi nhánh).\n\nMẹo: đặt trước mùa cao điểm, kiểm tra email/đơn của tôi để theo dõi trạng thái.",
      coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
      category: "cam-nang",
      authorName: "Kensington Care",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Sapa và Đà Lạt: nghỉ núi mùa se lạnh cùng Kensington",
      excerpt: "Hai điểm đến cao nguyên lý tưởng cho chuyến đi thư giãn, săn mây và thưởng thức không khí se lạnh.",
      content: "Kensington Sapa – Fansipan View mang lại tầm nhìn núi non; Kensington Đà Lạt – Hồ Xuân Hương gần trung tâm thành phố ngàn hoa.\n\nGợi ý: mang áo ấm, đặt phòng view đẹp, kết hợp tour trekking hoặc săn mây buổi sớm.\n\nĐặt trước trên website để chọn đúng hạng phòng và ngày phù hợp lịch trình.",
      coverImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
      category: "tin-tuc",
      authorName: "Kensington Travel",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Ưu đãi thành viên: tích điểm và ưu tiên giữ phòng",
      excerpt: "Thông tin về chương trình khách hàng thân thiết và cách tận dụng khi đặt qua hệ thống.",
      content: "Đăng ký tài khoản trên Kensington giúp bạn quản lý đơn đặt phòng, theo dõi trạng thái cọc và nhận thông tin ưu đãi theo mùa.\n\nTrong giai đoạn đồ án, các ưu đãi được mô phỏng; phiên bản sau có thể tích hợp tích điểm và mã giảm giá thật.\n\nHãy đăng nhập trước khi đặt để đơn được gắn với tài khoản của bạn.",
      coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800",
      category: "uu-dai",
      authorName: "Kensington",
      isPublished: true,
      isFeatured: false,
    },
  ]);
  console.log("✅ Đã seed bài viết mẫu");

  console.log("✅ Seed thành công!");
  console.log("12 chi nhánh: Đà Nẵng×2, Nha Trang×2, Phú Quốc×2, Hà Nội×2, Đà Lạt, Sapa, Hội An, Vũng Tàu");
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
