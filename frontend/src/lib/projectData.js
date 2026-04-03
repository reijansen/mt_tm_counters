export const ACADEMIC_ITEMS = [
  { label: "Developer", value: "Rei Jansen Buerom" },
  { label: "Course", value: "CMSC 141 - Automata and Language Theory" },
  { label: "Program", value: "Bachelor of Science in Computer Science" },
  { label: "Division", value: "Division of Physical Sciences and Mathematics" },
  { label: "College", value: "College of Arts and Sciences" },
  { label: "University", value: "University of the Philippines Visayas" },
];

export const LIMITATION_ITEMS = [
  "The simulator supports only fixed built-in operations: INC, DEC, CZ, CMP, CLR, and CPY.",
  "It is not a general-purpose Turing machine editor or arbitrary state-machine authoring tool.",
  "It uses binary tape encoding to represent register values.",
  "It is designed for instructional and demonstrative use rather than unrestricted machine construction.",
];

export const GUIDE_ITEMS = [
  {
    title: "Binary Tape Representation",
    description:
      "Each register is encoded as binary digits on tape. Blank cells are shown as B and represent empty tape space.",
  },
  {
    title: "Register Values",
    description:
      "Registers show the decimal interpretation of the binary tape contents at the selected step or at the end of execution.",
  },
  {
    title: "Accepted vs Rejected",
    description:
      "Accepted means the machine halted in a valid accept state for the chosen operation. Rejected means the operation condition failed.",
  },
  {
    title: "Head Positions",
    description:
      "The highlighted tape cell is the current head location. Active tapes are visually emphasized during playback.",
  },
  {
    title: "Trace Playback",
    description:
      "Playback reuses the full trace returned by the backend. It does not request step-by-step execution from the server.",
  },
];
