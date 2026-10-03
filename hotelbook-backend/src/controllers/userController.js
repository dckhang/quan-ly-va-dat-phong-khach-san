import User from "../models/User.js";

// GET /api/users  (admin)
export const getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/users  (admin) – tạo staff/admin
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    if (!["customer", "staff", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Vai trò không hợp lệ." });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email đã tồn tại." });
    }

    const user = await User.create({ fullName, email, password, phone, role });

    res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công.",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id  (admin)
export const updateUser = async (req, res) => {
  try {
    const { fullName, phone, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phone, role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }

    res.json({ success: true, message: "Cập nhật thành công.", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id  (admin – soft delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    }
    res.json({ success: true, message: "Đã khóa tài khoản người dùng." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
