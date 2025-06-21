interface List {
  name: string;
  flag?: string;
}

export const list: List[] = [
  {
    name: "--help",
    flag: "-h",
  },
  {
    name: "--version",
    flag: "-v",
  },
  {
    name: "--new",
    flag: "-n",
  },
  {
    name: "--build",
    flag: "-b",
  },
  {
    name: "--delete",
    flag: "-d",
  },
  {
    name: "--path",
    flag: "-p",
  },
  {
    name: "--template",
    flag: "-t",
  },
  {
    name: "start",
  },
];
