export const cvOptions = [
  {
    id: "industry",
    title: "Industry CV",
    description: "Concise one-page résumé for engineering roles.",
    path: "/NguyenGiaNghi_Industry_CV.pdf",
    filename: "Nicholas_Nguyen_Industry_CV.pdf",
  },
  {
    id: "academic",
    title: "Academic CV",
    description: "Detailed academic, research, and certification record.",
    path: "/NguyenGiaNghi_Academic_CV.pdf",
    filename: "Nicholas_Nguyen_Academic_CV.pdf",
  },
] as const;

export type CvOption = (typeof cvOptions)[number];
export type CvId = CvOption["id"];
