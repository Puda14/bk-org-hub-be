const Entity = require("../models/Entity");
const genAI = require("../config/gemini");

exports.suggestClub = async (req, res) => {
  try {
    const studentInfo = req.body;

    // Lấy danh sách club/lab từ DB
    const entities = await Entity.find();

    // Chuẩn bị prompt cho Gemini
    const prompt = `
Dữ liệu sinh viên:
Họ và tên: ${studentInfo.fullName}
Gmail cá nhân: ${studentInfo.personalEmail}
Gmail trường: ${studentInfo.schoolEmail}
Mã số sinh viên: ${studentInfo.studentId}
Khoá: ${studentInfo.course}
Trường: ${studentInfo.school}
Ngành: ${studentInfo.major}
Lớp: ${studentInfo.class}
Kỹ năng chuyên môn: ${studentInfo.techSkills}
Kỹ năng mềm: ${studentInfo.softSkills}
Định hướng nghề nghiệp: ${studentInfo.careerGoals}
Thành tựu: ${studentInfo.achievements}
Trình độ ngoại ngữ: ${studentInfo.languageSkills}

Danh sách các CLB/Lab trong database:
${entities
  .map((e, index) => `${index + 1}. ${e.name} - ${e.description}`)
  .join("\n")}

Hãy chọn ra những CLB/Lab phù hợp nhất với sinh viên này và giải thích ngắn gọn vì sao phù hợp.
Trả lời bằng tiếng Việt, dạng bullet point.
`;

    // Gọi Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ suggestion: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
