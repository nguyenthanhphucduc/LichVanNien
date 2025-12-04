import { GoogleGenAI } from "@google/genai";
import { LunarDate, SolarDate, ZodiacSign } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyWisdom = async (solar: SolarDate, lunar: LunarDate, canChi: string, zodiac: ZodiacSign | null) => {
  try {
    const zodiacContext = zodiac ? `Người xem thuộc cung hoàng đạo: ${zodiac}.` : "";
    
    const prompt = `
      Bạn là một chuyên gia văn hóa, tử vi và phong thủy.
      Hôm nay là Dương lịch: ${solar.day}/${solar.month}/${solar.year}.
      Âm lịch: ${lunar.day}/${lunar.month}/${lunar.year} (${canChi}).
      ${zodiacContext}
      
      Hãy cho tôi một lời khuyên ngắn gọn (dưới 60 từ) về vận trình, những việc nên làm hoặc cần tránh trong ngày hôm nay.
      Nếu có thông tin cung hoàng đạo, hãy kết hợp phong thủy ngày âm lịch với tính cách/vận hạn của cung ${zodiac} để đưa ra lời khuyên cụ thể hơn.
      Văn phong chiêm nghiệm, nhẹ nhàng, sâu sắc. Chỉ trả về nội dung lời khuyên.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || `Chúc cung ${zodiac || 'bạn'} một ngày an lành và hạnh phúc.`;
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return "Tâm an vạn sự an. Chúc bạn một ngày tốt lành.";
  }
};
