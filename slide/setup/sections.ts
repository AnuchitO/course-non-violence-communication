// Talk sections. `module: N` in a slide's frontmatter picks one of these.
// Modern, clear colours on a light-blue base; readable in light and dark mode.
// The four NVC components keep the same colour everywhere in the deck
// (Observation = green, Feelings = rose, Needs = amber, Requests = violet).
export interface Section { name: string; thai?: string; color: string; weight: number }

export const SECTIONS: Section[] = [
  { name: 'Welcome', thai: 'เริ่มต้น', color: '#3b82f6', weight: 5 },
  { name: 'Jackal & Giraffe', thai: 'หมาป่ากับยีราฟ', color: '#f07a5a', weight: 3 },
  { name: 'What is NVC', thai: 'การสื่อสารอย่างสันติ', color: '#0ea5b7', weight: 6 },
  { name: 'Observation', thai: 'การสังเกต', color: '#2fa37a', weight: 8 },
  { name: 'Feelings', thai: 'ความรู้สึก', color: '#e45f7f', weight: 11 },
  { name: 'Needs', thai: 'ความต้องการ', color: '#e6a23c', weight: 9 },
  { name: 'Requests', thai: 'การขอร้อง', color: '#7a68e0', weight: 6 },
  { name: 'Putting it together', thai: 'รวมทุกอย่างเข้าด้วยกัน', color: '#2563eb', weight: 7 },
  { name: 'Heart of NVC', thai: 'หัวใจของ NVC', color: '#db5a8c', weight: 8 },
]
