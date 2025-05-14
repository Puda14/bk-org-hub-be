const Entity = require("../models/Entity");
const genAI = require("../config/gemini");

exports.suggestClub = async (req, res) => {
  try {
    const studentInfo = req.body;

    // Lấy danh sách CLB/Lab từ DB
    const entities = await Entity.find();

    const clubDetails = entities
      .map(
        (e) => `
    - _id: ${e._id}
      name: ${e.name}
      description: ${e.description}
      executive_board: ${JSON.stringify(e.executive_board)}
      numberOfMembers: ${e.numberOfMembers}
      yearOfEstablishment: ${e.yearOfEstablishment}
      activities: ${JSON.stringify(e.activities)}
      criteria: ${
        Array.isArray(e.criteria) ? JSON.stringify(e.criteria) : e.criteria
      }
      belongTo: ${e.belongTo}
      contact: ${e.contact}
      location: ${e.location}
      type: ${e.type}
      achievements: ${JSON.stringify(e.achievements)}
      partnersAndSponsors: ${JSON.stringify(e.partnersAndSponsors)}
    `
      )
      .join("\n");

    // Tạo prompt format JSON
    const prompt = `
        Bạn là một trợ lý AI chuyên gợi ý CLB phù hợp cho sinh viên Bách Khoa.

        ## Dữ liệu sinh viên:
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

        ## Danh sách CLB/Lab từ database:
        ${clubDetails}

        ## Yêu cầu trả lời:
        - Chọn tối đa 10 CLB/Lab phù hợp nhất với sinh viên.
        - Kết quả trả về phải là mảng JSON thuần túy.
        - Mỗi phần tử gồm 3 trường: _id, name, reason.
        - Không thêm chữ thừa, chỉ trả JSON array.

        ### Ví dụ:
        [
        {
            "_id": "66433dbf8f4f020b34856e3c",
            "name": "SINNO Club",
            "reason": "Phù hợp vì định hướng AI và các dự án sáng tạo."
        }
        ]
        `;

    // Gọi Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // ✅ Clean response nếu bị Gemini trả về ```json ... ```
    if (text.startsWith("```json")) {
      text = text
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    // ✅ Parse JSON an toàn
    let suggestions;
    try {
      suggestions = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse JSON from Gemini:", parseErr);
      console.error("Raw Gemini response:", text);
      return res
        .status(500)
        .json({ error: "Failed to parse JSON from Gemini", rawResponse: text });
    }

    // ✅ Trả kết quả thành công
    res.json({ suggestions });
  } catch (err) {
    console.error("Gemini Suggest Error:", err);
    res.status(500).json({ error: err.message });
  }
};
